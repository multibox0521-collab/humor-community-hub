// ==================== 전역 변수 ====================
let realtimePosts = [];
let humorPosts = [];
let entertainmentPosts = [];

// ==================== 초기화 ====================
document.addEventListener('DOMContentLoaded', () => {
    // 데이터 로드
    loadRealtimePosts();
    loadHumorPosts();
    loadEntertainmentPosts();
    
    // 5분마다 실시간 게시글 자동 새로고침
    setInterval(loadRealtimePosts, 5 * 60 * 1000);
});

// ==================== 실시간 크롤링 ====================
async function loadRealtimePosts() {
    const container = document.getElementById('realtimeList');
    const updateSpan = document.getElementById('realtimeUpdate');
    const countBadge = document.getElementById('realtimeCount');
    
    try {
        const response = await fetch('/api/crawl');
        const data = await response.json();
        
        if (data.success) {
            realtimePosts = data.posts.slice(0, 10); // TOP 10만
            renderPosts(realtimePosts, 'realtimeList');
            
            // 업데이트 시간 표시
            const now = new Date();
            const timeStr = now.getHours() + ':' + now.getMinutes().toString().padStart(2, '0');
            updateSpan.textContent = `마지막 업데이트: ${timeStr}`;
            document.getElementById('lastUpdate').textContent = `${timeStr} 업데이트됨`;
            
            // 개수 표시
            countBadge.textContent = realtimePosts.length;
        } else {
            throw new Error('크롤링 실패');
        }
    } catch (error) {
        console.error('실시간 게시글 로드 실패:', error);
        container.innerHTML = `
            <div class="loading">
                <i class="fas fa-exclamation-triangle"></i>
                <p>게시글을 불러올 수 없습니다. 잠시 후 다시 시도됩니다.</p>
            </div>
        `;
        
        // 에러 시 업데이트 정보
        updateSpan.textContent = '로딩 실패';
        document.getElementById('lastUpdate').textContent = '업데이트 실패';
    }
}

// ==================== 유머 베스트 ====================
function loadHumorPosts() {
    humorPosts = generateSamplePosts('humor', 10);
    renderPosts(humorPosts, 'humorList');
}

// ==================== 연예 속보 ====================
function loadEntertainmentPosts() {
    entertainmentPosts = generateSamplePosts('entertainment', 10);
    renderPosts(entertainmentPosts, 'entertainmentList');
}

// ==================== 게시글 렌더링 ====================
function renderPosts(posts, containerId) {
    const container = document.getElementById(containerId);
    
    if (posts.length === 0) {
        container.innerHTML = `
            <div class="loading">
                <i class="fas fa-inbox"></i>
                <p>게시글이 없습니다</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = posts.map((post, index) => `
        <div class="post-item" onclick="openPost('${post.link}')">
            <div class="post-number">${index + 1}</div>
            <div class="post-site" style="background: ${post.siteColor}20; color: ${post.siteColor};">
                ${post.siteName}
            </div>
            <div class="post-content">
                <div class="post-title">${escapeHtml(post.title)}</div>
                <div class="post-meta">
                    ${post.views ? `<span><i class="fas fa-eye"></i> ${formatNumber(post.views)}</span>` : ''}
                    ${post.comments ? `<span><i class="fas fa-comment"></i> ${formatNumber(post.comments)}</span>` : ''}
                    <span><i class="fas fa-clock"></i> ${formatTimeAgo(post.timeAgo || post.pubDate)}</span>
                </div>
            </div>
        </div>
    `).join('');
}

// ==================== 게시글 열기 ====================
function openPost(link) {
    if (link && link !== '#') {
        window.open(link, '_blank');
    }
}

// ==================== 샘플 데이터 생성 ====================
function generateSamplePosts(type, count) {
    const sites = type === 'humor' 
        ? [
            // 크롤링 시도하는 모든 사이트들
            { name: '클리앙', color: '#34495e', url: 'https://www.clien.net' },
            { name: '루리웹', color: '#3498db', url: 'https://bbs.ruliweb.com' },
            { name: '뽐뿌', color: '#9b59b6', url: 'https://www.ppomppu.co.kr' },
            { name: '개드립', color: '#ff5722', url: 'https://www.dogdrip.net' },
            { name: '오늘의유머', color: '#e67e22', url: 'http://www.todayhumor.co.kr' },
            { name: '디시인사이드', color: '#4a90e2', url: 'https://www.dcinside.com' },
            { name: '웃긴대학', color: '#f5a623', url: 'https://www.hahaha.kr' },
            { name: 'MLB파크', color: '#c0392b', url: 'http://mlbpark.donga.com' },
            { name: '에펨코리아', color: '#27ae60', url: 'https://www.fmkorea.com' }
        ]
        : [
            { name: 'Naver', color: '#03C75A', url: 'https://entertain.naver.com' },
            { name: '스조', color: '#e74c3c', url: 'https://sportschosun.com' },
            { name: 'OSEN', color: '#3498db', url: 'https://osen.mt.co.kr' },
            { name: '엑스포츠', color: '#9b59b6', url: 'https://www.xportsnews.com' },
            { name: '텐아시아', color: '#e67e22', url: 'https://tenasia.hankyung.com' },
            { name: '디스패치', color: '#c0392b', url: 'https://www.dispatch.co.kr' },
            { name: 'MK', color: '#27ae60', url: 'https://www.mk.co.kr' },
            { name: '스타뉴스', color: '#f39c12', url: 'https://star.mt.co.kr' }
        ];
    
    const humorTitles = [
        '이번에 나온 신작 게임 진짜 재밌네요 ㅋㅋㅋ',
        '오늘 회사에서 있었던 일.jpg 실화냐',
        '와 이거 실화냐? ㄷㄷㄷ 대박',
        '혼자 사는 사람들 공감할 만한 짤 모음',
        '요즘 유행하는 밈 정리해봤습니다',
        '이거 보고 빵터졌습니다 ㅋㅋㅋㅋㅋㅋ',
        '길에서 본 신기한 장면 공유',
        '편의점 알바 썰 푼다 (존잼)',
        '우리 동네 맛집 추천 받아요',
        '이런 상황 어떻게 대처하나요?'
    ];
    
    const entertainmentTitles = [
        '[단독] ○○○, 열애설 공식 입장 발표 "사실무근"',
        '△△△, 신곡 발매와 함께 컴백 예고... 팬들 환호',
        '□□□ 결혼 발표... 상대는 동료 연예인',
        '[속보] ○○○, SNS 통해 근황 공개 "잘 지내고 있다"',
        '△△△ 드라마, 시청률 1위 기록... 화제성 급상승',
        '□□□, 논란 해명... "오해 풀리길 바란다"',
        '[포토] ○○○, 공항패션 화제... 세련된 스타일',
        '△△△ 콘서트 티켓 오픈 10분 만에 매진',
        '□□□, 새 영화 캐스팅 확정... 주연 맡아',
        '[★이슈] ○○○, 과거 발언 재조명... 팬들 관심'
    ];
    
    const titles = type === 'humor' ? humorTitles : entertainmentTitles;
    
    return Array.from({ length: count }, (_, i) => {
        const site = sites[i % sites.length];
        const title = titles[i % titles.length];
        
        return {
            siteName: site.name,
            siteColor: site.color,
            title: title,
            link: site.url,
            views: Math.floor(Math.random() * 50000) + 1000,
            comments: Math.floor(Math.random() * 500) + 10,
            timeAgo: Math.floor(Math.random() * 360) // 0~360분 전
        };
    });
}

// ==================== 유틸리티 함수 ====================
function formatNumber(num) {
    if (num >= 10000) {
        return (num / 10000).toFixed(1) + '만';
    }
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
}

function formatTimeAgo(input) {
    if (!input) return '방금 전';
    
    let minutes;
    
    if (typeof input === 'string') {
        const date = new Date(input);
        const now = new Date();
        const diff = Math.floor((now - date) / 1000);
        minutes = Math.floor(diff / 60);
    } else if (typeof input === 'number') {
        minutes = input;
    } else {
        return '방금 전';
    }
    
    if (minutes < 1) return '방금 전';
    if (minutes < 60) return minutes + '분 전';
    if (minutes < 1440) return Math.floor(minutes / 60) + '시간 전';
    return Math.floor(minutes / 1440) + '일 전';
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
