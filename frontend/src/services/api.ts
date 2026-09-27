import {
  PickupRequest,
  CreateRequestPayload,
  RequestListResponse,
  Statistics,
  CategoryStatisticsResponse,
  AnalyticsData,
  AdminAuth
} from '../types';

const API_BASE = '/api';

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let errorMsg = 'An error occurred while processing your request.';
    try {
      const errorData = await res.json();
      if (errorData && errorData.detail) {
        errorMsg = errorData.detail;
      }
    } catch {
      // Fallback
    }
    throw new Error(errorMsg);
  }
  return res.json() as Promise<T>;
}

export const requestsAPI = {
  async create(payload: CreateRequestPayload): Promise<PickupRequest> {
    const res = await fetch(`${API_BASE}/requests`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return handleResponse<PickupRequest>(res);
  },

  async getAll(params?: {
    search?: string;
    category?: string;
    status?: string;
    date?: string;
    skip?: number;
    limit?: number;
  }): Promise<RequestListResponse> {
    const query = new URLSearchParams();
    if (params?.search) query.append('search', params.search);
    if (params?.category && params.category !== 'All') query.append('category', params.category);
    if (params?.status && params.status !== 'All') query.append('status', params.status);
    if (params?.date) query.append('date', params.date);
    if (params?.skip !== undefined) query.append('skip', String(params.skip));
    if (params?.limit !== undefined) query.append('limit', String(params.limit));

    const url = `${API_BASE}/requests${query.toString() ? `?${query.toString()}` : ''}`;
    const res = await fetch(url);
    return handleResponse<RequestListResponse>(res);
  },

  async getById(requestId: string): Promise<PickupRequest> {
    const res = await fetch(`${API_BASE}/requests/${encodeURIComponent(requestId)}`);
    return handleResponse<PickupRequest>(res);
  },

  async updateStatus(requestId: string, status: string): Promise<PickupRequest> {
    const res = await fetch(`${API_BASE}/requests/${encodeURIComponent(requestId)}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    return handleResponse<PickupRequest>(res);
  },
};

export const adminAPI = {
  async login(username: string, password: string): Promise<AdminAuth> {
    const res = await fetch(`${API_BASE}/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    return handleResponse<AdminAuth>(res);
  },

  async getStatistics(): Promise<Statistics> {
    const res = await fetch(`${API_BASE}/admin/statistics`);
    return handleResponse<Statistics>(res);
  },

  async getCategoryStatistics(): Promise<CategoryStatisticsResponse> {
    const res = await fetch(`${API_BASE}/admin/category-statistics`);
    return handleResponse<CategoryStatisticsResponse>(res);
  },

  async getHistory(params?: {
    search?: string;
    category?: string;
    status?: string;
    date?: string;
  }): Promise<RequestListResponse> {
    const query = new URLSearchParams();
    if (params?.search) query.append('search', params.search);
    if (params?.category && params.category !== 'All') query.append('category', params.category);
    if (params?.status && params.status !== 'All') query.append('status', params.status);
    if (params?.date) query.append('date', params.date);

    const url = `${API_BASE}/admin/history${query.toString() ? `?${query.toString()}` : ''}`;
    const res = await fetch(url);
    return handleResponse<RequestListResponse>(res);
  },

  async getAnalytics(): Promise<AnalyticsData> {
    const res = await fetch(`${API_BASE}/admin/analytics`);
    return handleResponse<AnalyticsData>(res);
  },
};
