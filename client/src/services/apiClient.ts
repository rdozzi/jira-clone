const API_BASE_URL = import.meta.env.VITE_API_URL;

if (!API_BASE_URL) {
  throw new Error('VITE_API_URL is not defined');
}

type ApiFetchOptions = RequestInit & { skipJSONContextType?: boolean };

// export function apiFetch(path: string, options: ApiFetchOptions = {}) {
//   const { skipJSONContextType, headers, ...rest } = options;

//   const finalHeaders: HeadersInit = {
//     ...(skipJSONContextType ? {} : { 'Content-Type': 'application/json' }),
//     ...(headers ?? {}),
//   };
//   return fetch(`${API_BASE_URL}${path}`, {
//     ...rest,
//     headers: finalHeaders,
//   });
// }

export function apiFetch(path: string, options: ApiFetchOptions) {
  const { skipJSONContextType, headers, ...rest } = options;

  const finalHeaders: HeadersInit = {
    ...(skipJSONContextType ? {} : { 'Content-Type': 'application/json' }),
    ...(headers ?? {}),
  };

  return fetch(`${API_BASE_URL}${path}`, {
    ...rest,
    headers: finalHeaders,
  }).then(async (res) => {
    const clone = res.clone();
    const rawText = await clone.text();

    console.log('[apiFetch DIAGNOSTIC]', {
      fullUrl: `${API_BASE_URL}${path}`,
      status: res.status,
      ok: res.ok,
      contentType: res.headers.get('content-type'),
      rawBody: rawText,
    });

    return res; // IMPORTANT: preserve original behavior
  });
}
