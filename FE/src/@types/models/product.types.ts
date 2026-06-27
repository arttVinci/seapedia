export interface Product {
  id: number;
  seller_id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  image_url: string;
  created_at?: string;
  updated_at?: string;
}

export interface SellerInfo {
  id: number;
  store_name: string;
  rating: number;
}

export interface ProductDetail extends Product {
  seller: SellerInfo;
}
