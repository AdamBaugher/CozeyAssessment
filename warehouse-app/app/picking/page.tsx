'use client';

import { useRouter } from 'next/navigation';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { ProductDetails, Product } from '../../type/orders';

export default function PickingPage() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
	const router = useRouter();
	const [products, setProducts] = useState<Product[]>([]);

  const fetchProducts = async (date: string) => {
    //const res = await fetch(`/api/products/${date}`);
    //const data = await res.json();
    const data = [
      {
        "id": 1,
        "name": "Birthday cupcake",
        "price": 50,
        "quantity": 1
      },
      {
        "id": 2,
        "name": "$100 Visa Gift Card",
        "price": 100,
        "quantity": 1
      },
      {
        "id": 3,
        "name": "Birthday card",
        "price": 50,
        "quantity": 1
      }
    ]
    setProducts(data);
  };

	useEffect(() => {
    const formattedDate = format(selectedDate ? selectedDate : new Date(), 'yyyy-MM-dd');
    fetchProducts(formattedDate);
  }, []);

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
    const formattedDate = format(date ? date : new Date, 'yyyy-MM-dd');
    fetchProducts(formattedDate);
  };

  return (
    <div className="p-8">
			<button
				onClick={() => router.push('/')}
				className="mb-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
			>
				Back to Dashboard
			</button>
			<h1 className="text-2xl font-bold mb-6">Picking List</h1>

      <div className="flex justify-center mb-6">
        <DatePicker
          selected={selectedDate}
          onChange={handleDateChange}
          dateFormat="yyyy-MM-dd"
          className="border p-2 rounded"
          placeholderText="Select a date"
        />
      </div>
			<div className="overflow-x-auto">
				<table className="min-w-full bg-white border border-gray-200">
					<thead>
						<tr className="bg-gray-100 text-left">
							<th className="py-2 px-4 font-semibold text-gray-600 border-b">No</th>
							<th className="py-2 px-4 font-semibold text-gray-600 border-b">Product Name</th>
							<th className="py-2 px-4 font-semibold text-gray-600 border-b">Price</th>
							<th className="py-2 px-4 font-semibold text-gray-600 border-b">Quantity</th>
						</tr>
					</thead>
					<tbody>
					{products.map((product, index) => (
						<tr key={index} className="hover:bg-gray-50">
							<td className="py-2 px-4 border-b">{index + 1}</td>
							<td className="py-2 px-4 border-b">{product.name}</td>
							<td className="py-2 px-4 border-b">{product.price}</td>
							<td className="py-2 px-4 border-b">{product.quantity}</td>
						</tr>
					))}
					</tbody>
				</table>
			</div>
    </div>
  );
}