export interface Address {
  id: string;
  user_id: string;
  label: string;
  recipient: string;
  phone: string;
  full_address: string;
  created_at: string;
  updated_at: string;
}

export interface CreateAddressPayload {
  label: string;
  recipient: string;
  phone: string;
  full_address: string;
}

export interface UpdateAddressPayload {
  label?: string;
  recipient?: string;
  phone?: string;
  full_address?: string;
}
