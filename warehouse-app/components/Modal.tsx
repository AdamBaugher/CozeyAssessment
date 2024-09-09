'use client';

import { ProductDetails } from "../type/orders";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    productDetails: ProductDetails | null;
}

const Modal = ({ isOpen, onClose, productDetails }: ModalProps) => {
    if (!isOpen || !productDetails) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Product Details</h2>
            <p><strong>Product Name:</strong> {productDetails.name}</p>
            <p><strong>Quantity:</strong> {productDetails.price}</p>
            <p><strong>Color:</strong> {productDetails.color}</p>
            <p><strong>Weight:</strong> {productDetails.weight}</p>
            <button
                onClick={onClose}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
            >
                Close
            </button>
            </div>
        </div>
    );
};

export default Modal;