import axios from 'axios';
import * as cheerio from 'cheerio';

// CORS 헤더 설정
function setCORS(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

// 각 사이트 개별 테스트 (자세한 에러 로깅)
async function testSite(name, url, selector, titleSelector, linkSelector) {
  const result = {
    name,
    url,
    success: false,
    posts: [],
    error: null,
    statusCode: null,
    responseSize: null,
    selectors: { main: selector, title: titleSelector, link: linkSelector }
  };

  try {
    console.log(`\n🔍 ${name} 테스트 시작...`);
    console.log(`   URL: ${url}`);
    
    const startTime = Date.now();
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'none'
      },
      timeout: 15000,
      maxRedirects: 5
    });
    
    const loadTime = Date.now() - startTime;
    
    result.statusCode = response.status;
    result.responseSize = response.data.length;
    result.loadTime = loadTime;
    
    console.log(`   ✅ HTTP ${response.status} (${loadTime}ms)`);
    console.log(`   📦 응답 크기: ${(response.data.length / 1024).toFixed(2)}KB`);
    
    const $ = cheerio.load(response.data);
    const posts = [];
    
    $(selector).each((i, el) => {
      if (i >= 3) return false; // 테스트용 3개만
      
      const title = $(el).find(titleSelector).text().trim();
      const href = $(el).find(linkSelector).attr('href');
      
      if (title && href) {
        posts.push({ title, href });
      }
    });
    
    result.posts = posts;
    result.success = posts.length > 0;
    
    if (result.success) {
      console.log(`   ✅ 크롤링 성공! ${posts.length}개 게시글 발견`);
    } else {
      console.log(`   ⚠️ 게시글을 찾지 못했습니다`);
      console.log(`   🔍 셀렉터: ${selector}`);
      
      // HTML 구조 일부 출력
      const bodyText = $('body').text().substring(0, 200);
      console.log(`   📄 페이지 내용 샘플: ${bodyText}...`);
    }
    
  } catch (error) {
    result.error = {
      message: error.message,
      code: error.code,
      stack: error.stack?.split('\n')[0]
    };
    
    console.log(`   ❌ 에러 발생: ${error.message}`);
    
    if (error.response) {
      result.statusCode = error.response.status;
      console.log(`   📊 HTTP 상태: ${error.response.status}`);
      console.log(`   📋 응답 헤더:`, error.response.headers);
    } else if (error.code) {
      console.log(`   🔌 연결 에러: ${error.code}`);
    }
  }
  
  return result;
}

// 메인 핸들러
export default async function handler(req, res) {
  setCORS(res);
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  console.log('\n' + '='.repeat(60));
  console.log('🚀 전체 사이트 크롤링 디버깅 테스트 시작');
  console.log('='.repeat(60));

  const sites = [
    {
      name: '클리앙',
      url: 'https://www.clien.net/service/board/park?&od=T31&po=0',
      selector: '.list_item',
      titleSelector: '.subject_fixed',
      linkSelector: '.list_subject a'
    },
    {
      name: '뽐뿌',
      url: 'https://www.ppomppu.co.kr/zboard/zboard.php?id=freeboard',
      selector: 'table.board_table tr',
      titleSelector: '.list_title a',
      linkSelector: '.list_title a'
    },
    {
      name: '개드립',
      url: 'https://www.dogdrip.net/dogdrip',
      selector: '.ed .title a',
      titleSelector: '',
      linkSelector: ''
    },
    {
      name: '오늘의유머',
      url: 'http://www.todayhumor.co.kr/board/list.php?table=bestofbest',
      selector: '.table_list tr',
      titleSelector: '.subject a',
      linkSelector: '.subject a'
    },
    {
      name: '에펨코리아',
      url: 'https://www.fmkorea.com/best',
      selector: '.list-table tbody tr',
      titleSelector: '.hx a',
      linkSelector: '.hx a'
    },
    {
      name: '보배드림',
      url: 'https://www.bobaedream.co.kr/cyber/CyberCommunity.php?gubun=K',
      selector: 'tr.pl10',
      titleSelector: '.pl14 a',
      linkSelector: '.pl14 a'
    },
    {
      name: 'SLR클럽',
      url: 'https://www.slrclub.com/bbs/zboard.php?id=free',
      selector: 'table.list_table tbody tr',
      titleSelector: '.sbj a',
      linkSelector: '.sbj a'
    },
    {
      name: '인벤',
      url: 'https://www.inven.co.kr/board/webzine/3371',
      selector: '.board-list tbody tr',
      titleSelector: '.subject a',
      linkSelector: '.subject a'
    },
    {
      name: 'MLB파크',
      url: 'http://mlbpark.donga.com/mp/b.php?m=search&b=bullpen&query=&select=stt&user=&sia=&emd=&sdt=&edt=&ct=1',
      selector: 'table.tbl_type01 tr',
      titleSelector: 'td.tit a',
      linkSelector: 'td.tit a'
    }
  ];

  const results = [];
  
  // 순차적으로 테스트 (병렬은 서버 부담)
  for (const site of sites) {
    const result = await testSite(
      site.name,
      site.url,
      site.selector,
      site.titleSelector,
      site.linkSelector
    );
    results.push(result);
    
    // 다음 요청 전 짧은 대기
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  console.log('\n' + '='.repeat(60));
  console.log('📊 전체 테스트 결과 요약');
  console.log('='.repeat(60));
  
  const summary = {
    total: results.length,
    success: results.filter(r => r.success).length,
    failed: results.filter(r => !r.success).length,
    results: results.map(r => ({
      name: r.name,
      success: r.success,
      postsFound: r.posts.length,
      statusCode: r.statusCode,
      loadTime: r.loadTime,
      error: r.error?.message || null
    }))
  };
  
  console.log(`✅ 성공: ${summary.success}개`);
  console.log(`❌ 실패: ${summary.failed}개`);
  console.log('');
  
  results.forEach(r => {
    console.log(`${r.success ? '✅' : '❌'} ${r.name}: ${r.success ? r.posts.length + '개' : r.error?.message || '실패'}`);
  });

  res.status(200).json({
    summary,
    details: results,
    timestamp: new Date().toISOString()
  });
}
