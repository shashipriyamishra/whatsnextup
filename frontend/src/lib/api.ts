// frontend/src/lib/api.ts

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8000';

export async function apiRequest(
  endpoint: string,
  options: RequestInit = {},
  authToken?: string
) {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || 'API request failed');
  }

  return response.json();
}

export async function getMemories(authToken: string) {
  return apiRequest('/api/memories', { method: 'GET' }, authToken);
}

export async function getPlans(authToken: string) {
  return apiRequest('/api/plans', { method: 'GET' }, authToken);
}

export async function createPlan(goal: string, authToken: string) {
  return apiRequest(
    '/api/plans',
    {
      method: 'POST',
      body: JSON.stringify({ goal }),
    },
    authToken
  );
}

export async function getReflections(authToken: string) {
  return apiRequest('/api/reflections', { method: 'GET' }, authToken);
}

export async function createReflection(content: string, mood: string, authToken: string) {
  return apiRequest(
    '/api/reflections',
    {
      method: 'POST',
      body: JSON.stringify({ content, mood }),
    },
    authToken
  );
}
