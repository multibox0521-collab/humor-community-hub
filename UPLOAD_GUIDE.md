# 📤 GitHub 수동 업로드 가이드

## 수정해야 할 파일 3개

### 1. vercel.json
### 2. api/crawl.js  
### 3. README.md

---

## 🔧 업로드 방법

### **방법 1: GitHub 웹사이트에서 직접 수정**

#### **1. vercel.json 수정하기**

1. https://github.com/your-username/humor-community-hub 접속
2. `vercel.json` 파일 클릭
3. 오른쪽 위 **연필 아이콘** (Edit this file) 클릭
4. 전체 내용을 **삭제**하고 아래 내용으로 교체:

\`\`\`json
{
  "functions": {
    "api/**/*.js": {
      "memory": 1024,
      "maxDuration": 30
    }
  }
}
\`\`\`

5. 페이지 하단 **Commit changes** 버튼 클릭
6. 커밋 메시지: `Timeout 30초로 증가`
7. **Commit changes** 확인

---

#### **2. api/crawl.js 수정하기**

1. https://github.com/your-username/humor-community-hub 접속
2. `api` 폴더 클릭
3. `crawl.js` 파일 클릭
4. 오른쪽 위 **연필 아이콘** (Edit this file) 클릭
5. 전체 내용을 **삭제**하고 현재 프로젝트의 `api/crawl.js` 내용으로 교체
6. 페이지 하단 **Commit changes** 버튼 클릭
7. 커밋 메시지: `5개 사이트만 크롤링, 8초 타임아웃 추가`
8. **Commit changes** 확인

---

#### **3. README.md 수정하기**

1. https://github.com/your-username/humor-community-hub 접속
2. `README.md` 파일 클릭
3. 오른쪽 위 **연필 아이콘** (Edit this file) 클릭
4. 크롤링 섹션 부분만 수정
5. 페이지 하단 **Commit changes** 버튼 클릭
6. 커밋 메시지: `크롤링 정보 업데이트`
7. **Commit changes** 확인

---

## ⏰ Vercel 자동 재배포

GitHub에 파일을 업로드하면:
1. Vercel이 자동으로 감지 (10초)
2. 자동으로 빌드 시작 (30초~1분)
3. 배포 완료! ✅

---

## 🧪 테스트

배포 완료 후 (약 2분 후):

1. **API 직접 테스트:**
   ```
   https://humor-community-hub7563.vercel.app/api/crawl
   ```
   → 성공하면 JSON 데이터가 표시됩니다!

2. **실시간 크롤링 테스트:**
   - https://humor-community-hub7563.vercel.app/all-in-one.html
   - 실시간 탭 클릭
   - 10초 기다리기
   - 게시글이 나타나는지 확인!

---

## ✅ 성공 확인

콘솔(F12)에서 이런 메시지가 나오면 성공:

\`\`\`
🚀 실시간 크롤링 시작...
📡 API 응답 상태: 200 OK
📦 받은 데이터: {...}
✅ 크롤링 성공!
📊 사이트별 결과: {clien: 15, ruliweb: 15, ppomppu: 15, dogdrip: 15, todayhumor: 15}
📝 총 75개 게시글 중 TOP 15개 표시
\`\`\`

---

## 🚨 문제 발생 시

- 504 Timeout → 다시 한번 더 기다려보기 (최대 30초)
- 500 Error → Vercel Logs 확인
- CORS Error → 브라우저 캐시 삭제 (Ctrl + Shift + R)

---

**파일 업로드 후 약 2분 기다렸다가 테스트하세요!** 😊
