const API_BASE_URL = import.meta.env.VITE_API_URL;

if (!API_BASE_URL) {
  throw new Error('VITE_API_URL is not defined');
}

type ApiFetchOptions = RequestInit & { skipJSONContextType?: boolean };

export function apiFetch(path: string, options: ApiFetchOptions = {}) {
  const { skipJSONContextType, headers, ...rest } = options;

  const finalHeaders: HeadersInit = {
    ...(skipJSONContextType ? {} : { 'Content-Type': 'application/json' }),
    ...(headers ?? {}),
  };
  return fetch(`${API_BASE_URL}${path}`, {
    ...rest,
    headers: finalHeaders,
  });
}
