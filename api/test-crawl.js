import axios from 'axios';

// CORS 헤더 설정
function setCORS(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

// 간단한 테스트 핸들러
export default async function handler(req, res) {
  setCORS(res);
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    console.log('테스트 크롤링 시작...');
    
    // 클리앙만 테스트
    const { data } = await axios.get('https://www.clien.net/service/board/park?&od=T31&po=0', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      timeout: 5000
    });
    
    res.status(200).json({
      success: true,
      message: '크롤링 성공!',
      dataLength: data.length
    });
    
  } catch (error) {
    console.error('테스트 크롤링 실패:', error.message);
    res.status(500).json({
      success: false,
      error: error.message,
      errorType: error.code || 'UNKNOWN'
    });
  }
}
