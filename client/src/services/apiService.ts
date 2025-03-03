const API_URL = import.meta.env.API_URL || "http://localhost:5000/api";
const DEFAULT_TIMEOUT = 10000;
const MAX_RETRIES = 3;

export async function apiCall<TResponse>(
  endpoint: string,
  method: string = "GET",
  retries: number = MAX_RETRIES
): Promise<TResponse> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT);

  const options: RequestInit = {
    method,
    signal: controller.signal,
  };

  try {
    const response = await fetch(`${API_URL}/${endpoint}`, options);
    clearTimeout(timeout);

    if (!response.ok) {
      if (response.status >= 500 && retries > 0) {
        console.warn(
          `Retrying ${method} ${endpoint} (${MAX_RETRIES - retries + 1})`
        );
        return apiCall<TResponse>(endpoint, method, retries - 1);
      }
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new Error(`Request timeout: ${endpoint}`);
    }
    console.error(`API error on ${method} ${endpoint}:`, error);
    throw error;
  }
}

export async function get<TResponse>(endpoint: string): Promise<TResponse> {
  return await apiCall<TResponse>(endpoint);
}
