'use client';

import { useRouter } from 'next/navigation';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useEffect, useState } from 'react';
import { LineItem, Order } from '../../type/orders';
import { format } from 'date-fns';

const ListItemComponent = ({ lineItems }: {lineItems: LineItem[]}) => (
	<ol className='list-decimal'>
	{
		lineItems.map( (lineItem, index) => (
			<li key={index}>
				{ lineItem.name } * { lineItem.quantity }
				<ul className='pl-4 list-disc'>
				{
					lineItem.products.map( (product, index) => (
						<li key={index}>{product.name} * {product.quantity}</li>
					))
				}
				</ul>
			</li>
		))
	}
	</ol>
)

export default function PickingPage() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
	const router = useRouter();
	const [orders, setOrders] = useState<Order[]>([]);

	const fetchOrders = async (date: string) => {
		const res = await fetch(`/api/orders/${date}`);
		const data = await res.json();

		setOrders(data);
	}
	useEffect(() => {
    const formattedDate = format(selectedDate ? selectedDate : new Date(), 'yyyy-MM-dd');
    fetchOrders(formattedDate);
  }, []);
	
  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
    const formattedDate = format(date ? date : new Date, 'yyyy-MM-dd');
    fetchOrders(formattedDate);
  };

  return (
    <div className="p-8">
			<button
				onClick={() => router.push('/')}
				className="mb-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
			>
				Back to Dashboard
			</button>
			<h1 className="text-2xl font-bold mb-6">Packing List</h1>

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
							<th className="py-2 px-4 font-semibold text-gray-600 border-b">Order Date</th>
							<th className="py-2 px-4 font-semibold text-gray-600 border-b">Line Items</th>
							<th className="py-2 px-4 font-semibold text-gray-600 border-b">Ships To</th>
						</tr>
					</thead>
					<tbody>
					{orders.map((order, index) => (
						<tr key={index} className="hover:bg-gray-50">
							<td className="py-2 px-4 border-b">{index + 1}</td>
							<td className="py-2 px-4 border-b">{order.orderDate}</td>
							<td className="py-2 px-4 border-b">
								<ListItemComponent lineItems = {order.lineItems} />
							</td>
							<td className="py-2 px-4 border-b">{order.customerName} ({order.shippingAddress})</td>
						</tr>
					))}
					</tbody>
				</table>
			</div>
    </div>
  );
}