const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export async function apiFetch(path: string, options: any = {}) {
  const url = BASE + path;

  const headers: any = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  if (options.token) {
    headers['Authorization'] = `Bearer ${options.token}`;
  }

  const res = await fetch(url, {
    method: options.method || 'GET',
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(error || 'Erro na requisição');
  }

  return res.json();
}
