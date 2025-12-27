import axios from 'axios';
import * as cheerio from 'cheerio';

// CORS 헤더 설정
function setCORS(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

// 클리앙 크롤링
async function crawlClien() {
  try {
    const { data } = await axios.get('https://www.clien.net/service/board/park?&od=T31&po=0', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      timeout: 15000 // 15초 제한
    });
    
    const $ = cheerio.load(data);
    const posts = [];
    
    $('.list_item').each((i, el) => {
      if (i >= 15) return false;
      
      const title = $(el).find('.subject_fixed').text().trim();
      const link = 'https://www.clien.net' + $(el).find('.list_subject a').attr('href');
      const views = $(el).find('.list_hit').text().trim();
      const comments = $(el).find('.list_reply').text().trim();
      
      if (title && link) {
        posts.push({
          site: 'clien',
          siteName: '클리앙',
          siteColor: '#34495e',
          title: title,
          link: link,
          views: parseInt(views) || 0,
          comments: parseInt(comments) || 0,
          timeAgo: '방금 전'
        });
      }
    });
    
    return posts;
  } catch (error) {
    console.error('클리앙 크롤링 실패:', error.message);
    return [];
  }
}

// 루리웹 크롤링
async function crawlRuliweb() {
  try {
    const { data } = await axios.get('https://bbs.ruliweb.com/community/board/300143', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      timeout: 15000 // 15초 제한
    });
    
    const $ = cheerio.load(data);
    const posts = [];
    
    $('.board_list_wrapper .table_body tr').each((i, el) => {
      if (i >= 15) return false;
      
      const title = $(el).find('.subject_link').text().trim();
      const link = 'https://bbs.ruliweb.com' + $(el).find('.subject_link').attr('href');
      const views = $(el).find('.hit').text().trim();
      const comments = $(el).find('.reply_num').text().trim();
      
      if (title && link) {
        posts.push({
          site: 'ruliweb',
          siteName: '루리웹',
          siteColor: '#3498db',
          title: title,
          link: link,
          views: parseInt(views) || 0,
          comments: parseInt(comments) || 0,
          timeAgo: '방금 전'
        });
      }
    });
    
    return posts;
  } catch (error) {
    console.error('루리웹 크롤링 실패:', error.message);
    return [];
  }
}

// 뽐뿌 크롤링
async function crawlPpomppu() {
  try {
    const { data } = await axios.get('https://www.ppomppu.co.kr/zboard/zboard.php?id=freeboard', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      timeout: 15000 // 15초 제한
    });
    
    const $ = cheerio.load(data);
    const posts = [];
    
    $('table.board_table tr').each((i, el) => {
      if (i >= 15) return false;
      
      const title = $(el).find('.list_title a').text().trim();
      const link = 'https://www.ppomppu.co.kr/zboard/' + $(el).find('.list_title a').attr('href');
      const views = $(el).find('.list_hit').text().trim();
      
      if (title && link && !link.includes('undefined')) {
        posts.push({
          site: 'ppomppu',
          siteName: '뽐뿌',
          siteColor: '#9b59b6',
          title: title,
          link: link,
          views: parseInt(views) || 0,
          comments: 0,
          timeAgo: '방금 전'
        });
      }
    });
    
    return posts;
  } catch (error) {
    console.error('뽐뿌 크롤링 실패:', error.message);
    return [];
  }
}

// 개드립 크롤링
async function crawlDogdrip() {
  try {
    const { data } = await axios.get('https://www.dogdrip.net/dogdrip', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      timeout: 15000 // 15초 제한
    });
    
    const $ = cheerio.load(data);
    const posts = [];
    
    $('.ed .title a').each((i, el) => {
      if (i >= 15) return false;
      
      const title = $(el).text().trim();
      const link = 'https://www.dogdrip.net' + $(el).attr('href');
      
      if (title && link) {
        posts.push({
          site: 'dogdrip',
          siteName: '개드립',
          siteColor: '#ff5722',
          title: title,
          link: link,
          views: 0,
          comments: 0,
          timeAgo: '방금 전'
        });
      }
    });
    
    return posts;
  } catch (error) {
    console.error('개드립 크롤링 실패:', error.message);
    return [];
  }
}

// 오늘의유머 크롤링
async function crawlTodayhumor() {
  try {
    const { data } = await axios.get('http://www.todayhumor.co.kr/board/list.php?table=bestofbest', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      timeout: 15000 // 15초 제한
    });
    
    const $ = cheerio.load(data);
    const posts = [];
    
    $('.table_list tr').each((i, el) => {
      if (i >= 15) return false;
      
      const title = $(el).find('.subject a').text().trim();
      const href = $(el).find('.subject a').attr('href');
      const link = href ? 'http://www.todayhumor.co.kr' + href : '';
      
      if (title && link) {
        posts.push({
          site: 'todayhumor',
          siteName: '오늘의유머',
          siteColor: '#e67e22',
          title: title,
          link: link,
          views: 0,
          comments: 0,
          timeAgo: '방금 전'
        });
      }
    });
    
    return posts;
  } catch (error) {
    console.error('오늘의유머 크롤링 실패:', error.message);
    return [];
  }
}

// 디시인사이드 크롤링 (시도)
async function crawlDcinside() {
  try {
    const { data } = await axios.get('https://gall.dcinside.com/board/lists/?id=dcbest', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7'
      }
    });
    
    const $ = cheerio.load(data);
    const posts = [];
    
    $('.gall_list tbody tr').each((i, el) => {
      if (i >= 15) return false;
      
      const title = $(el).find('.gall_tit a').text().trim();
      const href = $(el).find('.gall_tit a').attr('href');
      const link = href ? 'https://gall.dcinside.com' + href : '';
      const views = $(el).find('.gall_count').text().trim();
      const comments = $(el).find('.gall_reply_num').text().trim();
      
      if (title && link && !$(el).hasClass('notice')) {
        posts.push({
          site: 'dcinside',
          siteName: '디시인사이드',
          siteColor: '#4a90e2',
          title: title,
          link: link,
          views: parseInt(views) || 0,
          comments: parseInt(comments) || 0,
          timeAgo: '방금 전'
        });
      }
    });
    
    return posts;
  } catch (error) {
    console.error('디시인사이드 크롤링 실패:', error.message);
    return [];
  }
}

// 웃긴대학 크롤링 (시도)
async function crawlFunnyUniv() {
  try {
    const { data } = await axios.get('https://www.hahaha.kr/best', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    
    const $ = cheerio.load(data);
    const posts = [];
    
    $('.board_list li').each((i, el) => {
      if (i >= 15) return false;
      
      const title = $(el).find('.title a').text().trim();
      const href = $(el).find('.title a').attr('href');
      const link = href ? 'https://www.hahaha.kr' + href : '';
      
      if (title && link) {
        posts.push({
          site: 'funnyuniv',
          siteName: '웃긴대학',
          siteColor: '#f5a623',
          title: title,
          link: link,
          views: 0,
          comments: 0,
          timeAgo: '방금 전'
        });
      }
    });
    
    return posts;
  } catch (error) {
    console.error('웃긴대학 크롤링 실패:', error.message);
    return [];
  }
}

// MLB파크 크롤링 (시도)
async function crawlMlbpark() {
  try {
    const { data } = await axios.get('http://mlbpark.donga.com/mp/b.php?m=search&b=bullpen&query=&select=stt&user=&sia=&emd=&sdt=&edt=&ct=1', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    
    const $ = cheerio.load(data);
    const posts = [];
    
    $('table.tbl_type01 tr').each((i, el) => {
      if (i >= 15) return false;
      
      const title = $(el).find('td.tit a').text().trim();
      const href = $(el).find('td.tit a').attr('href');
      const link = href ? 'http://mlbpark.donga.com' + href : '';
      
      if (title && link) {
        posts.push({
          site: 'mlbpark',
          siteName: 'MLB파크',
          siteColor: '#c0392b',
          title: title,
          link: link,
          views: 0,
          comments: 0,
          timeAgo: '방금 전'
        });
      }
    });
    
    return posts;
  } catch (error) {
    console.error('MLB파크 크롤링 실패:', error.message);
    return [];
  }
}

// 에펨코리아 크롤링 (시도)
async function crawlFmkorea() {
  try {
    const { data } = await axios.get('https://www.fmkorea.com/best', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    
    const $ = cheerio.load(data);
    const posts = [];
    
    $('.list-table tbody tr').each((i, el) => {
      if (i >= 15) return false;
      
      const title = $(el).find('.hx a').text().trim();
      const href = $(el).find('.hx a').attr('href');
      const link = href ? 'https://www.fmkorea.com' + href : '';
      
      if (title && link) {
        posts.push({
          site: 'fmkorea',
          siteName: '에펨코리아',
          siteColor: '#27ae60',
          title: title,
          link: link,
          views: 0,
          comments: 0,
          timeAgo: '방금 전'
        });
      }
    });
    
    return posts;
  } catch (error) {
    console.error('에펨코리아 크롤링 실패:', error.message);
    return [];
  }
}

// 메인 핸들러
export default async function handler(req, res) {
  // CORS 설정
  setCORS(res);
  
  // OPTIONS 요청 처리
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    console.log('크롤링 시작... (5개 사이트만)');
    
    // 작동하는 5개 사이트만 병렬 크롤링
    const [clien, ruliweb, ppomppu, dogdrip, todayhumor] = await Promise.all([
      crawlClien(),
      crawlRuliweb(),
      crawlPpomppu(),
      crawlDogdrip(),
      crawlTodayhumor()
    ]);
    
    // 모든 게시글 합치기
    const allPosts = [...clien, ...ruliweb, ...ppomppu, ...dogdrip, ...todayhumor];
    
    console.log(`크롤링 완료: 총 ${allPosts.length}개 게시글`);
    console.log(`- 클리앙: ${clien.length}개`);
    console.log(`- 루리웹: ${ruliweb.length}개`);
    console.log(`- 뽐뿌: ${ppomppu.length}개`);
    console.log(`- 개드립: ${dogdrip.length}개`);
    console.log(`- 오늘의유머: ${todayhumor.length}개`);
    
    // 결과 반환
    res.status(200).json({
      success: true,
      count: allPosts.length,
      posts: allPosts,
      sites: {
        clien: clien.length,
        ruliweb: ruliweb.length,
        ppomppu: ppomppu.length,
        dogdrip: dogdrip.length,
        todayhumor: todayhumor.length
      },
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('크롤링 오류:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
}
