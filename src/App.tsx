import { useState } from 'react'
import AccessPanel from './components/AccessPanel'
import ChatPanel from './components/ChatPanel'
import './App.css'

const TOKEN_STORAGE_KEY = 'ai-investigation-assistant:backend-token'

function App() {
  const [token, setToken] = useState(
    () => sessionStorage.getItem(TOKEN_STORAGE_KEY) ?? '',
  )

  function handleAuthenticate(newToken: string) {
    sessionStorage.setItem(TOKEN_STORAGE_KEY, newToken)
    setToken(newToken)
  }

  return (
    <main className="chat-page">
      <div className="chat-layout">
        <header className="chat-header">
          <h1>AI Investigation Assistant</h1>
          <p>Ask a question to try the chat.</p>
        </header>

        <AccessPanel token={token} onAuthenticate={handleAuthenticate} />

        {token ? (
          <ChatPanel />
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
