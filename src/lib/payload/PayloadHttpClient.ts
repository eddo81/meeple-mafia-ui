import { PayloadHttpResponse } from "./PayloadHttpResponse";
import { PayloadCollection } from "./models/PayloadCollection";
import type { Json } from "./types/Json";

export class PayloadHttpClient {
  private _baseUrl: string;
  private _headers: Record<string, string>;
  private _apiKey: string | null = null;
  private _timeoutMs: number = 10_000; // 10 seconds

  constructor(options: { baseUrl: string; headers?: Record<string, string>; apiKey?: string | null; }) {
    this._baseUrl = options.baseUrl;
    this._headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...(options.headers ?? {}),
    };
    if (options.apiKey) {
      this._apiKey = options.apiKey;
      this._headers['Authorization'] = `Bearer ${this._apiKey}`;
    }
  }

  set headers(headers: Record<string, string>) {
    this._headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...headers,
    };

    if (this._apiKey) {
      this._headers['Authorization'] = `Bearer ${this._apiKey}`;
    }
  }

  set apiKey(apiKey: string | null) {
    this._apiKey = apiKey;
    if (apiKey) {
      this._headers['Authorization'] = `Bearer ${apiKey}`;
    } 
    else {
      delete this._headers['Authorization'];
    }
  }

  set timeoutMs(timeout: number) {
    this._timeoutMs = timeout;
  }

  private _appendQueryString(url: string, query?: string): string {
    return query ? url + query : url;
  }

  private async _fetch(url: string, options: RequestInit ): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this._timeoutMs);
    
    try {
      const response = await fetch(url, { ...options, signal: controller.signal });
      clearTimeout(timeoutId);
      return response;
    } 
    catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  private async _get<T>(url: string, fromJson: (json: Json) => T): Promise<PayloadHttpResponse<T>> {
    try {
      const response = await this._fetch(url, {
        method: 'GET',
        headers: this._headers,
      });

      return await PayloadHttpResponse.from(response, fromJson);
    } 
    catch (error: any) {
      // Map fetch errors to PayloadHttpResponse errors
      let message = `Unexpected error: ${error.message || error}`;
      let statusCode = 500;

      if (error.name === 'AbortError') {
        message = 'Request timed out';
        statusCode = 408;
      } 
      else if (error.message === 'Failed to fetch') {
        message = 'Failed to connect to Payload CMS';
        statusCode = 503;
      }

      // Create a fake Response for consistency
      return new PayloadHttpResponse<T>(new Response(message, { status: statusCode }), null);
    }
  }

  async find(slug: string, query?: string): Promise<PayloadHttpResponse<PayloadCollection>> {
    const url = this._appendQueryString(`${this._baseUrl}/api/${slug}`, query);
    return this._get(url, PayloadCollection.fromJson);
  }

  async findById(slug: string, id: string, query?: string): Promise<PayloadHttpResponse<PayloadCollection>> {
    const url = this._appendQueryString(`${this._baseUrl}/api/${slug}/${id}`, query);
    return this._get(url, PayloadCollection.fromJson);
  }

  /*async count(slug: string): Promise<PayloadHttpResponse<PayloadCollectionCount>> {
    const url = `${this._baseUrl}/api/${slug}/count`;
    return this._get(url, PayloadCollectionCount.fromJson);
  }*/
}