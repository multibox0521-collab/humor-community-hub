// CORS 헤더 설정
function setCORS(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

// 샘플 데이터 생성
function generateSampleData() {
  const sites = [
    { name: '클리앙', color: '#34495e', url: 'https://www.clien.net/service/board/park' },
    { name: '루리웹', color: '#3498db', url: 'https://bbs.ruliweb.com/community/board/300143' },
    { name: '뽐뿌', color: '#9b59b6', url: 'https://www.ppomppu.co.kr/zboard/zboard.php?id=freeboard' },
    { name: '개드립', color: '#ff5722', url: 'https://www.dogdrip.net/dogdrip' },
    { name: '오늘의유머', color: '#e67e22', url: 'http://www.todayhumor.co.kr/board/list.php?table=bestofbest' },
    { name: '디시인사이드', color: '#4a90e2', url: 'https://gall.dcinside.com/board/lists/?id=dcbest' },
    { name: '웃긴대학', color: '#f5a623', url: 'https://www.hahaha.kr/best' },
    { name: 'MLB파크', color: '#c0392b', url: 'http://mlbpark.donga.com/mp/b.php?b=bullpen' },
    { name: '에펨코리아', color: '#27ae60', url: 'https://www.fmkorea.com/best' },
    { name: '보배드림', color: '#ff6b6b', url: 'https://www.bobaedream.co.kr/cyber/CyberCommunity.php?gubun=K' },
    { name: '82쿡', color: '#ff9ff3', url: 'https://www.82cook.com/entiz/read.php?bn=15' },
    { name: 'SLR클럽', color: '#54a0ff', url: 'https://www.slrclub.com/bbs/zboard.php?id=free' },
    { name: '인벤', color: '#ee5a6f', url: 'https://www.inven.co.kr/board/webzine/3371' },
    { name: '엠팍', color: '#c44569', url: 'https://mlbpark.donga.com/mp/b.php?b=bullpen&m=list' },
    { name: '더쿠', color: '#f368e0', url: 'https://theqoo.net/hot' }
  ];
  
  const titles = [
    '이번 주말 날씨 완전 좋네요',
    '오늘 회사에서 있었던 일.jpg',
    '와 이거 실화냐? 대박이네',
    '혼자 사는 사람들 공감할 만한 짤',
    '요즘 유행하는 밈 정리해봤습니다',
    '이거 보고 빵터졌습니다 ㅋㅋㅋ',
    '길에서 본 신기한 장면 공유',
    '편의점 알바 썰 푼다 (존잼)',
    '우리 동네 맛집 추천 받아요',
    '이런 상황 어떻게 대처하나요?',
    '축구 경기 보다가 놀란 점',
    '이번 시즌 드라마 추천',
    '야구장에서 있었던 일',
    '맛집 탐방 후기 올립니다',
    '게임 신작 리뷰 (스포 없음)'
  ];
  
  const posts = [];
  
  // 각 사이트당 15개씩 생성
  sites.forEach(site => {
    for (let i = 0; i < 15; i++) {
      const randomTitle = titles[Math.floor(Math.random() * titles.length)];
      const postId = Math.floor(Math.random() * 10000000);
      
      // 사이트별 게시글 URL 형식
      let postLink = site.url;
      if (site.name === '클리앙') {
        postLink = `https://www.clien.net/service/board/park/${postId}`;
      } else if (site.name === '루리웹') {
        postLink = `https://bbs.ruliweb.com/community/board/300143/${postId}`;
      } else if (site.name === '뽐뿌') {
        postLink = `https://www.ppomppu.co.kr/zboard/view.php?id=freeboard&no=${postId}`;
      } else if (site.name === '개드립') {
        postLink = `https://www.dogdrip.net/${postId}`;
      } else if (site.name === '오늘의유머') {
        postLink = `http://www.todayhumor.co.kr/board/view.php?table=bestofbest&no=${postId}`;
      } else if (site.name === '디시인사이드') {
        postLink = `https://gall.dcinside.com/board/view/?id=dcbest&no=${postId}`;
      } else if (site.name === '웃긴대학') {
        postLink = `https://www.hahaha.kr/bbs/${postId}`;
      } else if (site.name === 'MLB파크') {
        postLink = `http://mlbpark.donga.com/mp/b.php?m=view&b=bullpen&id=${postId}`;
      } else if (site.name === '에펨코리아') {
        postLink = `https://www.fmkorea.com/${postId}`;
      } else if (site.name === '보배드림') {
        postLink = `https://www.bobaedream.co.kr/view?code=cyber&No=${postId}`;
      } else if (site.name === '82쿡') {
        postLink = `https://www.82cook.com/entiz/read.php?num=${postId}&bn=15`;
      } else if (site.name === 'SLR클럽') {
        postLink = `https://www.slrclub.com/bbs/vx2.php?id=free&no=${postId}`;
      } else if (site.name === '인벤') {
        postLink = `https://www.inven.co.kr/board/webzine/3371/${postId}`;
      } else if (site.name === '엠팍') {
        postLink = `https://mlbpark.donga.com/mp/b.php?m=view&b=bullpen&id=${postId}`;
      } else if (site.name === '더쿠') {
        postLink = `https://theqoo.net/square/${postId}`;
      }
      
      posts.push({
        site: site.name.toLowerCase(),
        siteName: site.name,
        siteColor: site.color,
        title: `${randomTitle} ${i + 1}`,
        link: postLink, // 게시글 개별 URL
        views: Math.floor(Math.random() * 50000) + 1000,
        comments: Math.floor(Math.random() * 500) + 10,
        timeAgo: '방금 전'
      });
    }
  });
  
  return posts;
}

// 메인 핸들러
export default async function handler(req, res) {
  setCORS(res);
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    console.log('샘플 데이터 생성 중...');
    
    const posts = generateSampleData();
    
    res.status(200).json({
      success: true,
      count: posts.length,
      posts: posts,
      sites: {
        clien: 15,
        ruliweb: 15,
        ppomppu: 15,
        dogdrip: 15,
        todayhumor: 15,
        dcinside: 15,
        funnyuniv: 15,
        mlbpark: 15,
        fmkorea: 15,
        bobae: 15,
        cook82: 15,
        slrclub: 15,
        inven: 15,
        mlbpark2: 15,
        theqoo: 15
      },
      timestamp: new Date().toISOString(),
      note: '샘플 데이터입니다 (15개 사이트). 실제 크롤링은 /api/crawl을 사용하세요.'
    });
    
  } catch (error) {
    console.error('샘플 데이터 생성 오류:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
}
