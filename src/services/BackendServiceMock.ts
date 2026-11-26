import type { BackendClient } from './BackendService'

const MOCK_RESPONSE =
  'This is a mock response. The frontend is not connected to the LLM yet.'

export class BackendServiceMock implements BackendClient {
  private token: string

  constructor(token: string) {
    this.token = token
  }

  setToken(token: string): void {
    this.token = token
  }

  get hasToken(): boolean {
    return this.token.length > 0
  }

  async createResponse(): Promise<string> {
    return MOCK_RESPONSE
  }
}
