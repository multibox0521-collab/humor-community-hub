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
      const href = $(el).find('.list_subject a').attr('href');
      const link = href ? 'https://www.clien.net' + href : '';
      const views = $(el).find('.list_hit').text().trim();
      const comments = $(el).find('.list_reply').text().trim();
      
      if (title && link && link !== 'https://www.clien.net') {
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

// 보배드림 크롤링
async function crawlBobae() {
  try {
    const { data } = await axios.get('https://www.bobaedream.co.kr/cyber/CyberCommunity.php?gubun=K', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      timeout: 15000
    });
    
    const $ = cheerio.load(data);
    const posts = [];
    
    $('tr.pl10').each((i, el) => {
      if (i >= 15) return false;
      
      const title = $(el).find('.pl14 a').text().trim();
      const href = $(el).find('.pl14 a').attr('href');
      const link = href ? 'https://www.bobaedream.co.kr' + href : '';
      
      if (title && link && !link.includes('undefined')) {
        posts.push({
          site: 'bobae',
          siteName: '보배드림',
          siteColor: '#ff6b6b',
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
    console.error('보배드림 크롤링 실패:', error.message);
    return [];
  }
}

// 82쿡 크롤링
async function crawl82cook() {
  try {
    const { data } = await axios.get('https://www.82cook.com/entiz/read.php?bn=15&num=&m=B', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      timeout: 15000
    });
    
    const $ = cheerio.load(data);
    const posts = [];
    
    $('table.bd_list tr').each((i, el) => {
      if (i >= 15) return false;
      
      const title = $(el).find('.title a').text().trim();
      const href = $(el).find('.title a').attr('href');
      const link = href ? 'https://www.82cook.com/entiz/' + href : '';
      
      if (title && link && !link.includes('undefined')) {
        posts.push({
          site: '82cook',
          siteName: '82쿡',
          siteColor: '#ff9ff3',
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
    console.error('82쿡 크롤링 실패:', error.message);
    return [];
  }
}

// SLR클럽 크롤링
async function crawlSlrclub() {
  try {
    const { data } = await axios.get('https://www.slrclub.com/bbs/zboard.php?id=free', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      timeout: 15000
    });
    
    const $ = cheerio.load(data);
    const posts = [];
    
    $('table.list_table tbody tr').each((i, el) => {
      if (i >= 15) return false;
      
      const title = $(el).find('.sbj a').text().trim();
      const href = $(el).find('.sbj a').attr('href');
      const link = href ? 'https://www.slrclub.com/bbs/' + href : '';
      
      if (title && link && !link.includes('undefined')) {
        posts.push({
          site: 'slrclub',
          siteName: 'SLR클럽',
          siteColor: '#54a0ff',
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
    console.error('SLR클럽 크롤링 실패:', error.message);
    return [];
  }
}

// 인벤 크롤링
async function crawlInven() {
  try {
    const { data } = await axios.get('https://www.inven.co.kr/board/webzine/3371', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      timeout: 15000
    });
    
    const $ = cheerio.load(data);
    const posts = [];
    
    $('.board-list tbody tr').each((i, el) => {
      if (i >= 15) return false;
      
      const title = $(el).find('.subject a').text().trim();
      const href = $(el).find('.subject a').attr('href');
      const link = href ? 'https://www.inven.co.kr' + href : '';
      
      if (title && link && !link.includes('undefined')) {
        posts.push({
          site: 'inven',
          siteName: '인벤',
          siteColor: '#ee5a6f',
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
    console.error('인벤 크롤링 실패:', error.message);
    return [];
  }
}

// 엠팍 크롤링
async function crawlMlbpark2() {
  try {
    const { data } = await axios.get('https://mlbpark.donga.com/mp/b.php?b=bullpen&m=list', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      timeout: 15000
    });
    
    const $ = cheerio.load(data);
    const posts = [];
    
    $('.tbl-list tbody tr').each((i, el) => {
      if (i >= 15) return false;
      
      const title = $(el).find('.tit a').text().trim();
      const href = $(el).find('.tit a').attr('href');
      const link = href ? 'https://mlbpark.donga.com' + href : '';
      
      if (title && link && !link.includes('undefined')) {
        posts.push({
          site: 'mlbpark2',
          siteName: '엠팍',
          siteColor: '#c44569',
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
    console.error('엠팍 크롤링 실패:', error.message);
    return [];
  }
}

// 더쿠 크롤링
async function crawlTheqoo() {
  try {
    const { data } = await axios.get('https://theqoo.net/hot', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      timeout: 15000
    });
    
    const $ = cheerio.load(data);
    const posts = [];
    
    $('.list-post .post-item').each((i, el) => {
      if (i >= 15) return false;
      
      const title = $(el).find('.title a').text().trim();
      const href = $(el).find('.title a').attr('href');
      const link = href ? 'https://theqoo.net' + href : '';
      
      if (title && link && !link.includes('undefined')) {
        posts.push({
          site: 'theqoo',
          siteName: '더쿠',
          siteColor: '#f368e0',
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
    console.error('더쿠 크롤링 실패:', error.message);
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
    console.log('🚀 크롤링 시작... (작동하는 9개 사이트만!)');
    
    // 작동하는 9개 사이트만 병렬 크롤링
    const [
      clien, ppomppu, dogdrip, todayhumor,
      fmkorea, bobae, slrclub, inven, mlbpark
    ] = await Promise.all([
      crawlClien(),
      crawlPpomppu(),
      crawlDogdrip(),
      crawlTodayhumor(),
      crawlFmkorea(),
      crawlBobae(),
      crawlSlrclub(),
      crawlInven(),
      crawlMlbpark()
    ]);
    
    // 모든 게시글 합치기
    const allPosts = [
      ...clien, ...ppomppu, ...dogdrip, ...todayhumor,
      ...fmkorea, ...bobae, ...slrclub, ...inven, ...mlbpark
    ];
    
    console.log(`✅ 크롤링 완료: 총 ${allPosts.length}개 게시글`);
    console.log(`📊 사이트별 현황:`);
    console.log(`  1. 클리앙: ${clien.length}개`);
    console.log(`  2. 뽐뿌: ${ppomppu.length}개`);
    console.log(`  3. 개드립: ${dogdrip.length}개`);
    console.log(`  4. 오늘의유머: ${todayhumor.length}개`);
    console.log(`  5. 에펨코리아: ${fmkorea.length}개`);
    console.log(`  6. 보배드림: ${bobae.length}개`);
    console.log(`  7. SLR클럽: ${slrclub.length}개`);
    console.log(`  8. 인벤: ${inven.length}개`);
    console.log(`  9. MLB파크: ${mlbpark.length}개`);
    
    // 결과 반환
    res.status(200).json({
      success: true,
      count: allPosts.length,
      posts: allPosts,
      sites: {
        clien: clien.length,
        ppomppu: ppomppu.length,
        dogdrip: dogdrip.length,
        todayhumor: todayhumor.length,
        fmkorea: fmkorea.length,
        bobae: bobae.length,
        slrclub: slrclub.length,
        inven: inven.length,
        mlbpark: mlbpark.length
      },
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ 크롤링 오류:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
}
