import type { Json } from "./types/Json";

export class PayloadHttpResponse<T> {
  response: Response;
  data: T | null;

  constructor(response: Response, data: T | null) {
    this.response = response;
    this.data = data;
  }

  static async from<T>(response: Response, fromJson: (json: Json) => T): Promise<PayloadHttpResponse<T>> {
    let data: T | null = null;
    if (response.ok) {
      try {
        const json = await response.json();
        data = fromJson(json);
      } 
      catch {
        // JSON parsing failed, data remains null
      }
    }
    return new PayloadHttpResponse(response, data);
  }

  get statusCode() {
    return this.response.status;
  }

  get body() {
    return this.response.body;
  }

  get headers() {
    return this.response.headers;
  }

  get isSuccess() {
    return this.statusCode >= 200 && this.statusCode < 300;
  }

  get isError() {
    return this.statusCode >= 400;
  }

  get isNotFound() {
    return this.statusCode === 404;
  }

  get isUnauthorized() {
    return this.statusCode === 401 || this.statusCode === 403;
  }
}