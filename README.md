# PDF Viewer

![PDF Viewer](./assets/main.gif)

## 프로젝트 설명

해당 웹 애플리케이션은 총 2페이지로 구성되어 있습니다.

먼저 첫 번째 페이지(`http://localhost:3000`)에서는 사용자가 PDF 파일을 업로드할 수 있습니다. 해당 페이지에서 지원하는 기능은 다음과 같습니다.

- PDF 파일 Drag & Drop을 통한 업로드
  - `DataTransfer` 객체를 사용하여 Drag & Drop 기능을 구현
  - 하나의 PDF 파일만 업로드 가능하며 예외 상황 발생 시 `shadcn-ui` 라이브러리의 `sonner` 컴포넌트를 사용하여 에러 메시지 표시
    - 예외 상황: 파일이 아닌 경우, PDF 파일이 아닌 경우, 여러 개의 파일을 업로드한 경우 등
- PDF 파일 업로드 시 store에 저장
  - `locolStorage`는 용량 제한이 있어 `zustand` 라이브러리를 사용하여 store를 생성하여 사용
  - `pdfjs-dist` 라이브러리를 사용하여 PDF 파일을 읽고 page 단위로 가져와 store에 저장
    - `pdfjs-dist` 라이브러리에서 사용되는 `Promise.withResolver`는 Node.js 안정화 버전에서는 지원되지 않고 `SWC`에서도 polyfill이 되지 않아 브라우저 환경에서만 가져와 사용하도록 `Dynamic Import`를 사용
    - 한글 폰트 지원을 위해 `pdfjs-dist` 라이브러리의 `CMap` 사용

두 번째 페이지(`/viewer`)에서는 사용자가 업로드한 PDF 파일을 보여주는 페이지입니다. 해당 페이지에서 지원하는 기능은 다음과 같습니다.

- PDF 페이지 보여주기
  - store에 PDF 정보가 없는 경우, `/` 페이지로 리다이렉트
- PDF 페이지 이동
  - 왼쪽/오른쪽 버튼을 통해 이전/다음 페이지로 이동
  - 현재 보고 있는 페이지 번호와 전체 페이지 수를 표시
- PDF Preview tab
  - PDF 파일의 전체 페이지를 낮은 해상도로 보여주기
  - 현재 보고 있는 부분은 초록색 테두리로 표시
    - 페이지 이동 시 해당 부분이 보이도록 스크롤

### 프로젝트 구조

해당 프로젝트는 `Next.js` 프레임워크를 사용하여 구성되어 있습니다. 주요 파일 및 폴더 구조는 다음과 같습니다.

```bash
pdf-codit
├── src
│   ├── app
│   │   ├── viewer
│   │   │   ├── page.tsx #  /viewer 페이지
│   │   ├── page.tsx # home(/) 페이지
│   │   ├── layout.tsx # global layout
│   │   ├── global.css # global css
│   ├── components
│   │   ├── ui # Shadcn UI 컴포넌트 폴더
│   │   ├── PDFCanvas.tsx # PDF 페이지를 보여주는 컴포넌트(현재 페이지와 Preview를 위한 컴포넌트)
│   ├── lib
│   │   ├── store.ts # zustand store(PDF의 페이지 프록시 객체와 현재 페이지 번호를 저장)
│   │   ├── utils.ts # Shadcn UI에서 사용되는 유틸리티 함수
│   ├── Dockerfile # Production 환경을 위한 Dockerfile
│   ├── components.json # Shadcn UI 설정 파일
```

특정 페이지에서만 사용되는 컴포넌트 및 함수는 해당 `page.tsx` 파일 내부에 정의하여 사용하였습니다.

### 프로젝트 기술 스택

명시되어 있던 `node.js`와 `pdfjs-dist`를 기본적으로 사용하였고 추가로 사용한 프레임워크 및 라이브러리는 다음과 같습니다.

- FE Framework: Next.js
- Utility CSS: Tailwind CSS
- State Management: zustand
- Component Library: Shadcn UI
- Type-checking: TypeScript
- Containerization: Docker

### 프로젝트 설치 및 실행

먼저 해당 프로젝트를 clone 합니다.

#### Production 환경

`Docker`를 사용하여 production 환경에서 실행하기 위해서는 다음과 같은 명령어를 사용합니다.

```bash
docker build -t pdf-viewer .
docker run -p 3000:3000 pdf-viewer
```

이후 `http://localhost:3000`으로 접속하여 확인할 수 있습니다.

#### Development 환경

Development 환경은 따로 `Docker`를 사용하지 않았으며 개발 시 Node.js `v20.14.0`와 `pnpm`을 사용하였습니다. 해당 환경에서 실행하기 위해서는 다음과 같은 명령어를 사용합니다.

```bash
pnpm install
pnpm dev
```

이후 `http://localhost:3000`으로 접속하여 확인할 수 있습니다.
