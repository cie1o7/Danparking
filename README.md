# 단주차 앱 (DanParkApp)

단국대학교 죽전캠퍼스 주차장 관리 React Native 앱

## 📋 프로젝트 개요

- **플랫폼**: Android (React Native 0.72)
- **개발 환경**: MacBook Air M1
- **타겟**: 단국대학교 죽전캠퍼스 주차장 이용자

## 🛠 기술 스택

- **Frontend**: React Native 0.72, TypeScript
- **상태 관리**: Zustand, React Query, Context API
- **네비게이션**: React Navigation 6
- **지도**: react-native-maps
- **UI 컴포넌트**: react-native-vector-icons, @gorhom/bottom-sheet
- **HTTP 클라이언트**: Axios
- **로컬 저장소**: AsyncStorage


## 📱 주요 기능

### ✅ 인증 시스템
- 이메일/비밀번호 로그인
- 회원가입 (추후 구현)
- 자동 토큰 갱신

### 🗺 지도 및 검색
- 실시간 주차장 현황 지도
- 주차장 검색 (자동완성, 음성 검색)
- 혼잡도별 필터링 (여유/보통/혼잡/만차)
- 최근 검색 기록

### ⭐ 즐겨찾기
- 주차장 즐겨찾기 추가/제거
- 즐겨찾기 전용 지도 보기

### 🚗 내 주차 관리
- 주차 위치 저장
- 주차 시간 기록
- 학교 반경 벗어날 시 자동 초기화

### 📋 상세 정보
- 주차장 평면도 (실시간 자리 현황)
- 길찾기 연동
- 혼잡도 시각화

## 🏗 프로젝트 구조

```
DanParkApp/
├── android/                    # Android 네이티브 코드
├── src/
│   ├── components/             # 재사용 가능한 UI 컴포넌트
│   │   ├── common/            # 공통 컴포넌트
│   │   ├── map/               # 지도 관련 컴포넌트
│   │   └── panel/             # 패널 관련 컴포넌트
│   ├── contexts/              # React Context
│   ├── navigation/            # 네비게이션 구조
│   ├── screens/               # 화면 컴포넌트들
│   ├── services/              # API 서비스
│   ├── store/                 # 상태 관리 (Zustand)
│   ├── types/                 # TypeScript 타입 정의
│   └── utils/                 # 유틸리티 함수들
├── App.tsx                    # 루트 컴포넌트
├── index.js                   # 앱 진입점
└── package.json              # 의존성 관리


## 🐛 문제 해결

### Metro 캐시 문제
```bash
npx react-native start --reset-cache
cd android && ./gradlew clean && cd ..
```

### Android 빌드 문제
```bash
cd android
./gradlew clean
cd ..
npx react-native run-android
```

### M1 Mac 관련 이슈
- `android/gradle.properties`에 M1 최적화 설정이 포함되어 있습니다
- Rosetta 사용 시 성능이 저하될 수 있으니 네이티브 ARM64 환경 권장

## 📄 라이선스

이 프로젝트는 단국대학교 주차장 관리 시스템의 MVP 버전입니다.

## 🔄 추후 확장 예정 기능

- [ ] 회원가입 기능
- [ ] YOLO 기반 실시간 주차자리 인식
- [ ] 푸시 알림 시스템
- [ ] 관리자 페이지
- [ ] 다국어 지원
- [ ] 다크 모드
- [ ] 구글 로그인 연동