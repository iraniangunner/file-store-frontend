export interface User {
    id: number
    name: string
    email: string
  }
  
  export interface Product {
    id: number
    title: string
    description: string
    price: string
    file_path: string
  }
  
  export interface Order {
    id: number
    user_id: number
    product_id: number
    amount: string
    currency: string
    pay_currency: string
    status: string
    provider_invoice_url?: string
    download_url?: string
  }
  