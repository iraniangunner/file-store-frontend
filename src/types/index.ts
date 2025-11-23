export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

export interface Product {
  id: number;
  title: string;
  slug: string;
  description: string;
  price: string;
  file_path: string;
  total_sales: string;
  categories: String[];
  image_url:string;
  image_path:string;
}

export interface Contact {
  id: number;
  name: string;
  message: string;
}

export interface Order {
  id: number;
  amount: string;
  currency: string;
  pay_currency: string;
  status: string;
  created_at: string;
  product: Product;
  download_used: number;
  // provider_invoice_url?: string
  download_url: string | null;
}

export interface Comment {
  id: number
  user_id: number
  content: string
  reply: string | null
  created_at: string
  user: {
    id: number
    name: string
  }
}



export type CategoryApi = {
  id: number;
  name: string;
  parent_id?: number | null;
  children_recursive?: CategoryApi[];
};

export type ProductsResponse = {
  data: Product[];
  current_page: number;
  last_page: number;
};