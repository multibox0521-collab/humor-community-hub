// 유머 커뮤니티 사이트 데이터
const humorSites = [
    {
        id: 1,
        name: '디시인사이드',
        description: '다양한 갤러리와 유머 게시판이 있는 대표적인 커뮤니티',
        url: 'https://www.dcinside.com',
        bestUrl: 'https://gall.dcinside.com/board/lists/?id=dcbest',
        icon: '🎮',
        tags: ['종합', '갤러리', '유머'],
        color: '#4a90e2'
    },
    {
        id: 2,
        name: '웃긴대학',
        description: '매일 업데이트되는 신선한 유머와 웃긴 짤 모음',
        url: 'https://www.hahaha.kr',
        bestUrl: 'https://www.hahaha.kr/best',
        icon: '😂',
        tags: ['유머', '짤방', '웃긴글'],
        color: '#f5a623'
    },
    {
        id: 3,
        name: '보배드림',
        description: '자동차와 유머가 있는 남성 커뮤니티',
        url: 'https://www.bobaedream.co.kr',
        bestUrl: 'https://www.bobaedream.co.kr/cyber/CyberCommunity.php?gubun=best',
        icon: '🚗',
        tags: ['자동차', '유머', '남성'],
        color: '#e74c3c'
    },
    {
        id: 4,
        name: '뽐뿌',
        description: '알뜰 정보와 재미있는 게시판',
        url: 'https://www.ppomppu.co.kr',
        bestUrl: 'https://www.ppomppu.co.kr/zboard/zboard.php?id=freeboard',
        icon: '💰',
        tags: ['할인', '유머', '정보'],
        color: '#9b59b6'
    },
    {
        id: 5,
        name: '루리웹',
        description: '게임과 유머가 공존하는 커뮤니티',
        url: 'https://bbs.ruliweb.com',
        bestUrl: 'https://bbs.ruliweb.com/community/board/300143',
        icon: '🎯',
        tags: ['게임', '유머', '짤'],
        color: '#3498db'
    },
    {
        id: 6,
        name: 'SLR클럽',
        description: '사진과 유머 게시판',
        url: 'https://www.slrclub.com',
        bestUrl: 'https://www.slrclub.com/bbs/zboard.php?id=free',
        icon: '📷',
        tags: ['사진', '유머', '커뮤니티'],
        color: '#1abc9c'
    },
    {
        id: 7,
        name: '오늘의유머',
        description: '매일 새로운 베스트 유머 모음',
        url: 'http://www.todayhumor.co.kr',
        bestUrl: 'http://www.todayhumor.co.kr/board/list.php?table=bestofbest',
        icon: '😄',
        tags: ['유머', '베스트', '일상'],
        color: '#e67e22'
    },
    {
        id: 8,
        name: '클리앙',
        description: 'IT와 유머가 있는 품격있는 커뮤니티',
        url: 'https://www.clien.net',
        bestUrl: 'https://www.clien.net/service/board/park',
        icon: '💻',
        tags: ['IT', '유머', '정보'],
        color: '#34495e'
    },
    {
        id: 9,
        name: '에펨코리아',
        description: '축구와 유머 커뮤니티',
        url: 'https://www.fmkorea.com',
        bestUrl: 'https://www.fmkorea.com/best',
        icon: '⚽',
        tags: ['축구', '유머', '스포츠'],
        color: '#27ae60'
    },
    {
        id: 10,
        name: 'MLB파크',
        description: '야구와 일상 유머',
        url: 'http://mlbpark.donga.com',
        bestUrl: 'http://mlbpark.donga.com/mp/b.php?m=best',
        icon: '⚾',
        tags: ['야구', '유머', '스포츠'],
        color: '#c0392b'
    },
    {
        id: 11,
        name: '82Cook',
        description: '주부들의 생활 정보와 유머',
        url: 'https://www.82cook.com',
        bestUrl: 'https://www.82cook.com/entiz/best.php',
        icon: '🍳',
        tags: ['생활', '여성', '유머'],
        color: '#e91e63'
    },
    {
        id: 12,
        name: '더쿠',
        description: '연예와 드라마 이야기',
        url: 'https://theqoo.net',
        bestUrl: 'https://theqoo.net/hot',
        icon: '⭐',
        tags: ['연예', '드라마', '여초'],
        color: '#ff6b9d'
    },
    {
        id: 13,
        name: '일베저장소',
        description: '일간베스트 게시글 저장소',
        url: 'https://www.ilbe.com',
        bestUrl: 'https://www.ilbe.com/ilbe',
        icon: '📝',
        tags: ['유머', '베스트', '커뮤니티'],
        color: '#795548'
    },
    {
        id: 14,
        name: '개드립',
        description: '개그, 드립, 필수요소 모음',
        url: 'https://www.dogdrip.net',
        bestUrl: 'https://www.dogdrip.net/dogdrip',
        icon: '🎭',
        tags: ['드립', '개그', '짤'],
        color: '#ff5722'
    },
    {
        id: 15,
        name: '웃긴자료',
        description: '다양한 웃긴 자료 모음',
        url: 'https://www.ygosu.com',
        bestUrl: 'https://www.ygosu.com/community/real_humor',
        icon: '🎪',
        tags: ['유머', '짤방', '자료'],
        color: '#00bcd4'
    },
    {
        id: 16,
        name: '아카라이브',
        description: '다양한 채널과 유머 콘텐츠',
        url: 'https://arca.live',
        bestUrl: 'https://arca.live/b/breaking',
        icon: '🎨',
        tags: ['종합', '채널', '유머'],
        color: '#673ab7'
    }
];

// 로컬 스토리지 키
const STORAGE_KEYS = {
    favorites: 'humor_sites_favorites',
    visited: 'humor_sites_visited'
};