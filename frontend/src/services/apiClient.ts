// ============================================================
// What is this file?
//   Core HTTP Client configuration.
//   It sets up the base URL and provides the generic 'request'
//   function that automatically attaches your authentication
//   token to backend requests.
// ============================================================

const API_URL = "http://localhost:5000/api";

export async function request<T>(
  endpoint: string,
  options: { method?: string; body?: object; token?: string } = {}
): Promise<T> {
  const headers: Record<string, string> = {};

  if (options.body)  headers["Content-Type"]  = "application/json";
  if (options.token) headers["Authorization"] = `Bearer ${options.token}`;

  const res = await fetch(`${API_URL}${endpoint}`, {
    method: options.method ?? "GET",
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  const json = await res.json();
  if (!res.ok) throw new Error(json.message ?? "Something went wrong");
  return json as T;
}
