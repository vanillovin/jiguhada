# 지구하다

React.js와 React Query로 구현한 환경 챌린지 & 커뮤니티 웹서비스

<br>

## 🌍 소개

환경보호를 일상 속에서 자연스럽게 실천할 수 있는 다양한 챌린지를 참여하고 유용한 정보를 나누며 환경을 지키기 위한 첫걸음을
“지구하다”와 함께 시작해 보세요. 당신의 작은 관심과 노력이 모여 지구를 아름답게 만들 수 있습니다 🌿✨

<br>

> [배포 사이트 주소](https://mock-jiguhada.vercel.app/)<br>
> 백엔드 서버가 중단되어 테스트용으로 임시 데이터를 직접 구현해 배포하였습니다.<br>
> 아이디: test / 비밀번호: a12345

<br>

## 🚀 실행 방법

### 프로젝트 클론 및 의존성 설치

#### 1. 프로젝트 클론

```bash
git clone https://github.com/your_username_/Project-Name.git
cd jiguhada
```

#### 2. 의존성 패키지 설치

```bash
npm install
# 또는
yarn install
```

#### 3. 애플리케이션 실행

```bash
npm run dev
# 또는
yarn dev
```

웹 브라우저에서 [http://localhost:5173](http://localhost:5173/)로 접속하여 서비스를 확인하세요.

<br>

## 💻 기술 스택

<img alt="react" src="https://img.shields.io/badge/react-61DAFB?style=for-the-badge&logo=react&logoColor=black"> 
<img alt="react query" src="https://img.shields.io/badge/react query-FF4154?style=for-the-badge&logo=react query&logoColor=black">
<img alt="recoil" src="https://img.shields.io/badge/recoil-3578E5?style=for-the-badge&logo=recoil&logoColor=black"> 
<img alt="typescript" src="https://img.shields.io/badge/typescript-3178C6?style=for-the-badge&logo=typescript&logoColor=black"> 
<img alt="tailwind css" src="https://img.shields.io/badge/tailwind css-06B6D4?style=for-the-badge&logo=tailwind css&logoColor=black">

<br>

## 🌟 주요 기능

### 메인

<img width="600" src="https://github.com/vanillovin/jiguhada/assets/70941696/5ed01a08-0a06-4562-b14d-a1f2832225f4">

### 챌린지

- 모든 챌린지 목록을 확인할 수 있는 페이지입니다. 검색, 태그, 카테고리, 정렬 기능을 사용해 손쉽게 원하는 챌린지를 찾아볼 수 있습니다.

<img width="600" src="https://github.com/vanillovin/jiguhada/assets/70941696/f7bcedca-5764-4988-939e-56e953749f45">

### 게시판

- 검색과 카테고리, 정렬 기능을 사용해 손쉽게 원하는 게시글을 찾아볼 수 있습니다.
- 게시글과 댓글을 작성, 수정, 삭제하고 좋아요를 누를 수 있습니다.
- 댓글과 좋아요 목록은 `intersection observer`와 react query의 `infiniteQuery`를 활용하여 무한 스크롤로 구현했습니다.

![chrome-capture-2024-0-17 (1)](https://github.com/vanillovin/jiguhada/assets/70941696/518c8269-f71d-45d4-993a-22a93aefd616)

![chrome-capture-2024-0-17 (2)](https://github.com/vanillovin/jiguhada/assets/70941696/2a4648f4-c2cf-4b44-86f9-287a838b7f9c)

<img width="600" src="https://github.com/vanillovin/jiguhada/assets/70941696/86a770a7-e2a2-42d5-b3dd-0a08fc4bb1ce">

### 회원정보

- 작성한 게시글과 댓글을 확인하고, 회원 정보를 수정할 수 있습니다.

![chrome-capture-2024-0-17](https://github.com/vanillovin/jiguhada/assets/70941696/364ff2d9-2255-4d60-b20d-b9548fb6f0f6)

### 로그인 & 회원가입

- 아이디, 닉네임, 비밀번호, 프로필 사진 등을 입력하여 회원가입할 수 있습니다.
- 아이디와 닉네임 중복 확인, 비밀번호 일치 여부와 형식 검사, 프로필 사진 업로드 등 다양한 기능을 구현하였습니다.

<img width="600" src="https://github.com/vanillovin/jiguhada/assets/70941696/301d46e6-881b-40d2-b522-320ffd59c28c">

<br>

## 🌲 폴더 구조

```
📦src
 ┣ 📂components
 ┃ ┣ 📂board
 ┃ ┃ ┗ 📜BoardItem.tsx
 ┃ ┣ 📂challenge
 ┃ ┃ ┣ 📜ChallengeAuthCommentForm.tsx
 ┃ ┃ ┣ 📜ChallengeAuthCommentList.tsx
 ┃ ┃ ┣ 📜ChallengeDdayCount.tsx
 ┃ ┃ ┗ 📜ChallengeItem.tsx
 ┃ ┣ 📂home
 ┃ ┃ ┗ 📜HomeBoardList.tsx
 ┃ ┣ 📂post
 ┃ ┃ ┣ 📜CommentForm.tsx
 ┃ ┃ ┣ 📜CommentItem.tsx
 ┃ ┃ ┗ 📜CommentList.tsx
 ┃ ┣ 📂register
 ┃ ┃ ┣ 📜SignIn.tsx
 ┃ ┃ ┗ 📜SignUp.tsx
 ┃ ┣ 📜CalendarUI.tsx
 ┃ ┣ 📜Editor.tsx
 ┃ ┣ 📜Error.tsx
 ┃ ┣ 📜Loading.tsx
 ┃ ┣ 📜Message.tsx
 ┃ ┣ 📜NavigationBar.tsx
 ┃ ┗ 📜PageList.tsx
 ┣ 📂hooks
 ┃ ┣ 📂queries
 ┃ ┃ ┣ 📜challenge.ts
 ┃ ┃ ┗ 📜post.ts
 ┃ ┣ 📜useInput.ts
 ┃ ┗ 📜useToggle.ts
 ┣ 📂modules
 ┃ ┣ 📂auth
 ┃ ┃ ┗ 📜api.ts
 ┃ ┣ 📂board
 ┃ ┃ ┣ 📜api.ts
 ┃ ┃ ┗ 📜type.ts
 ┃ ┣ 📂challenge
 ┃ ┃ ┣ 📜api.ts
 ┃ ┃ ┣ 📜data.ts
 ┃ ┃ ┣ 📜type.ts
 ┃ ┃ ┗ 📜utils.ts
 ┃ ┗ 📂user
 ┃ ┃ ┣ 📜api.ts
 ┃ ┃ ┣ 📜atom.ts
 ┃ ┃ ┗ 📜type.ts
 ┣ 📂pages
 ┃ ┣ 📂board
 ┃ ┃ ┣ 📜BoardPage.tsx
 ┃ ┃ ┣ 📜EditPostPage.tsx
 ┃ ┃ ┣ 📜LikeList.tsx
 ┃ ┃ ┣ 📜PostPage.tsx
 ┃ ┃ ┗ 📜WritePostPage.tsx
 ┃ ┣ 📂challenge
 ┃ ┃ ┣ 📜ChallengeDetailPage.tsx
 ┃ ┃ ┣ 📜ChallengePage.tsx
 ┃ ┃ ┗ 📜CreateChallengePage.tsx
 ┃ ┣ 📂home
 ┃ ┃ ┗ 📜HomePage.tsx
 ┃ ┣ 📂register
 ┃ ┃ ┗ 📜RegisterPage.tsx
 ┃ ┣ 📂user
 ┃ ┃ ┣ 📜CreatedComments.tsx
 ┃ ┃ ┣ 📜CreatedPosts.tsx
 ┃ ┃ ┣ 📜Settings.tsx
 ┃ ┃ ┗ 📜UserInfoPage.tsx
 ┃ ┗ 📜NotFoundPage.tsx
 ┣ 📂utils
 ┃ ┣ 📜dateUtils.ts
 ┃ ┣ 📜tokenUtils.ts
 ┃ ┗ 📜urlUtils.ts
 ┣ 📜App.tsx
 ┣ 📜index.css
 ┣ 📜main.tsx
 ┗ 📜vite-env.d.ts
```
