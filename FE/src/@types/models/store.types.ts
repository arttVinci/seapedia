export interface Store {
  id: string;
  user_id: string;
  name: string;
  description: string;
  created_at?: number;
  updated_at?: number;
}

export interface CreateStorePayload {
  name: string;
  description?: string;
}

export interface UpdateStorePayload {
  name?: string;
  description?: string;
}
