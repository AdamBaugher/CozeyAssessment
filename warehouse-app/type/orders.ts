
export interface Product {
    id: number;
    name: string;
    price: number;
      quantity: number;
  }
  
  export interface ProductDetails {
    id: number;
    name: string;
    price: number;
    color: string;
    weight: string;
  }
  
  export interface LineItem {
    name: string;
    products: Product[];
    quantity: number;
  }
  
  export interface Order {
    orderDate: string;
    lineItems: LineItem[];
      customerName: string;
    shippingAddress: string;
  }