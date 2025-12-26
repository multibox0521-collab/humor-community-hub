// RSS 피드 정보
const rssSources = [
    {
        id: 'clien',
        name: '클리앙',
        color: '#34495e',
        rssUrl: 'https://www.clien.net/service/board/park?&od=T31&po=0&category=&groupCd=&rss'
    },
    {
        id: 'ruliweb',
        name: '루리웹',
        color: '#3498db',
        rssUrl: 'https://bbs.ruliweb.com/community/board/300143?rss=1'
    },
    {
        id: 'ppomppu',
        name: '뽐뿌',
        color: '#9b59b6',
        rssUrl: 'https://www.ppomppu.co.kr/rss.php?id=ppomppu'
    },
    {
        id: 'bobaedream',
        name: '보배드림',
        color: '#e74c3c',
        rssUrl: 'https://www.bobaedream.co.kr/rss/cyber.xml'
    },
    {
        id: 'dogdrip',
        name: '개드립',
        color: '#ff5722',
        rssUrl: 'https://www.dogdrip.net/dogdrip?mode=rss'
    },
    {
        id: 'todayhumor',
        name: '오늘의유머',
        color: '#e67e22',
        rssUrl: 'http://www.todayhumor.co.kr/rss/bestofbest.xml'
    },
    {
        id: 'slrclub',
        name: 'SLR클럽',
        color: '#1abc9c',
        rssUrl: 'https://www.slrclub.com/rss/zboard.php?id=free'
    },
    {
        id: 'mlbpark',
        name: 'MLB파크',
        color: '#c0392b',
        rssUrl: 'http://mlbpark.donga.com/mp/rss.php?m=best'
    }
];

// 전역 변수
let allPosts = [];
let filteredPosts = [];
let currentSiteFilter = 'all';
let currentSearchTerm = '';

// 초기화
document.addEventListener('DOMContentLoaded', () => {
    loadAllFeeds();
    initEventListeners();
});

// 모든 RSS 피드 로드
async function loadAllFeeds() {
    showLoading(true);
    allPosts = [];

    try {
        // 모든 RSS 피드를 병렬로 가져오기
        const promises = rssSources.map(source => fetchRSS(source));
        const results = await Promise.allSettled(promises);

        results.forEach((result, index) => {
            if (result.status === 'fulfilled' && result.value) {
                allPosts = allPosts.concat(result.value);
            } else {
                console.error(`${rssSources[index].name} RSS 로드 실패:`, result.reason);
            }
        });

        // 시간순 정렬 (최신순)
        allPosts.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));

        filteredPosts = [...allPosts];
        showLoading(false);
        renderPosts();
        updatePostCount();
    } catch (error) {
        console.error('RSS 피드 로드 오류:', error);
        showError();
    }
}

// RSS 피드 가져오기
async function fetchRSS(source) {
    // 방법 1: RSS2JSON API 사용 (추천)
    try {
        const RSS2JSON_API = 'https://api.rss2json.com/v1/api.json';
        const url = `${RSS2JSON_API}?rss_url=${encodeURIComponent(source.rssUrl)}&count=20`;

        const response = await fetch(url);
        if (!response.ok) throw new Error('RSS 피드 가져오기 실패');
        
        const data = await response.json();
        
        if (data.status !== 'ok') {
            console.error(`${source.name} RSS 오류:`, data.message);
            throw new Error(data.message || 'RSS 파싱 실패');
        }

        console.log(`✅ ${source.name} RSS 성공:`, data.items.length, '개 게시글');
        
        // 첫 번째 아이템 확인
        if (data.items.length > 0) {
            console.log(`${source.name} 샘플:`, {
                title: data.items[0].title,
                link: data.items[0].link
            });
        }

        return data.items.map(item => {
            const post = {
                id: `${source.id}_${item.guid || Math.random()}`,
                site: source.id,
                siteName: source.name,
                siteColor: source.color,
                title: cleanTitle(item.title),
                link: item.link || item.guid || '#',
                pubDate: item.pubDate || new Date().toISOString(),
                timeAgo: getTimeAgo(item.pubDate || new Date().toISOString())
            };
            
            return post;
        });
    } catch (error) {
        console.error(`❌ ${source.name} RSS 실패:`, error);
        
        // 방법 2: AllOrigins 프록시로 재시도
        try {
            console.log(`🔄 ${source.name} AllOrigins로 재시도...`);
            const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(source.rssUrl)}`;
            const response = await fetch(proxyUrl);
            const data = await response.json();
            
            // 간단한 XML 파싱 (제목과 링크만)
            const parser = new DOMParser();
            const xml = parser.parseFromString(data.contents, 'text/xml');
            const items = xml.querySelectorAll('item');
            
            console.log(`✅ ${source.name} AllOrigins 성공:`, items.length, '개');
            
            return Array.from(items).slice(0, 20).map((item, index) => ({
                id: `${source.id}_${index}`,
                site: source.id,
                siteName: source.name,
                siteColor: source.color,
                title: cleanTitle(item.querySelector('title')?.textContent || '제목 없음'),
                link: item.querySelector('link')?.textContent || '#',
                pubDate: item.querySelector('pubDate')?.textContent || new Date().toISOString(),
                timeAgo: getTimeAgo(item.querySelector('pubDate')?.textContent || new Date().toISOString())
            }));
        } catch (retryError) {
            console.error(`❌ ${source.name} 재시도도 실패:`, retryError);
            return null;
        }
    }
}

// 제목 정리 (HTML 태그 제거)
function cleanTitle(title) {
    const div = document.createElement('div');
    div.innerHTML = title;
    return div.textContent || div.innerText || title;
}

// 시간 경과 계산
function getTimeAgo(dateString) {
    const now = new Date();
    const date = new Date(dateString);
    const seconds = Math.floor((now - date) / 1000);

    if (seconds < 60) return '방금 전';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}분 전`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}시간 전`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}일 전`;
    return date.toLocaleDateString('ko-KR');
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
        loadAllFeeds();
    });

    // 디버그 버튼
    document.getElementById('debugBtn').addEventListener('click', () => {
        const debugDiv = document.getElementById('debugInfo');
        const debugContent = document.getElementById('debugContent');
        
        if (debugDiv.style.display === 'none') {
            // 디버그 정보 표시
            const info = {
                '전체 게시글 수': allPosts.length,
                '필터링된 게시글 수': filteredPosts.length,
                '샘플 게시글 (처음 3개)': filteredPosts.slice(0, 3).map(post => ({
                    사이트: post.siteName,
                    제목: post.title,
                    링크: post.link,
                    시간: post.timeAgo
                }))
            };
            
            debugContent.textContent = JSON.stringify(info, null, 2);
            debugDiv.style.display = 'block';
        } else {
            debugDiv.style.display = 'none';
        }
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

    console.log('렌더링할 게시글 수:', filteredPosts.length);
    console.log('첫 번째 게시글 링크:', filteredPosts[0]?.link);

    container.innerHTML = filteredPosts.map(post => {
        // 링크가 없거나 비어있는 경우 체크
        const link = post.link || '#';
        if (!post.link) {
            console.warn('링크 없음:', post.title);
        }
        
        return `
            <a href="${link}" 
               target="_blank" 
               rel="noopener noreferrer" 
               class="post-card" 
               data-site="${post.site}"
               data-link="${link}">
                <div class="site-icon" style="background: ${post.siteColor}">${post.siteName}</div>
                <div class="post-title">${post.title}</div>
                <div class="post-time">${post.timeAgo}</div>
            </a>
        `;
    }).join('');
}

// 게시글 수 업데이트
function updatePostCount() {
    document.getElementById('postCount').textContent = filteredPosts.length;
}

// 로딩 상태 표시
function showLoading(isLoading) {
    document.getElementById('loadingState').style.display = isLoading ? 'flex' : 'none';
    document.getElementById('filterSection').style.display = isLoading ? 'none' : 'block';
    document.getElementById('postsContainer').style.display = isLoading ? 'none' : 'block';
}

// 에러 표시
function showError() {
    showLoading(false);
    document.getElementById('postsContainer').innerHTML = `
        <div class="empty-state">
            <i class="fas fa-exclamation-triangle" style="color: #e74c3c;"></i>
            <p>RSS 피드를 불러오는데 실패했습니다.</p>
            <button onclick="loadAllFeeds()" class="refresh-btn" style="margin-top: 20px;">
                <i class="fas fa-sync-alt"></i> 다시 시도
            </button>
        </div>
    `;
}