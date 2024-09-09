import { NextResponse } from 'next/server';
import orders from '../../../../data/orders.json';

export async function GET(req: Request, { params }: { params: { date: string } }) {
  return NextResponse.json(orders.filter(order => order.orderDate === params.date));
}