// ==================== 전역 변수 ====================
let communityPosts = [];

// ==================== 초기화 ====================
document.addEventListener('DOMContentLoaded', () => {
    loadCommunityPosts();
    
    // 5분마다 자동 새로고침
    setInterval(loadCommunityPosts, 5 * 60 * 1000);
});

// ==================== 커뮤니티베스트 전체 ====================
async function loadCommunityPosts() {
    const container = document.getElementById('communityList');
    const updateSpan = document.getElementById('communityUpdate');
    const countBadge = document.getElementById('communityCount');
    
    console.log('🚀 커뮤니티베스트 전체 크롤링 시작...');
    
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
            // 조회수 높은 순으로 정렬 (전체)
            communityPosts = data.posts.sort((a, b) => (b.views || 0) - (a.views || 0));
            renderPosts(communityPosts, 'communityList');
            
            // 업데이트 시간 표시
            const now = new Date();
            const timeStr = now.getHours() + ':' + now.getMinutes().toString().padStart(2, '0');
            updateSpan.textContent = `마지막 업데이트: ${timeStr}`;
            document.getElementById('lastUpdate').textContent = `${timeStr} 업데이트됨`;
            
            // 개수 표시
            countBadge.textContent = communityPosts.length;
            
            console.log('✅ 커뮤니티베스트 크롤링 성공!');
            console.log('📊 사이트별 결과:', data.sites);
            console.log(`📝 총 ${data.count}개 게시글 표시`);
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
        
        updateSpan.textContent = '로딩 실패';
        document.getElementById('lastUpdate').textContent = '업데이트 실패';
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
        window.location.href = link;
    }
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
