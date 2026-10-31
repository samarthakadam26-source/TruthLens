import type { AuthUser, DetectionRecord, PredictionResponse } from '@/types';

const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL as string | undefined
)?.replace(/\/+$/, '');

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  if (!API_BASE_URL) {
    throw new Error('Backend URL is missing. Check your .env file.');
  }

  let response: Response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      credentials: 'include',
    });
  } catch {
    throw new Error(
      'Cannot reach the backend server. Make sure Flask is running.'
    );
  }

  let data: unknown;

  try {
    data = await response.json();
  } catch {
    throw new Error(`Invalid server response (${response.status}).`);
  }

  if (!response.ok) {
    const errorData = data as { error?: string; message?: string };
    throw new Error(
      errorData.error ||
        errorData.message ||
        `Request failed (${response.status}).`
    );
  }

  return data as T;
}

export async function register(
  email: string,
  password: string,
  fullName: string
): Promise<AuthUser> {
  return request<AuthUser>('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ email, password, fullName }),
  });
}

export async function login(
  email: string,
  password: string
): Promise<AuthUser> {
  return request<AuthUser>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export async function logout(): Promise<void> {
  await request<{ message: string }>('/auth/logout', {
    method: 'POST',
  });
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  try {
    return await request<AuthUser>('/auth/me');
  } catch {
    return null;
  }
}

export async function updateProfile(
  fullName: string
): Promise<AuthUser> {
  return request<AuthUser>('/auth/me', {
    method: 'PUT',
    body: JSON.stringify({ fullName }),
  });
}

export async function predictNews(
  text: string
): Promise<PredictionResponse> {
  const data = await request<{
    prediction: string;
    confidence?: number | null;
    analysisId?: string;
  }>('/predict', {
    method: 'POST',
    body: JSON.stringify({ text }),
  });

  if (data.prediction !== 'REAL' && data.prediction !== 'FAKE') {
    throw new Error('The model returned an unknown prediction label.');
  }

  return {
    prediction: data.prediction,
    confidence:
      typeof data.confidence === 'number' ? data.confidence : null,
    analysisId: data.analysisId,
  };
}

export interface EvidenceSource {
  title: string;
  url: string;
  content: string;
  score: number | null;
  published_date: string | null;
}

export interface EvidenceSearchResponse {
  claim: string;
  status: 'EVIDENCE_RETRIEVED';
  sources: EvidenceSource[];
  message: string;
}

export async function searchEvidence(
  claim: string
): Promise<EvidenceSearchResponse> {
  return request<EvidenceSearchResponse>('/evidence-search', {
    method: 'POST',
    body: JSON.stringify({ claim }),
  });
}

export async function fetchHistory(): Promise<DetectionRecord[]> {
  return request<DetectionRecord[]>('/history');
}

export async function fetchDetectionById(
  id: string
): Promise<DetectionRecord | null> {
  try {
    return await request<DetectionRecord>(`/history/${id}`);
  } catch (error) {
    if (error instanceof Error && error.message.includes('404')) {
      return null;
    }
    throw error;
  }
}

export async function deleteDetection(id: string): Promise<void> {
  await request<{ message: string }>(`/history/${id}`, {
    method: 'DELETE',
  });
}

export async function clearAllDetections(): Promise<void> {
  await request<{ message: string }>('/history', {
    method: 'DELETE',
  });
}

export interface DashboardStats {
  total: number;
  real: number;
  fake: number;
  recent: DetectionRecord[];
}

export async function getDashboardStats(): Promise<DashboardStats> {
  return request<DashboardStats>('/dashboard/stats');
}

export async function checkHealth(): Promise<boolean> {
  try {
    await request<{ status: string }>('/health');
    return true;
  } catch {
    return false;
  }
}