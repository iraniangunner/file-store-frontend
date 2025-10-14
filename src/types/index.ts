export interface User {
    id: number
    name: string
    email: string
    role:string
  }
  
  export interface Product {
    id: number
    title: string
    slug:string
    description: string
    price: string
    file_path: string
    total_sales:string
    category_id:number
  }
  

 export interface Order {
  id: number;
  amount: string;
  currency: string;
  pay_currency: string;
  status: string;
  created_at: string;
  product: Product;
  // provider_invoice_url?: string
  download_url: string | null;
};
  