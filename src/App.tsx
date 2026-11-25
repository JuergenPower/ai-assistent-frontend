import { useState, type SubmitEvent } from 'react'
import './App.css'

type MessageRole = 'user' | 'assistant'

type ChatMessage = {
  id: string
  role: MessageRole
  content: string
}

const MOCK_ASSISTANT_RESPONSE =
  'Das ist eine simulierte Antwort. Im nächsten Schritt verbinden wir den Chat mit dem Backend.'

const TOKEN_STORAGE_KEY = 'ai-investigation-assistant:backend-token'

function App() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [token, setToken] = useState(
    () => sessionStorage.getItem(TOKEN_STORAGE_KEY) ?? '',
  )
  const [tokenDraft, setTokenDraft] = useState(token)
  const [isAccessOpen, setIsAccessOpen] = useState(!token)

  function handleAuthenticate(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()

    const newToken = tokenDraft.trim()
    if (!newToken) {
      return
    }

    sessionStorage.setItem(TOKEN_STORAGE_KEY, newToken)
    setToken(newToken)
    setTokenDraft('')
    setIsAccessOpen(false)
  }

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault() // prevent reload on submit

    const content = input.trim()
    if (!content) {
      return
    }

    const newMessages: ChatMessage[] = [
      { id: crypto.randomUUID(), role: 'user', content },
      {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: MOCK_ASSISTANT_RESPONSE,
      },
    ]

    setMessages((currentMessages) => [...currentMessages, ...newMessages])
    setInput('')
  }

  return (
    <main className="chat-page">
      <div className="chat-layout">
        <header className="chat-header">
          <h1>AI Investigation Assistant</h1>
          <p>Ask a question to try the chat.</p>
        </header>

        <section className="access-panel" aria-labelledby="access-heading">
          <div className="access-header">
            <div>
              <h2 id="access-heading">Backend access</h2>
              <p className="access-status" role="status">
                {token
                  ? 'Token stored for this tab session.'
                  : 'Enter a token to unlock the chat.'}
              </p>
            </div>
            <button
              aria-controls="access-token-form"
              aria-expanded={isAccessOpen}
              className="access-toggle"
              onClick={() => setIsAccessOpen((isOpen) => !isOpen)}
              type="button"
            >
              {isAccessOpen ? 'Close' : token ? 'Change token' : 'Enter token'}
            </button>
          </div>
          <div hidden={!isAccessOpen} id="access-token-form">
            <form className="token-form" onSubmit={handleAuthenticate}>
              <label htmlFor="backend-token">Backend token</label>
              <div className="token-form__controls">
                <input
                  autoComplete="off"
                  id="backend-token"
                  onChange={(event) => setTokenDraft(event.target.value)}
                  type="password"
                  value={tokenDraft}
                />
                <button disabled={!tokenDraft.trim()} type="submit">
                  Authenticate
                </button>
              </div>
            </form>
          </div>
        </section>

        {token ? (
          <section className="chat-panel" aria-label="Chat">
            {messages.length === 0 ? (
              <p className="chat-empty">No messages yet.</p>
            ) : (
              <ol className="chat-messages" aria-live="polite">
                {messages.map((message) => (
                  <li
                    className={`chat-message chat-message--${message.role}`}
                    key={message.id}
                  >
                    <span className="chat-message__author">
                      {message.role === 'user' ? 'You' : 'Assistant'}
                    </span>
                    <p className="chat-message__content">{message.content}</p>
                  </li>
                ))}
              </ol>
            )}

            <form className="chat-form" onSubmit={handleSubmit}>
              <label htmlFor="chat-input">Your message</label>
              <div className="chat-form__controls">
                <textarea
                  id="chat-input"
                  onChange={(event) => setInput(event.target.value)}
                  placeholder="Schreibe deine Frage..."
                  rows={4}
                  value={input}
                />
                <button disabled={!input.trim()} type="submit">
                  Send
                </button>
              </div>
            </form>
          </section>
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
