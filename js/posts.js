// 전역 변수
let currentSiteFilter = 'all';
let currentTimeFilter = 'all';
let currentSearchTerm = '';
let filteredPosts = [...samplePosts];

// 사이트 정보 매핑
const siteInfo = {
    'dcinside': { label: '디시', color: '#4a90e2' },
    'hahaha': { label: '웃긴', color: '#f5a623' },
    'bobaedream': { label: '보배', color: '#e74c3c' },
    'ppomppu': { label: '뽐뿌', color: '#9b59b6' },
    'ruliweb': { label: '루리', color: '#3498db' },
    'clien': { label: '클리앙', color: '#34495e' },
    'todayhumor': { label: '오유', color: '#e67e22' },
    'fmkorea': { label: '에펨', color: '#27ae60' },
    'mlbpark': { label: 'MLB', color: '#c0392b' },
    'dogdrip': { label: '개드립', color: '#ff5722' }
};

// 초기화
document.addEventListener('DOMContentLoaded', () => {
    renderPosts();
    updatePostCount();
    initEventListeners();
});

// 이벤트 리스너 초기화
function initEventListeners() {
    // 검색 입력
    document.getElementById('searchInput').addEventListener('input', (e) => {
        currentSearchTerm = e.target.value.toLowerCase();
        filterPosts();
    });

    // 사이트 필터 탭 클릭
    document.querySelectorAll('.site-tabs .filter-tab').forEach(tab => {
        tab.addEventListener('click', (e) => {
            document.querySelectorAll('.site-tabs .filter-tab').forEach(t => t.classList.remove('active'));
            e.currentTarget.classList.add('active');
            
            currentSiteFilter = e.currentTarget.dataset.site;
            filterPosts();
        });
    });

    // 시간대 필터 탭 클릭
    document.querySelectorAll('.time-tabs .filter-tab').forEach(tab => {
        tab.addEventListener('click', (e) => {
            document.querySelectorAll('.time-tabs .filter-tab').forEach(t => t.classList.remove('active'));
            e.currentTarget.classList.add('active');
            
            currentTimeFilter = e.currentTarget.dataset.time;
            filterPosts();
        });
    });
}

// 게시글 필터링
function filterPosts() {
    let posts = [...samplePosts];
    
    // 검색어 필터링
    if (currentSearchTerm) {
        posts = posts.filter(post => 
            post.title.toLowerCase().includes(currentSearchTerm)
        );
    }
    
    // 사이트 필터링
    if (currentSiteFilter !== 'all') {
        posts = posts.filter(post => post.site === currentSiteFilter);
    }
    
    // 시간대 필터링
    if (currentTimeFilter !== 'all') {
        const maxHours = parseInt(currentTimeFilter);
        posts = posts.filter(post => {
            const hours = parseInt(post.time);
            return hours <= maxHours;
        });
    }
    
    filteredPosts = posts;
    renderPosts();
    updatePostCount();
}

// 게시글 렌더링
function renderPosts() {
    const container = document.getElementById('postsContainer');
    
    if (filteredPosts.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-inbox"></i>
                <p>해당 조건의 게시글이 없습니다.</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = filteredPosts.map(post => {
        const info = siteInfo[post.site];
        return `
            <a href="${post.url}" 
               target="_blank" 
               rel="noopener noreferrer" 
               class="post-card" 
               data-site="${post.site}">
                <div class="site-icon" style="background: ${info.color}">${info.label}</div>
                <div class="post-title">${post.title}</div>
                <div class="post-stats">
                    <span class="stat-item">
                        <i class="far fa-eye"></i>
                        ${formatNumber(post.views)}
                    </span>
                    <span class="stat-item">
                        <i class="far fa-comment"></i>
                        ${formatNumber(post.comments)}
                    </span>
                </div>
                <div class="post-time">${post.time}</div>
            </a>
        `;
    }).join('');
}

// 게시글 수 업데이트
function updatePostCount() {
    document.getElementById('postCount').textContent = filteredPosts.length;
}

// 숫자 포맷팅 (천 단위 콤마)
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}