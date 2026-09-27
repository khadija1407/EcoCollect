export type WasteCategory =
  | 'Plastic'
  | 'Dry Waste'
  | 'Organic'
  | 'E-Waste'
  | 'Hazardous'
  | 'Other';

export type PickupStatus =
  | 'Pending'
  | 'Confirmed'
  | 'Scheduled'
  | 'Collected'
  | 'Cancelled';

export interface PickupRequest {
  id: number;
  request_id: string;
  waste_category: WasteCategory;
  pickup_address: string;
  pickup_date: string;
  pickup_time: string;
  notes?: string | null;
  status: PickupStatus;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface CreateRequestPayload {
  waste_category: string;
  pickup_address: string;
  pickup_date: string;
  pickup_time: string;
  notes?: string;
}

export interface RequestListResponse {
  items: PickupRequest[];
  total: number;
}

export interface Statistics {
  total_requests: number;
  pending: number;
  confirmed: number;
  scheduled: number;
  collected: number;
  cancelled: number;
}

export interface CategoryCount {
  category: string;
  count: number;
  percentage: number;
}

export interface CategoryStatisticsResponse {
  categories: CategoryCount[];
  total: number;
}

export interface TimePoint {
  date: string;
  count: number;
}

export interface AnalyticsData {
  total_requests: number;
  completed_collections: number;
  pending_requests: number;
  completion_rate: number;
  most_requested_category: string | null;
  requests_by_category: CategoryCount[];
  requests_over_time: TimePoint[];
}

export interface AdminAuth {
  token: string;
  username: string;
}
