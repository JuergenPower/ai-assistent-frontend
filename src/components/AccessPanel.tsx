import { useState, type SubmitEvent } from 'react'

type AccessPanelProps = {
  hasToken: boolean
  onAuthenticate: (token: string) => void
}

function AccessPanel({ hasToken, onAuthenticate }: AccessPanelProps) {
  const [tokenDraft, setTokenDraft] = useState('')
  const [isAccessOpen, setIsAccessOpen] = useState(!hasToken)

  function handleAuthenticate(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault() // prevent reload

    const newToken = tokenDraft.trim()
    if (!newToken) {
      return
    }

    onAuthenticate(newToken)
    setTokenDraft('')
    setIsAccessOpen(false)
  }

  return (
    <section className="access-panel" aria-labelledby="access-heading">
      <div className="access-header">
        <div>
          <h2 id="access-heading">Backend access</h2>
          <p className="access-status" role="status">
            {hasToken
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
          {isAccessOpen ? 'Close' : hasToken ? 'Change token' : 'Enter token'}
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
  )
}

export default AccessPanel
