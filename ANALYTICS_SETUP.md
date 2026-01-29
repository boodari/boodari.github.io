# Google Analytics 설정 가이드

## 1. Google Analytics 계정 생성

1. [Google Analytics](https://analytics.google.com/) 접속
2. "측정 시작" 클릭
3. 계정 이름 입력 (예: "비트코인 살껄")
4. 속성 이름 입력 (예: "boodari.github.io")
5. 시간대: **대한민국 (GMT+9)**
6. 통화: **대한민국 원 (₩)**
7. "웹" 선택
8. 웹사이트 URL: `https://boodari.github.io`
9. 스트림 이름: "비트코인 살껄"

## 2. Measurement ID 확인

1. 속성 설정 완료 후 **"G-XXXXXXXXXX"** 형식의 Measurement ID 확인
2. 이 ID를 복사하세요

## 3. nuxt.config.ts 업데이트

`nuxt.config.ts` 파일에서 다음 부분을 실제 Measurement ID로 변경:

```typescript
gtag: {
    id: "G-XXXXXXXXXX", // ← 여기를 실제 ID로 변경
},
```

## 4. 배포 및 확인

```bash
npm run deploy
```

배포 후 Google Analytics에서:
1. 실시간 보고서로 이동
2. 사이트 방문 시 즉시 확인 가능

## 5. 주요 측정 지표

자동으로 수집되는 데이터:
- ✅ 페이지뷰 (방문자 수)
- ✅ 세션 (방문 횟수)
- ✅ 이탈률
- ✅ 평균 세션 시간
- ✅ 사용자 위치 (국가/도시)
- ✅ 기기 정보 (모바일/데스크톱)
- ✅ 트래픽 소스 (어디서 유입되었는지)

## 참고

- **개인정보 보호**: Google Analytics는 IP 익명화를 기본으로 사용합니다
- **GDPR 준수**: EU 사용자가 많다면 쿠키 동의 배너 추가 권장
- **실시간 확인**: 설정 후 바로 실시간 데이터 확인 가능
