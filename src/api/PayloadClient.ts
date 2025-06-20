import { PayloadHttpClient } from '../lib/payload/PayloadHttpClient';

export const payloadClient = new PayloadHttpClient({
  baseUrl: import.meta.env.PUBLIC_PAYLOAD_SERVER_URL,
  apiKey: import.meta.env.PUBLIC_PAYLOAD_API_KEY,
});