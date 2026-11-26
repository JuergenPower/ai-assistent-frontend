import { useState } from 'react'
import AccessPanel from './components/AccessPanel'
import ChatPanel from './components/ChatPanel'
import { BackendService, type BackendClient } from './services/BackendService'
import { BackendServiceMock } from './services/BackendServiceMock'
import './App.css'

const TOKEN_STORAGE_KEY = 'ai-investigation-assistant:backend-token'

function createBackendClient(token: string): BackendClient {
  const backendMode = import.meta.env.VITE_BACKEND_MODE ?? 'mock'

  if (backendMode === 'mock') {
    return new BackendServiceMock(token)
  }

  if (backendMode === 'real') {
    const baseUrl = (import.meta.env.VITE_API_BASE_URL ?? '').replace(
      /\/+$/,
      '',
    )
    return new BackendService(baseUrl, token)
  }

  throw new Error(`Unknown backend mode: ${backendMode}`)
}

function App() {
  const [backendService] = useState(
    () => {
      const token = sessionStorage.getItem(TOKEN_STORAGE_KEY) ?? ''
      return createBackendClient(token)
    },
  )
  const [hasToken, setHasToken] = useState(() => backendService.hasToken)

  function handleAuthenticate(newToken: string) {
    sessionStorage.setItem(TOKEN_STORAGE_KEY, newToken)
    backendService.setToken(newToken)
    setHasToken(backendService.hasToken)
  }

  return (
    <main className="chat-page">
      <div className="chat-layout">
        <header className="chat-header">
          <h1>AI Investigation Assistant</h1>
          <p>Ask a question to try the chat.</p>
        </header>

        <AccessPanel hasToken={hasToken} onAuthenticate={handleAuthenticate} />

        {hasToken ? (
          <ChatPanel backend={backendService} />
        ) : (
          <p className="chat-locked">
            The chat will be available after you authenticate.
          </p>
        )}
      </div>
    </main>
  )
}

export default App
