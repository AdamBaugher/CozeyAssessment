'use client';

import { useRouter } from 'next/navigation';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import Modal from '../../components/Modal';
import { ProductDetails, Product } from '../../type/orders';

export default function PickingPage() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
	const router = useRouter();
	const [products, setProducts] = useState<Product[]>([]);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [selectedProduct, setSelectedProduct] = useState<ProductDetails | null>(null);

  const fetchProducts = async (date: string) => {
    const res = await fetch(`/api/products/${date}`);
    const data = await res.json();
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

  const handleOpenModal = async (productId: number) => {
    const res = await fetch(`/api/product/${productId}`);
    const data = await res.json();

    if (data) {
      setSelectedProduct(data);
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
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
							<th className="py-2 px-4 font-semibold text-gray-600 border-b">Details</th>
						</tr>
					</thead>
					<tbody>
					{products.map((product, index) => (
						<tr key={index} className="hover:bg-gray-50">
							<td className="py-2 px-4 border-b">{index + 1}</td>
							<td className="py-2 px-4 border-b">{product.name}</td>
							<td className="py-2 px-4 border-b">{product.price}</td>
							<td className="py-2 px-4 border-b">{product.quantity}</td>
              <td className='py-2 px-4 border-b'>
                <button
                  onClick={() => handleOpenModal(product.id)}
                  className="px-4 py-2 bg-green-500 text-white rounded"
                >
                  Details
                </button>
              </td>
						</tr>
					))}
					</tbody>
				</table>
			</div>
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        productDetails={selectedProduct}
      />
    </div>
  );
}