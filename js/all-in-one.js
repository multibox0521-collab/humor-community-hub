// ==================== 전역 변수 ====================
let allPosts = {
    realtime: [],
    humor: [],
    entertainment: []
};

let currentTab = 'realtime';
let currentSiteFilter = 'all';
let currentSearchTerm = '';
let currentSort = 'time';
let currentTimeFilter = 'all'; // 유머 기간 필터
let currentHumorKeyword = ''; // 유머 키워드 검색
let currentEntertainmentKeyword = ''; // 연예 키워드 검색

// 설정
let settings = {
    autoRefresh: false,
    favoriteSites: [],
    blockKeywords: [],
    hideReadPosts: true,
    showOnlyNew: false
};

// 읽은 글, 즐겨찾기
let readPosts = new Set();
let favoritePosts = new Set();
let lastPostIds = new Set();

// 자동 새로고침
let autoRefreshInterval = null;
let nextUpdateCountdown = null;
let secondsUntilUpdate = 300; // 5분

// ==================== 초기화 ====================
document.addEventListener('DOMContentLoaded', () => {
    loadSettings();
    loadReadPosts();
    loadFavoritePosts();
    
    initEventListeners();
    initSiteFilters();
    
    // 초기 데이터 로드
    loadHumorPosts();
    loadEntertainmentPosts();
    loadRealtimePosts();
    
    // 항상 자동 새로고침 시작
    startAutoRefresh();
});

// ==================== 이벤트 리스너 ====================
function initEventListeners() {
    // 탭 전환
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const tab = btn.dataset.tab;
            switchTab(tab);
        });
    });
    
    // 유머 기간 필터
    document.querySelectorAll('.time-chip').forEach(btn => {
        btn.addEventListener('click', () => {
            currentTimeFilter = btn.dataset.hours;
            document.querySelectorAll('.time-chip').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderHumorPosts();
        });
    });
    
    // 유머 키워드 검색
    const humorKeywordInput = document.getElementById('humorKeyword');
    humorKeywordInput.addEventListener('input', (e) => {
        currentHumorKeyword = e.target.value.toLowerCase();
        document.getElementById('clearHumorKeyword').style.display = currentHumorKeyword ? 'block' : 'none';
        renderHumorPosts();
    });
    
    document.getElementById('clearHumorKeyword').addEventListener('click', () => {
        humorKeywordInput.value = '';
        currentHumorKeyword = '';
        document.getElementById('clearHumorKeyword').style.display = 'none';
        renderHumorPosts();
    });
    
    // 연예 키워드 검색
    const entertainmentKeywordInput = document.getElementById('entertainmentKeyword');
    entertainmentKeywordInput.addEventListener('input', (e) => {
        currentEntertainmentKeyword = e.target.value.toLowerCase();
        document.getElementById('clearEntertainmentKeyword').style.display = currentEntertainmentKeyword ? 'block' : 'none';
        renderEntertainmentPosts();
    });
    
    document.getElementById('clearEntertainmentKeyword').addEventListener('click', () => {
        entertainmentKeywordInput.value = '';
        currentEntertainmentKeyword = '';
        document.getElementById('clearEntertainmentKeyword').style.display = 'none';
        renderEntertainmentPosts();
    });
    
    // 검색
    const searchInput = document.getElementById('globalSearch');
    searchInput.addEventListener('input', (e) => {
        currentSearchTerm = e.target.value.toLowerCase();
        document.getElementById('clearSearch').style.display = currentSearchTerm ? 'block' : 'none';
        renderCurrentTab();
    });
    
    document.getElementById('clearSearch').addEventListener('click', () => {
        searchInput.value = '';
        currentSearchTerm = '';
        document.getElementById('clearSearch').style.display = 'none';
        renderCurrentTab();
    });
    
    // 정렬
    document.getElementById('sortSelect').addEventListener('change', (e) => {
        currentSort = e.target.value;
        renderCurrentTab();
    });
    
    
    // 설정 모달
    document.getElementById('settingsBtn').addEventListener('click', () => {
        openModal('settingsModal');
        renderSettingsModal();
    });
    
    document.getElementById('saveSettings').addEventListener('click', () => {
        saveSettingsFromModal();
        closeModal('settingsModal');
    });
    
    // 필터 설정 모달
    document.getElementById('filterSettingsBtn').addEventListener('click', () => {
        openModal('filterModal');
    });
    
    document.getElementById('hideReadPosts').addEventListener('change', (e) => {
        settings.hideReadPosts = e.target.checked;
        saveSettings();
        renderCurrentTab();
    });
    
    document.getElementById('showOnlyNew').addEventListener('change', (e) => {
        settings.showOnlyNew = e.target.checked;
        saveSettings();
        renderCurrentTab();
    });
    
    // 모달 닫기
    document.querySelectorAll('.modal-close').forEach(btn => {
        btn.addEventListener('click', () => {
            closeModal(btn.closest('.modal').id);
        });
    });
    
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal(modal.id);
            }
        });
    });
    
    // 새 글 알림
    document.getElementById('showNewPosts').addEventListener('click', () => {
        document.getElementById('newPostsAlert').style.display = 'none';
        scrollTo(0, 0);
    });
    
    // 읽은 글 삭제
    document.getElementById('clearReadPosts').addEventListener('click', () => {
        if (confirm('읽은 글 기록을 모두 삭제하시겠습니까?')) {
            readPosts.clear();
            saveReadPosts();
            renderCurrentTab();
            alert('읽은 글 기록이 삭제되었습니다.');
        }
    });
    
    // 차단 키워드 추가
    document.getElementById('addBlockKeyword').addEventListener('click', addBlockKeyword);
    document.getElementById('blockKeywordInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addBlockKeyword();
        }
    });
}

// ==================== 탭 전환 ====================
function switchTab(tab) {
    currentTab = tab;
    
    // 탭 버튼 활성화
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === tab);
    });
    
    // 탭 컨텐츠 표시
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById(tab + 'Tab').classList.add('active');
    
    // 탭별 필터 표시/숨김
    const humorFilters = document.getElementById('humorFilters');
    const entertainmentFilters = document.getElementById('entertainmentFilters');
    
    humorFilters.style.display = tab === 'humor' ? 'block' : 'none';
    entertainmentFilters.style.display = tab === 'entertainment' ? 'block' : 'none';
    
    // 사이트 필터 업데이트
    currentSiteFilter = 'all';
    initSiteFilters();
    
    renderCurrentTab();
}

function renderCurrentTab() {
    if (currentTab === 'realtime') {
        renderRealtimePosts();
    } else if (currentTab === 'humor') {
        renderHumorPosts();
    } else if (currentTab === 'entertainment') {
        renderEntertainmentPosts();
    } else if (currentTab === 'favorites') {
        renderFavoritePosts();
    }
}

// ==================== 사이트 필터 ====================
function initSiteFilters() {
    const container = document.getElementById('siteFilters');
    let sites = [];
    
    if (currentTab === 'realtime') {
        sites = ['전체', '클리앙', '루리웹', '뽐뿌', '개드립', '오늘의유머', '디시인사이드', '웃긴대학', 'MLB파크', '에펨코리아'];
    } else if (currentTab === 'humor') {
        sites = ['전체', '클리앙', '루리웹', '뽐뿌', '개드립', '오늘의유머', '디시인사이드', '웃긴대학', 'MLB파크', '에펨코리아'];
    } else if (currentTab === 'entertainment') {
        sites = ['전체', 'Naver', '스조', 'OSEN', '엑스포츠', '텐아시아', '디스패치', 'MK', '스타뉴스'];
    }
    
    container.innerHTML = sites.map((site, i) => 
        `<button class="filter-chip ${i === 0 ? 'active' : ''}" data-site="${i === 0 ? 'all' : site}">${site}</button>`
    ).join('');
    
    // 이벤트 리스너
    container.querySelectorAll('.filter-chip').forEach(btn => {
        btn.addEventListener('click', () => {
            currentSiteFilter = btn.dataset.site;
            container.querySelectorAll('.filter-chip').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderCurrentTab();
        });
    });
}

// ==================== 실시간 크롤링 ====================
async function loadRealtimePosts() {
    const loading = document.getElementById('realtimeLoading');
    loading.style.display = 'block';
    
    try {
        const response = await fetch('/api/crawl');
        const data = await response.json();
        
        if (data.success) {
            allPosts.realtime = data.posts.map(post => ({
                ...post,
                id: `realtime-${post.site}-${Date.now()}-${Math.random()}`,
                type: 'realtime',
                timestamp: Date.now()
            }));
            
            checkForNewPosts(allPosts.realtime);
            renderRealtimePosts();
            updateLastUpdateTime();
            
            // 배지 업데이트
            document.getElementById('realtimeBadge').textContent = allPosts.realtime.length;
        }
    } catch (error) {
        console.error('크롤링 실패:', error);
        document.getElementById('realtimePosts').innerHTML = `
            <div class="empty-state">
                <i class="fas fa-exclamation-triangle"></i>
                <h3>게시글을 불러올 수 없습니다</h3>
                <p>잠시 후 다시 시도해주세요</p>
            </div>
        `;
    } finally {
        loading.style.display = 'none';
    }
}

function renderRealtimePosts() {
    const container = document.getElementById('realtimePosts');
    let posts = filterAndSortPosts(allPosts.realtime);
    
    if (posts.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-inbox"></i>
                <h3>표시할 게시글이 없습니다</h3>
                <p>필터나 검색 조건을 변경해보세요</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = posts.map(post => renderPostItem(post)).join('');
    attachPostEventListeners();
}

// ==================== 유머 게시글 ====================
function loadHumorPosts() {
    // 샘플 데이터 생성 (실제로는 posts-data.js에서 가져오기)
    allPosts.humor = generateSamplePosts('humor', 100);
    renderHumorPosts();
}

function renderHumorPosts() {
    const container = document.getElementById('humorPosts');
    let posts = filterAndSortPosts(allPosts.humor);
    
    // 배지 업데이트
    document.getElementById('humorBadge').textContent = posts.length;
    
    if (posts.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-inbox"></i>
                <h3>표시할 게시글이 없습니다</h3>
                <p>다른 기간이나 키워드로 검색해보세요</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = posts.slice(0, 50).map(post => renderPostItem(post)).join('');
    attachPostEventListeners();
}

// ==================== 연예 기사 ====================
function loadEntertainmentPosts() {
    allPosts.entertainment = generateSamplePosts('entertainment', 100);
    renderEntertainmentPosts();
}

function renderEntertainmentPosts() {
    const container = document.getElementById('entertainmentPosts');
    let posts = filterAndSortPosts(allPosts.entertainment);
    
    // 배지 업데이트
    document.getElementById('entertainmentBadge').textContent = posts.length;
    
    if (posts.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-inbox"></i>
                <h3>표시할 게시글이 없습니다</h3>
                <p>다른 키워드로 검색해보세요</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = posts.slice(0, 50).map(post => renderPostItem(post)).join('');
    attachPostEventListeners();
}

// ==================== 즐겨찾기 ====================
function renderFavoritePosts() {
    const container = document.getElementById('favoritePosts');
    const emptyState = document.getElementById('emptyFavorites');
    
    const posts = [...allPosts.realtime, ...allPosts.humor, ...allPosts.entertainment]
        .filter(post => favoritePosts.has(post.id));
    
    if (posts.length === 0) {
        emptyState.style.display = 'block';
        container.innerHTML = '';
        return;
    }
    
    emptyState.style.display = 'none';
    container.innerHTML = posts.map(post => renderPostItem(post)).join('');
    attachPostEventListeners();
}

// ==================== 게시글 렌더링 ====================
function renderPostItem(post) {
    const isRead = readPosts.has(post.id);
    const isFavorited = favoritePosts.has(post.id);
    const isNew = !lastPostIds.has(post.id) && (Date.now() - post.timestamp < 300000); // 5분 이내
    
    return `
        <div class="post-item ${isRead ? 'read' : ''} ${isNew ? 'new' : ''}" data-id="${post.id}" data-link="${post.link}">
            <div class="post-site" style="background: ${post.siteColor}20; color: ${post.siteColor};">
                ${post.siteName}
            </div>
            <div class="post-content">
                <div class="post-title">${post.title}</div>
                <div class="post-meta">
                    ${post.views ? `<span><i class="fas fa-eye"></i> ${formatNumber(post.views)}</span>` : ''}
                    ${post.comments ? `<span><i class="fas fa-comment"></i> ${formatNumber(post.comments)}</span>` : ''}
                    <span><i class="fas fa-clock"></i> ${formatTimeAgo(post.timeAgo || post.pubDate)}</span>
                </div>
            </div>
            <button class="action-btn favorite-btn ${isFavorited ? 'favorited' : ''}" data-action="favorite">
                <i class="fas fa-heart"></i>
            </button>
        </div>
    `;
}

function attachPostEventListeners() {
    document.querySelectorAll('.post-item').forEach(item => {
        const id = item.dataset.id;
        const link = item.dataset.link;
        
        // 게시글 클릭
        item.addEventListener('click', (e) => {
            if (e.target.closest('.action-btn')) return;
            
            markAsRead(id);
            window.open(link, '_blank');
        });
        
        // 즐겨찾기
        item.querySelector('.favorite-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            toggleFavorite(id);
        });
    });
}

// ==================== 필터링 & 정렬 ====================
function filterAndSortPosts(posts) {
    let filtered = posts.filter(post => {
        // 사이트 필터
        if (currentSiteFilter !== 'all' && post.siteName !== currentSiteFilter) {
            return false;
        }
        
        // 검색어 필터
        if (currentSearchTerm && !post.title.toLowerCase().includes(currentSearchTerm)) {
            return false;
        }
        
        // 유머 탭 전용: 기간 필터
        if (currentTab === 'humor' && currentTimeFilter !== 'all') {
            const hours = parseInt(currentTimeFilter);
            const postTime = post.timestamp;
            const now = Date.now();
            const diff = now - postTime;
            const hoursDiff = diff / (1000 * 60 * 60);
            
            if (hoursDiff > hours) {
                return false;
            }
        }
        
        // 유머 탭 전용: 키워드 검색
        if (currentTab === 'humor' && currentHumorKeyword && !post.title.toLowerCase().includes(currentHumorKeyword)) {
            return false;
        }
        
        // 연예 탭 전용: 키워드 검색
        if (currentTab === 'entertainment' && currentEntertainmentKeyword && !post.title.toLowerCase().includes(currentEntertainmentKeyword)) {
            return false;
        }
        
        // 읽은 글 필터
        if (settings.hideReadPosts && readPosts.has(post.id)) {
            return false;
        }
        
        // 새 글만 보기
        if (settings.showOnlyNew && !lastPostIds.has(post.id)) {
            return false;
        }
        
        // 차단 키워드
        if (settings.blockKeywords.some(keyword => post.title.includes(keyword))) {
            return false;
        }
        
        return true;
    });
    
    // 정렬
    if (currentSort === 'views') {
        filtered.sort((a, b) => (b.views || 0) - (a.views || 0));
    } else if (currentSort === 'comments') {
        filtered.sort((a, b) => (b.comments || 0) - (a.comments || 0));
    } else {
        filtered.sort((a, b) => b.timestamp - a.timestamp);
    }
    
    return filtered;
}

// ==================== 읽은 글 관리 ====================
function markAsRead(postId) {
    readPosts.add(postId);
    saveReadPosts();
    
    const postElement = document.querySelector(`[data-id="${postId}"]`);
    if (postElement) {
        postElement.classList.add('read');
    }
}

function loadReadPosts() {
    const saved = localStorage.getItem('readPosts');
    if (saved) {
        readPosts = new Set(JSON.parse(saved));
    }
}

function saveReadPosts() {
    localStorage.setItem('readPosts', JSON.stringify([...readPosts]));
}

// ==================== 즐겨찾기 관리 ====================
function toggleFavorite(postId) {
    if (favoritePosts.has(postId)) {
        favoritePosts.delete(postId);
    } else {
        favoritePosts.add(postId);
    }
    
    saveFavoritePosts();
    
    // UI 업데이트
    const btn = document.querySelector(`[data-id="${postId}"] .favorite-btn`);
    if (btn) {
        btn.classList.toggle('favorited');
    }
    
    // 배지 업데이트
    document.getElementById('favoritesBadge').textContent = favoritePosts.size;
    
    // 즐겨찾기 탭이면 다시 렌더링
    if (currentTab === 'favorites') {
        renderFavoritePosts();
    }
}

function loadFavoritePosts() {
    const saved = localStorage.getItem('favoritePosts');
    if (saved) {
        favoritePosts = new Set(JSON.parse(saved));
        document.getElementById('favoritesBadge').textContent = favoritePosts.size;
    }
}

function saveFavoritePosts() {
    localStorage.setItem('favoritePosts', JSON.stringify([...favoritePosts]));
}

// ==================== 자동 새로고침 ====================
function startAutoRefresh() {
    // 5분마다 새로고침
    autoRefreshInterval = setInterval(() => {
        loadRealtimePosts();
        secondsUntilUpdate = 300;
    }, 5 * 60 * 1000);
    
    // 카운트다운
    nextUpdateCountdown = setInterval(() => {
        secondsUntilUpdate--;
        if (secondsUntilUpdate < 0) secondsUntilUpdate = 300;
        
        const minutes = Math.floor(secondsUntilUpdate / 60);
        const seconds = secondsUntilUpdate % 60;
        document.getElementById('nextUpdate').textContent = 
            `다음 업데이트: ${minutes}:${seconds.toString().padStart(2, '0')}`;
    }, 1000);
}

// ==================== 새 글 알림 ====================
function checkForNewPosts(newPosts) {
    const newCount = newPosts.filter(post => !lastPostIds.has(post.id)).length;
    
    if (newCount > 0) {
        document.getElementById('newPostsCount').textContent = newCount;
        document.getElementById('newPostsAlert').style.display = 'flex';
    }
    
    // 현재 게시글 ID 저장
    newPosts.forEach(post => lastPostIds.add(post.id));
}

// ==================== 설정 관리 ====================
function loadSettings() {
    const saved = localStorage.getItem('settings');
    if (saved) {
        settings = { ...settings, ...JSON.parse(saved) };
    }
    
    document.getElementById('hideReadPosts').checked = settings.hideReadPosts;
    document.getElementById('showOnlyNew').checked = settings.showOnlyNew;
}

function saveSettings() {
    localStorage.setItem('settings', JSON.stringify(settings));
}

function renderSettingsModal() {
    // 차단 키워드
    const keywordsContainer = document.getElementById('blockKeywords');
    keywordsContainer.innerHTML = settings.blockKeywords.map(keyword => `
        <div class="tag-item">
            ${keyword}
            <button class="tag-remove" data-keyword="${keyword}">×</button>
        </div>
    `).join('');
    
    keywordsContainer.querySelectorAll('.tag-remove').forEach(btn => {
        btn.addEventListener('click', () => {
            settings.blockKeywords = settings.blockKeywords.filter(k => k !== btn.dataset.keyword);
            saveSettings();
            renderSettingsModal();
            renderCurrentTab();
        });
    });
}

function saveSettingsFromModal() {
    saveSettings();
}

function addBlockKeyword() {
    const input = document.getElementById('blockKeywordInput');
    const keyword = input.value.trim();
    
    if (keyword && !settings.blockKeywords.includes(keyword)) {
        settings.blockKeywords.push(keyword);
        saveSettings();
        renderSettingsModal();
        renderCurrentTab();
        input.value = '';
    }
}

// ==================== 모달 ====================
function openModal(modalId) {
    document.getElementById(modalId).classList.add('active');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

// ==================== 유틸리티 ====================
function formatNumber(num) {
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'k';
    }
    return num;
}

function formatTimeAgo(input) {
    if (!input) return '방금 전';
    
    let date;
    if (typeof input === 'string') {
        date = new Date(input);
    } else {
        date = new Date(input);
    }
    
    const now = new Date();
    const diff = Math.floor((now - date) / 1000);
    
    if (diff < 60) return '방금 전';
    if (diff < 3600) return Math.floor(diff / 60) + '분 전';
    if (diff < 86400) return Math.floor(diff / 3600) + '시간 전';
    return Math.floor(diff / 86400) + '일 전';
}

function updateLastUpdateTime() {
    const now = new Date();
    const timeStr = now.getHours() + ':' + now.getMinutes().toString().padStart(2, '0');
    document.getElementById('lastUpdate').textContent = '마지막 업데이트: ' + timeStr;
}

// ==================== 샘플 데이터 생성 ====================
function generateSamplePosts(type, count) {
    const sites = type === 'humor' 
        ? [
            // 크롤링 시도하는 모든 사이트들 (샘플 데모용)
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
            { name: 'Naver', color: '#03C75A' },
            { name: '스조', color: '#e74c3c' },
            { name: 'OSEN', color: '#3498db' },
            { name: '엑스포츠', color: '#9b59b6' },
            { name: '텐아시아', color: '#e67e22' },
            { name: '디스패치', color: '#c0392b' },
            { name: 'MK', color: '#27ae60' },
            { name: '스타뉴스', color: '#f39c12' }
        ];
    
    const titles = type === 'humor' 
        ? [
            '이번에 나온 신작 게임 진짜 재밌네요',
            '오늘 회사에서 있었던 일.jpg',
            '와 이거 실화냐? ㄷㄷㄷ',
            '혼자 사는 사람들 공감할 만한 짤',
            '요즘 유행하는 밈 정리',
            '이거 보고 빵터졌습니다 ㅋㅋㅋㅋ',
            '길에서 본 신기한 장면',
            '편의점 알바 썰 푼다',
            '우리 동네 맛집 추천',
            '이런 상황 어떻게 대처하나요?',
            '축구 경기 보다가 놀란 점',
            '이번 시즌 드라마 추천해주세요',
            '야구장에서 있었던 일',
            '맛집 탐방 후기 올립니다',
            '게임 신작 리뷰 (스포 없음)'
        ]
        : [
            '[단독] ○○○, 열애설 공식 입장 발표',
            '△△△, 신곡 발매와 함께 컴백 예고',
            '□□□ 결혼 발표... 상대는?',
            '[속보] ○○○, SNS 통해 근황 공개',
            '△△△ 드라마, 시청률 1위 기록',
            '□□□, 논란 해명... "오해였다"',
            '[포토] ○○○, 공항패션 화제',
            '△△△ 콘서트 티켓 오픈 10분 만에 매진',
            '□□□, 새 영화 캐스팅 확정',
            '[★이슈] ○○○, 과거 발언 재조명'
        ];
    
    return Array.from({ length: count }, (_, i) => {
        const site = sites[Math.floor(Math.random() * sites.length)];
        const title = titles[Math.floor(Math.random() * titles.length)];
        
        // 유머 게시글의 경우 다양한 시간대로 분산
        let timeOffset;
        if (type === 'humor') {
            // 0~30시간 사이 랜덤 (더 넓은 범위)
            timeOffset = Math.random() * 3600000 * 30;
        } else {
            // 0~24시간 사이
            timeOffset = Math.random() * 3600000 * 24;
        }
        
        return {
            id: `${type}-${i}-${Date.now()}-${Math.random()}`,
            type,
            siteName: site.name,
            siteColor: site.color,
            title: title + ' ' + (i + 1),
            link: site.url || '#',
            views: Math.floor(Math.random() * 50000) + 100,
            comments: Math.floor(Math.random() * 500) + 5,
            timestamp: Date.now() - timeOffset,
            timeAgo: null
        };
    });
}
