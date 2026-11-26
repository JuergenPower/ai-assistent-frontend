export type ResponseMessage = {
  role: 'user' | 'assistant'
  content: string
}

export interface BackendClient {
  setToken(token: string): void
  readonly hasToken: boolean
  createResponse(messages: ResponseMessage[]): Promise<string>
}

type ResponsesRequest = {
  messages: ResponseMessage[]
}

type ResponsesResult = {
  text: string
}

export class BackendServiceError extends Error {
  public readonly status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = 'BackendServiceError'
    this.status = status
  }
}

function isResponsesResult(value: unknown): value is ResponsesResult {
  return (
    typeof value === 'object' &&
    value !== null &&
    'text' in value &&
    typeof value.text === 'string'
  )
}

export class BackendService implements BackendClient {
  private readonly baseUrl: string
  private token: string

  constructor(baseUrl: string, token: string) {
    this.baseUrl = baseUrl
    this.token = token
  }

  setToken(token: string): void {
    this.token = token
  }

  get hasToken(): boolean {
    return this.token.length > 0
  }

  async createResponse(messages: ResponseMessage[]): Promise<string> {
    const requestBody: ResponsesRequest = { messages }
    const response = await fetch(`${this.baseUrl}/api/responses`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    })

    if (!response.ok) {
      throw new BackendServiceError(
        `The backend returned HTTP ${response.status}.`,
        response.status,
      )
    }

    let result: unknown
    try {
      result = await response.json()
    } catch {
      throw new BackendServiceError(
        'The backend returned invalid JSON.',
        response.status,
      )
    }

    if (!isResponsesResult(result)) {
      throw new BackendServiceError(
        'The backend response did not contain a text field.',
        response.status,
      )
    }

    return result.text
  }
}
