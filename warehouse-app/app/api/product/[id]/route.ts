import { NextResponse } from 'next/server';
import products from '../../../../data/products.json';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const [ product ] = products.filter(one => one.id === Number(params.id));
  return NextResponse.json(product ? product : {});
}