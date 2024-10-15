import React from 'react';
import { createRoot } from 'react-dom/client'; // createRoot 가져오기
import App from './App';

const container = document.getElementById('root'); // root 요소 가져오기
const root = createRoot(container); // createRoot 사용
root.render(<App />); // App 컴포넌트 렌더링
