// 연예기사 샘플 데이터 생성 함수
function generateNewsArticles() {
    const sources = [
        { id: 'naver', name: '네이버', color: '#03C75A' },
        { id: 'sports', name: '스포츠조선', color: '#e74c3c' },
        { id: 'osen', name: 'OSEN', color: '#3498db' },
        { id: 'xports', name: '엑스포츠', color: '#9b59b6' },
        { id: 'tenasia', name: '텐아시아', color: '#e67e22' },
        { id: 'dispatch', name: '디스패치', color: '#c0392b' },
        { id: 'mk', name: 'MK스포츠', color: '#27ae60' },
        { id: 'star', name: '스타뉴스', color: '#f39c12' }
    ];

    const titleTemplates = [
        '[단독] {star}, {event} 포착... 열애설 급부상',
        '{star}, {drama} 출연 확정... {detail}',
        '{star}, SNS에 {content} 공개... 팬들 환호',
        '[속보] {star}·{star2} 커플, {event} 인정',
        '{star}, {award} 수상... "{comment}"',
        '{star}, {movie} 캐스팅 확정... 상반기 촬영',
        '{star}, 결혼 발표... "평생 함께하겠다"',
        '{star}, {event}로 화제... 온라인 들썩',
        '{star}, {content} 관련 입장 발표',
        '{star}, 새 앨범 발매... 음원차트 1위 독주',
        '{star}, {variety} 출연... 예능감 폭발',
        '{star}, 패션위크 참석... 압도적 비주얼',
        '{star}, {scandal} 해명... "사실무근"',
        '{star}, 기부 소식 전해... {detail}',
        '{star}·{star2}, {program} 호흡 확정',
        '{star}, 컴백 앞두고 티저 공개... 기대감 UP',
        '{star}, {event} 인증샷... 근황 공개',
        '{star}, {movie} 홍보차 내한... 팬미팅 개최',
        '{star}, 결별 인정... "{comment}"',
        '{star}, {drama} 종영 소감... "감사하다"'
    ];

    const stars = [
        '아이유', '박서준', '손예진', '현빈', '수지', '이민호', '김고은', '공유',
        '송중기', '송혜교', '김수현', '전지현', '이종석', '한지민', '유아인', '박보영',
        '강동원', '한효주', '조정석', '윤아', '지창욱', '박신혜', '남주혁', '이성경',
        '차은우', '김태리', '정해인', '김다미', '박형식', '한소희'
    ];

    const events = [
        '데이트', '공항 출국', '카페 방문', '운동', '쇼핑', '식사', '산책', '모임'
    ];

    const dramas = [
        '새 드라마', '화제작', '기대작', 'tvN 드라마', 'JTBC 드라마', '넷플릭스 시리즈'
    ];

    const movies = [
        '신작 영화', '할리우드 영화', '독립영화', '블록버스터', '액션 영화', '로맨스 영화'
    ];

    const awards = [
        '대상', '최우수상', '인기상', '신인상', '연기대상', '공로상'
    ];

    const varieties = [
        '런닝맨', '놀면뭐하니', '유퀴즈', '나혼자산다', '전지적참견시점'
    ];

    const details = [
        '올해 최고 기대작', '벌써부터 화제', '팬들 기대감 폭발', '시청률 1위 예약',
        '대박 예감', '역대급 캐스팅', '완벽한 조합', '최고의 선택'
    ];

    const comments = [
        '최선을 다하겠다', '감사드린다', '좋은 모습 보여드릴 것', '행복하다',
        '영광이다', '열심히 하겠다', '사랑합니다', '보답하겠다'
    ];

    const articles = [];
    let id = 1;

    // 각 언론사당 13~14개씩 생성 (총 100개 이상)
    sources.forEach(source => {
        for (let i = 0; i < 13; i++) {
            const template = titleTemplates[Math.floor(Math.random() * titleTemplates.length)];
            const hours = Math.floor(Math.random() * 12) + 1;
            
            let title = template
                .replace('{star}', stars[Math.floor(Math.random() * stars.length)])
                .replace('{star2}', stars[Math.floor(Math.random() * stars.length)])
                .replace('{event}', events[Math.floor(Math.random() * events.length)])
                .replace('{drama}', dramas[Math.floor(Math.random() * dramas.length)])
                .replace('{movie}', movies[Math.floor(Math.random() * movies.length)])
                .replace('{award}', awards[Math.floor(Math.random() * awards.length)])
                .replace('{variety}', varieties[Math.floor(Math.random() * varieties.length)])
                .replace('{detail}', details[Math.floor(Math.random() * details.length)])
                .replace('{comment}', comments[Math.floor(Math.random() * comments.length)])
                .replace('{content}', ['근황', '일상', '사진', '영상', '메시지'][Math.floor(Math.random() * 5)])
                .replace('{scandal}', ['루머', '오해', '논란', '의혹'][Math.floor(Math.random() * 4)])
                .replace('{program}', ['예능', '드라마', '영화', '광고'][Math.floor(Math.random() * 4)]);

            articles.push({
                id: id++,
                site: source.id,
                siteName: source.name,
                siteColor: source.color,
                title: title,
                views: Math.floor(Math.random() * 100000) + 5000,
                comments: Math.floor(Math.random() * 500) + 10,
                time: hours === 1 ? '1시간 전' : `${hours}시간 전`,
                url: getNewsUrl(source.id)
            });
        }
    });

    // 시간 순으로 정렬
    articles.sort((a, b) => {
        const timeA = parseInt(a.time);
        const timeB = parseInt(b.time);
        return timeA - timeB;
    });

    return articles;
}

// 언론사별 URL
function getNewsUrl(sourceId) {
    const urls = {
        'naver': 'https://entertain.naver.com/home',
        'sports': 'https://sports.chosun.com/entertainment/',
        'osen': 'https://osen.mt.co.kr/',
        'xports': 'https://www.xportsnews.com/',
        'tenasia': 'https://tenasia.hankyung.com/',
        'dispatch': 'https://www.dispatch.co.kr/',
        'mk': 'https://www.mk.co.kr/sports/',
        'star': 'https://star.mt.co.kr/'
    };
    return urls[sourceId] || '#';
}

const newsArticles = generateNewsArticles();