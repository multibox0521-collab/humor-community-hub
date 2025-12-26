// 사이트 정보
const siteInfo = {
    'clien': { label: '클리앙', color: '#34495e' },
    'ruliweb': { label: '루리웹', color: '#3498db' },
    'ppomppu': { label: '뽐뿌', color: '#9b59b6' },
    'dogdrip': { label: '개드립', color: '#ff5722' },
    'todayhumor': { label: '오유', color: '#e67e22' }
};

// 전역 변수
let allPosts = [];
let filteredPosts = [];
let currentSiteFilter = 'all';
let currentSearchTerm = '';

// 초기화
document.addEventListener('DOMContentLoaded', () => {
    loadRealPosts();
    initEventListeners();
});

// 실제 게시글 로드
async function loadRealPosts() {
    showLoading(true);
    
    try {
        console.log('API 호출 시작...');
        
        // Vercel Function 호출
        const response = await fetch('/api/crawl');
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        console.log('API 응답:', data);
        
        if (!data.success) {
            throw new Error(data.error || '크롤링 실패');
        }
        
        allPosts = data.posts;
        filteredPosts = [...allPosts];
        
        console.log(`✅ 성공! 총 ${allPosts.length}개 게시글 로드`);
        
        showLoading(false);
        renderPosts();
        updatePostCount();
        updateTime();
        
    } catch (error) {
        console.error('❌ 크롤링 오류:', error);
        showError(error.message);
    }
}

// 이벤트 리스너 초기화
function initEventListeners() {
    // 검색
    document.getElementById('searchInput').addEventListener('input', (e) => {
        currentSearchTerm = e.target.value.toLowerCase();
        filterPosts();
    });

    // 사이트 필터
    document.querySelectorAll('.site-tabs .filter-tab').forEach(tab => {
        tab.addEventListener('click', (e) => {
            document.querySelectorAll('.site-tabs .filter-tab').forEach(t => t.classList.remove('active'));
            e.currentTarget.classList.add('active');
            currentSiteFilter = e.currentTarget.dataset.site;
            filterPosts();
        });
    });

    // 새로고침 버튼
    document.getElementById('refreshBtn').addEventListener('click', () => {
        loadRealPosts();
    });
}

// 게시글 필터링
function filterPosts() {
    let posts = [...allPosts];

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
                <p>게시글이 없습니다.</p>
            </div>
        `;
        return;
    }

    container.innerHTML = filteredPosts.map(post => {
        const info = siteInfo[post.site] || { label: post.siteName, color: '#666' };
        
        return `
            <a href="${post.link}" 
               target="_blank" 
               rel="noopener noreferrer" 
               class="post-card" 
               data-site="${post.site}">
                <div class="site-icon" style="background: ${info.color}">${info.label}</div>
                <div class="post-title">${post.title}</div>
                <div class="post-stats">
                    ${post.views > 0 ? `
                        <span class="stat-item">
                            <i class="far fa-eye"></i>
                            ${formatNumber(post.views)}
                        </span>
                    ` : ''}
                    ${post.comments > 0 ? `
                        <span class="stat-item">
                            <i class="far fa-comment"></i>
                            ${formatNumber(post.comments)}
                        </span>
                    ` : ''}
                </div>
                <div class="post-time">${post.timeAgo}</div>
            </a>
        `;
    }).join('');
}

// 게시글 수 업데이트
function updatePostCount() {
    document.getElementById('postCount').textContent = filteredPosts.length;
}

// 업데이트 시간 표시
function updateTime() {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('ko-KR', { 
        hour: '2-digit', 
        minute: '2-digit' 
    });
    document.getElementById('updateTime').textContent = `마지막 업데이트: ${timeStr}`;
}

// 숫자 포맷팅
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// 로딩 상태 표시
function showLoading(isLoading) {
    document.getElementById('loadingState').style.display = isLoading ? 'flex' : 'none';
    document.getElementById('filterSection').style.display = isLoading ? 'none' : 'block';
    document.getElementById('postsContainer').style.display = isLoading ? 'none' : 'block';
}

// 에러 표시
function showError(errorMsg) {
    showLoading(false);
    document.getElementById('postsContainer').innerHTML = `
        <div class="empty-state">
            <i class="fas fa-exclamation-triangle" style="color: #e74c3c; font-size: 4rem;"></i>
            <p style="margin-top: 20px; font-size: 1.1rem;">크롤링 실패</p>
            <p style="color: #999; margin-top: 10px;">${errorMsg}</p>
            <button onclick="loadRealPosts()" class="refresh-btn" style="margin-top: 20px;">
                <i class="fas fa-sync-alt"></i> 다시 시도
            </button>
            <div style="margin-top: 30px; padding: 20px; background: #fff3cd; border-radius: 8px; text-align: left;">
                <strong>💡 참고:</strong>
                <ul style="margin-top: 10px; margin-left: 20px; color: #856404;">
                    <li>Vercel에 배포 후 작동합니다</li>
                    <li>로컬에서는 <code>vercel dev</code> 명령어로 테스트하세요</li>
                    <li>각 커뮤니티 사이트가 차단할 수 있습니다</li>
                </ul>
            </div>
        </div>
    `;
}
