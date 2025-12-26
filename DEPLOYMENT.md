# 🚀 Vercel 배포 가이드

이 프로젝트는 **실시간 크롤링** 기능을 위해 Vercel Functions를 사용합니다.

## 📋 준비물

1. ✅ [Vercel 계정](https://vercel.com) (무료)
2. ✅ [GitHub 계정](https://github.com) (무료)
3. ✅ Git 설치

---

## 🔥 빠른 배포 (5분)

### 1단계: GitHub에 업로드

```bash
# 프로젝트 폴더에서 실행
git init
git add .
git commit -m "Initial commit"

# GitHub에 새 레포지토리 생성 후
git remote add origin https://github.com/your-username/your-repo.git
git push -u origin main
```

### 2단계: Vercel 연결

1. [Vercel](https://vercel.com) 접속 및 로그인
2. **"New Project"** 클릭
3. **"Import Git Repository"** 선택
4. GitHub 레포지토리 선택
5. **"Deploy"** 클릭!

**끝!** 🎉

배포 완료되면:
- `https://your-project.vercel.app` 접속
- `live.html` 페이지에서 실시간 크롤링 확인!

---

## 🛠️ 로컬 테스트

배포 전에 로컬에서 테스트하려면:

```bash
# 패키지 설치
npm install

# Vercel 개발 서버 실행
npm run dev
```

그 다음:
- `http://localhost:3000` 접속
- `live.html` 페이지에서 크롤링 테스트

---

## 🔍 작동 원리

### 아키텍처

```
[사용자] → [live.html]
              ↓
         [/api/crawl]  ← Vercel Function (서버리스)
              ↓
      [각 커뮤니티 크롤링]
              ↓
         [실제 게시글 반환]
              ↓
         [화면에 표시]
```

### 크롤링 대상

- ✅ 클리앙 (모두의공원)
- ✅ 루리웹 (베스트 게시판)
- ✅ 뽐뿌 (자유게시판)
- ✅ 개드립
- ✅ 오늘의유머 (베오베)

### 제한사항

- **요청 한도**: 무료 플랜 - 월 100GB 대역폭
- **실행 시간**: 함수당 최대 10초
- **동시 실행**: 무제한

---

## 💰 비용

**완전 무료!** (무료 플랜으로 충분)

무료 플랜 제공:
- ✅ 월 100GB 대역폭
- ✅ 무제한 요청
- ✅ 자동 HTTPS
- ✅ 글로벌 CDN

---

## 🐛 문제 해결

### 크롤링 실패시

**원인:**
1. 커뮤니티 사이트 HTML 구조 변경
2. IP 차단
3. 타임아웃

**해결:**
1. `api/crawl.js` 파일에서 해당 사이트 셀렉터 수정
2. User-Agent 변경
3. 실행 시간 늘리기 (vercel.json에서 maxDuration 조정)

### CORS 에러

이미 `api/crawl.js`에 CORS 헤더가 설정되어 있습니다.
문제 있으면 `setCORS` 함수 확인.

### 로컬에서 안 될 때

반드시 `vercel dev` 명령어로 실행해야 합니다:
```bash
npm run dev
```

일반 `index.html` 더블클릭으로는 API가 작동하지 않습니다.

---

## 📈 성능 최적화

### 캐싱 추가 (선택사항)

`api/crawl.js`에 캐싱 로직 추가:

```javascript
let cachedData = null;
let cacheTime = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5분

export default async function handler(req, res) {
  // 캐시 확인
  if (cachedData && cacheTime && Date.now() - cacheTime < CACHE_DURATION) {
    console.log('캐시된 데이터 반환');
    return res.status(200).json(cachedData);
  }
  
  // ... 크롤링 로직 ...
  
  // 캐시 저장
  cachedData = result;
  cacheTime = Date.now();
  
  res.status(200).json(result);
}
```

---

## 🔐 보안

### User-Agent 설정

각 크롤링 함수에 이미 User-Agent가 설정되어 있습니다.
차단되면 다른 User-Agent로 변경 가능.

### Rate Limiting

필요시 Vercel Edge Config로 요청 제한 추가 가능.

---

## 📞 지원

문제 있으면:
1. Vercel 대시보드에서 로그 확인
2. 브라우저 콘솔(F12) 확인
3. `/api/crawl`을 직접 브라우저에서 접속해서 JSON 확인

---

## 🎉 완료!

배포 성공하면:
- ⚡ **live.html** - 실시간 크롤링 (진짜 게시글!)
- 🔥 **posts.html** - 샘플 인기글
- ⭐ **news.html** - 샘플 연예기사

**실시간 크롤링 페이지에서 클릭하면 실제 게시글로 이동합니다!** 🚀
