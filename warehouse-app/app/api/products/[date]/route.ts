import { NextResponse } from 'next/server';
import orders from '../../../../data/orders.json';
import { Product } from '../../../../type/orders';

export async function GET(req: Request, { params }: { params: { date: string } }) {
  const ordersForDate = orders.filter(order => order.orderDate === params.date);
  const products: Product[] = [];

  for (const order of ordersForDate) {
    for (const lineItem of order.lineItems) {
      for (const product of lineItem.products) {
        const [ countedProduct ] = products.filter(one => one.id === product.id);
        countedProduct ? 
          countedProduct.quantity += product.quantity * lineItem.quantity : 
          products.push({ ...product, quantity: product.quantity * lineItem.quantity });
      }
    }
  }
  return NextResponse.json(products);
}