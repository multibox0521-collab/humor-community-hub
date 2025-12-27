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
    { name: '오늘의유머', color: '#e67e22', url: 'http://www.todayhumor.co.kr/board/list.php?table=bestofbest' }
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
      posts.push({
        site: site.name.toLowerCase(),
        siteName: site.name,
        siteColor: site.color,
        title: `${randomTitle} ${i + 1}`,
        link: site.url, // 실제 게시판 URL
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
        todayhumor: 15
      },
      timestamp: new Date().toISOString(),
      note: '샘플 데이터입니다. 실제 크롤링은 /api/crawl을 사용하세요.'
    });
    
  } catch (error) {
    console.error('샘플 데이터 생성 오류:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
}
