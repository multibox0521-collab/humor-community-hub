// 전역 변수
let currentSiteFilter = 'all';
let currentSearchTerm = '';
let filteredArticles = [...newsArticles];

// 언론사 정보 매핑
const siteInfo = {
    'naver': { label: '네이버', color: '#03C75A' },
    'sports': { label: '스조', color: '#e74c3c' },
    'osen': { label: 'OSEN', color: '#3498db' },
    'xports': { label: '엑스포츠', color: '#9b59b6' },
    'tenasia': { label: '텐아시아', color: '#e67e22' },
    'dispatch': { label: '디스패치', color: '#c0392b' },
    'mk': { label: 'MK', color: '#27ae60' },
    'star': { label: '스타뉴스', color: '#f39c12' }
};

// 초기화
document.addEventListener('DOMContentLoaded', () => {
    renderArticles();
    updateArticleCount();
    initEventListeners();
});

// 이벤트 리스너 초기화
function initEventListeners() {
    // 검색 입력
    document.getElementById('searchInput').addEventListener('input', (e) => {
        currentSearchTerm = e.target.value.toLowerCase();
        filterArticles();
    });

    // 사이트 필터 탭 클릭
    document.querySelectorAll('.site-tabs .filter-tab').forEach(tab => {
        tab.addEventListener('click', (e) => {
            document.querySelectorAll('.site-tabs .filter-tab').forEach(t => t.classList.remove('active'));
            e.currentTarget.classList.add('active');
            
            currentSiteFilter = e.currentTarget.dataset.site;
            filterArticles();
        });
    });
}

// 기사 필터링
function filterArticles() {
    let articles = [...newsArticles];
    
    // 검색어 필터링
    if (currentSearchTerm) {
        articles = articles.filter(article => 
            article.title.toLowerCase().includes(currentSearchTerm)
        );
    }
    
    // 언론사 필터링
    if (currentSiteFilter !== 'all') {
        articles = articles.filter(article => article.site === currentSiteFilter);
    }
    
    filteredArticles = articles;
    renderArticles();
    updateArticleCount();
}

// 기사 렌더링
function renderArticles() {
    const container = document.getElementById('postsContainer');
    
    if (filteredArticles.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-inbox"></i>
                <p>해당 조건의 기사가 없습니다.</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = filteredArticles.map(article => {
        const info = siteInfo[article.site];
        return `
            <a href="${article.url}" 
               target="_blank" 
               rel="noopener noreferrer" 
               class="post-card" 
               data-site="${article.site}">
                <div class="site-icon" style="background: ${info.color}">${info.label}</div>
                <div class="post-title">${article.title}</div>
                <div class="post-stats">
                    <span class="stat-item">
                        <i class="far fa-eye"></i>
                        ${formatNumber(article.views)}
                    </span>
                    <span class="stat-item">
                        <i class="far fa-comment"></i>
                        ${formatNumber(article.comments)}
                    </span>
                </div>
                <div class="post-time">${article.time}</div>
            </a>
        `;
    }).join('');
}

// 기사 수 업데이트
function updateArticleCount() {
    document.getElementById('postCount').textContent = filteredArticles.length;
}

// 숫자 포맷팅 (천 단위 콤마)
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}