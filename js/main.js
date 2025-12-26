// 전역 변수
let currentView = 'grid';
let favorites = [];
let visited = [];
let filteredSites = [...humorSites];

// 초기화
document.addEventListener('DOMContentLoaded', () => {
    loadFromStorage();
    renderSites();
    updateStats();
    initEventListeners();
});

// 로컬 스토리지에서 데이터 로드
function loadFromStorage() {
    const savedFavorites = localStorage.getItem(STORAGE_KEYS.favorites);
    const savedVisited = localStorage.getItem(STORAGE_KEYS.visited);
    
    favorites = savedFavorites ? JSON.parse(savedFavorites) : [];
    visited = savedVisited ? JSON.parse(savedVisited) : [];
}

// 로컬 스토리지에 저장
function saveToStorage() {
    localStorage.setItem(STORAGE_KEYS.favorites, JSON.stringify(favorites));
    localStorage.setItem(STORAGE_KEYS.visited, JSON.stringify(visited));
}

// 이벤트 리스너 초기화
function initEventListeners() {
    // 뷰 토글
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
            e.currentTarget.classList.add('active');
            currentView = e.currentTarget.dataset.view;
            renderSites();
        });
    });

    // 검색
    document.getElementById('searchInput').addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        filteredSites = humorSites.filter(site => 
            site.name.toLowerCase().includes(searchTerm) ||
            site.description.toLowerCase().includes(searchTerm) ||
            site.tags.some(tag => tag.toLowerCase().includes(searchTerm))
        );
        renderSites();
    });
}

// 사이트 렌더링
function renderSites() {
    const container = document.getElementById('sitesContainer');
    container.className = currentView === 'grid' ? 'sites-grid' : 'sites-list';
    
    if (filteredSites.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-search"></i>
                <p>검색 결과가 없습니다.</p>
            </div>
        `;
        return;
    }

    container.innerHTML = filteredSites.map(site => `
        <div class="site-card" data-site-id="${site.id}">
            <div class="site-header">
                <div class="site-icon" style="background: ${site.color || '#667eea'}">
                    ${site.icon}
                </div>
                <button class="favorite-btn ${favorites.includes(site.id) ? 'active' : ''}" 
                        onclick="toggleFavorite(event, ${site.id})">
                    <i class="fas fa-star"></i>
                </button>
            </div>
            <div class="site-info">
                <h3>${site.name}</h3>
                <p>${site.description}</p>
                <div class="site-tags">
                    ${site.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
            </div>
            <div class="site-actions">
                <a href="${site.url}" 
                   target="_blank" 
                   rel="noopener noreferrer" 
                   class="action-btn primary-btn"
                   onclick="markAsVisited(${site.id})">
                    <i class="fas fa-home"></i> 메인
                </a>
                <a href="${site.bestUrl}" 
                   target="_blank" 
                   rel="noopener noreferrer" 
                   class="action-btn best-btn"
                   onclick="markAsVisited(${site.id})">
                    <i class="fas fa-fire"></i> 베스트
                </a>
            </div>
            ${visited.includes(site.id) ? `
                <div class="visit-badge">
                    <i class="fas fa-check-circle"></i> 방문함
                </div>
            ` : ''}
        </div>
    `).join('');
}

// 즐겨찾기 토글
function toggleFavorite(event, siteId) {
    event.stopPropagation();
    
    const index = favorites.indexOf(siteId);
    if (index > -1) {
        favorites.splice(index, 1);
    } else {
        favorites.push(siteId);
    }
    
    saveToStorage();
    renderSites();
    updateStats();
}

// 방문 표시
function markAsVisited(siteId) {
    if (!visited.includes(siteId)) {
        visited.push(siteId);
        saveToStorage();
        updateStats();
        // 약간의 지연 후 렌더링 (방문 후 돌아왔을 때를 대비)
        setTimeout(() => {
            renderSites();
        }, 100);
    }
}

// 통계 업데이트
function updateStats() {
    document.getElementById('totalSites').textContent = humorSites.length;
    document.getElementById('visitedSites').textContent = visited.length;
    document.getElementById('favoriteSites').textContent = favorites.length;
}

// 사이트 카드 클릭 이벤트 (모바일 대응)
document.addEventListener('click', (e) => {
    const card = e.target.closest('.site-card');
    if (card && !e.target.closest('.favorite-btn') && !e.target.closest('.action-btn')) {
        const siteId = parseInt(card.dataset.siteId);
        const site = humorSites.find(s => s.id === siteId);
        if (site) {
            markAsVisited(siteId);
            window.open(site.bestUrl, '_blank', 'noopener,noreferrer');
        }
    }
});