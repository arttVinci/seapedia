export interface Address {
  id: string;
  user_id: string;
  title: string;
  recipient_name: string;
  phone_number: string;
  full_address: string;
  is_primary: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateAddressPayload {
  title: string;
  recipient_name: string;
  phone_number: string;
  full_address: string;
  is_primary?: boolean;
}

export interface UpdateAddressPayload {
  title?: string;
  recipient_name?: string;
  phone_number?: string;
  full_address?: string;
  is_primary?: boolean;
}
