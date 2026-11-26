import { useState, type SubmitEvent } from 'react'
import {
  type BackendClient,
  BackendServiceError,
  type ResponseMessage,
} from '../services/BackendService'

type ChatMessage = ResponseMessage & {
  id: string
}

type ChatPanelProps = {
  backend: BackendClient
}

function ChatPanel({ backend }: ChatPanelProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()

    const content = input.trim()
    if (!content || isLoading) {
      return
    }

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content,
    }
    const conversation: ResponseMessage[] = [
      ...messages.map(({ role, content: messageContent }) => ({
        role,
        content: messageContent,
      })),
      { role: userMessage.role, content: userMessage.content },
    ]

    setMessages((currentMessages) => [...currentMessages, userMessage])
    setInput('')
    setErrorMessage('')
    setIsLoading(true)

    try {
      const responseText = await backend.createResponse(conversation)
      setMessages((currentMessages) => [
        ...currentMessages,
        {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: responseText,
        },
      ])
    } catch (error: unknown) {
      setMessages((currentMessages) =>
        currentMessages.filter((message) => message.id !== userMessage.id),
      )
      setInput(content)
      setErrorMessage(
        error instanceof BackendServiceError
          ? error.message
          : 'Could not reach the backend. Check that it is running and the URL is correct.',
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section
      aria-busy={isLoading}
      className="chat-panel"
      aria-label="Chat"
    >
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

      {isLoading && (
        <p className="chat-status" role="status">
          Assistant is thinking...
        </p>
      )}
      {errorMessage && (
        <p className="chat-error" role="alert">
          {errorMessage}
        </p>
      )}

      <form className="chat-form" onSubmit={handleSubmit}>
        <label htmlFor="chat-input">Your message</label>
        <div className="chat-form__controls">
          <textarea
            disabled={isLoading}
            id="chat-input"
            onChange={(event) => setInput(event.target.value)}
            placeholder="Schreibe deine Frage..."
            rows={4}
            value={input}
          />
          <button disabled={!input.trim() || isLoading} type="submit">
            {isLoading ? 'Sending...' : 'Send'}
          </button>
        </div>
      </form>
    </section>
  )
}

export default ChatPanel
