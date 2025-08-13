import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { setupDebugHelpers } from './shared/utils/debugUtils'

// 開発環境でのデバッグヘルパーを設定
setupDebugHelpers();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
