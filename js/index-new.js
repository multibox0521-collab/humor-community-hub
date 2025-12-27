// ==================== 전역 변수 ====================
let communityPosts = [];
let entertainmentPosts = [];

// ==================== 초기화 ====================
document.addEventListener('DOMContentLoaded', () => {
    // 데이터 로드
    loadCommunityPosts();
    loadEntertainmentPosts();
    
    // 네비게이션 메뉴 클릭 이벤트
    setupNavigation();
    
    // 5분마다 자동 새로고침
    setInterval(() => {
        loadCommunityPosts();
        loadEntertainmentPosts();
    }, 5 * 60 * 1000);
});

// ==================== 커뮤니티베스트 ====================
async function loadCommunityPosts() {
    const container = document.getElementById('communityList');
    const updateSpan = document.getElementById('communityUpdate');
    const countBadge = document.getElementById('communityCount');
    
    console.log('🚀 커뮤니티베스트 크롤링 시작...');
    
    try {
        // 임시로 샘플 데이터 사용 (크롤링 Timeout 해결 전까지)
        const response = await fetch('/api/sample-data');
        console.log('📡 API 응답 상태:', response.status, response.statusText);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('📦 받은 데이터:', data);
        
        if (data.success && data.posts && data.posts.length > 0) {
            // 조회수 높은 순으로 정렬 (미리보기 5개만)
            communityPosts = data.posts
                .sort((a, b) => (b.views || 0) - (a.views || 0))
                .slice(0, 5);
            renderPosts(communityPosts, 'communityList');
            
            // 업데이트 시간 표시
            const now = new Date();
            const timeStr = now.getHours() + ':' + now.getMinutes().toString().padStart(2, '0');
            updateSpan.textContent = `마지막 업데이트: ${timeStr}`;
            document.getElementById('lastUpdate').textContent = `${timeStr} 업데이트됨`;
            
            // 개수 표시
            countBadge.textContent = communityPosts.length;
            
            // 각 사이트별 크롤링 결과 로그
            console.log('✅ 커뮤니티베스트 크롤링 성공!');
            console.log('📊 사이트별 결과:', data.sites);
            console.log(`📝 총 ${data.count}개 게시글 중 TOP ${communityPosts.length}개 표시`);
        } else {
            throw new Error('크롤링된 게시글이 없습니다');
        }
    } catch (error) {
        console.error('❌ 커뮤니티베스트 로드 실패:', error);
        container.innerHTML = `
            <div class="loading">
                <i class="fas fa-exclamation-triangle"></i>
                <p>게시글을 불러올 수 없습니다.</p>
                <small style="color: #999; margin-top: 10px; display: block;">
                    잠시 후 다시 시도됩니다
                </small>
            </div>
        `;
        
        // 에러 시 업데이트 정보
        updateSpan.textContent = '로딩 실패';
        document.getElementById('lastUpdate').textContent = '업데이트 실패';
    }
}

// ==================== 연예뉴스베스트 ====================
async function loadEntertainmentPosts() {
    const container = document.getElementById('entertainmentList');
    const updateSpan = document.getElementById('entertainmentUpdate');
    const countBadge = document.getElementById('entertainmentCount');
    
    console.log('🚀 연예뉴스베스트 크롤링 시작...');
    
    try {
        // 임시로 샘플 데이터 사용 (크롤링 Timeout 해결 전까지)
        const response = await fetch('/api/sample-data');
        const data = await response.json();
        
        if (data.success && data.posts.length > 0) {
            // 댓글 많은 순으로 정렬 (미리보기 5개만)
            entertainmentPosts = data.posts
                .sort((a, b) => (b.comments || 0) - (a.comments || 0))
                .slice(0, 5);
            renderPosts(entertainmentPosts, 'entertainmentList');
            
            // 업데이트 시간 표시
            const now = new Date();
            const timeStr = now.getHours() + ':' + now.getMinutes().toString().padStart(2, '0');
            updateSpan.textContent = `마지막 업데이트: ${timeStr}`;
            
            // 개수 표시
            countBadge.textContent = entertainmentPosts.length;
            
            console.log('✅ 연예뉴스베스트 크롤링 성공!');
        } else {
            throw new Error('크롤링 실패');
        }
    } catch (error) {
        console.error('❌ 연예뉴스베스트 로드 실패:', error);
        container.innerHTML = `
            <div class="loading">
                <i class="fas fa-exclamation-triangle"></i>
                <p>게시글을 불러올 수 없습니다.</p>
                <small style="color: #999; margin-top: 10px; display: block;">
                    잠시 후 다시 시도됩니다
                </small>
            </div>
        `;
        
        updateSpan.textContent = '로딩 실패';
    }
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
        <div class="post-item" style="cursor: pointer;" data-link="${escapeHtml(post.link)}">
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
    
    // 클릭 이벤트 추가
    container.querySelectorAll('.post-item').forEach(item => {
        item.addEventListener('click', () => {
            const link = item.getAttribute('data-link');
            if (link && link !== '#') {
                window.location.href = link;
            }
        });
    });
}

// ==================== 게시글 열기 ====================
function openPost(link) {
    if (link && link !== '#') {
        window.location.href = link; // 같은 창에서 열기
    }
}

// ==================== 네비게이션 ====================
function setupNavigation() {
    // 네비게이션은 이제 다른 페이지로 이동하므로 특별한 처리 불필요
    // 메뉴 링크는 일반 링크로 작동
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
        
        // 실제 게시글 URL 생성 (샘플 데이터이므로 게시판 메인 페이지로)
        let postLink = site.url;
        if (type === 'humor') {
            // 각 사이트별 게시판 URL로 연결
            if (site.name === '클리앙') postLink = 'https://www.clien.net/service/board/park';
            else if (site.name === '루리웹') postLink = 'https://bbs.ruliweb.com/community/board/300143';
            else if (site.name === '뽐뿌') postLink = 'https://www.ppomppu.co.kr/zboard/zboard.php?id=freeboard';
            else if (site.name === '개드립') postLink = 'https://www.dogdrip.net/dogdrip';
            else if (site.name === '오늘의유머') postLink = 'http://www.todayhumor.co.kr/board/list.php?table=bestofbest';
            else if (site.name === '디시인사이드') postLink = 'https://gall.dcinside.com/board/lists/?id=dcbest';
            else if (site.name === '웃긴대학') postLink = 'https://www.hahaha.kr/best';
            else if (site.name === 'MLB파크') postLink = 'http://mlbpark.donga.com/mp/b.php?m=search&b=bullpen';
            else if (site.name === '에펨코리아') postLink = 'https://www.fmkorea.com/best';
        } else {
            // 연예 사이트는 메인 페이지로
            postLink = site.url;
        }
        
        return {
            siteName: site.name,
            siteColor: site.color,
            title: title,
            link: postLink,
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
