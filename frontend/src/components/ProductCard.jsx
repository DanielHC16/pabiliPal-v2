import React from 'react';
import { Link } from 'react-router-dom';
import { EditIcon, TrashIcon } from 'lucide-react';
import { useProductStore } from '../store/useProductStore';
import { toast } from 'react-hot-toast';

function ProductCard({ product }) {
  const { deleteProduct } = useProductStore();

  const handleDelete = (productId, productName) => {
    toast(
      (t) => (
        <div className="text-sm max-w-xs">
          <p className="text-center">
            Are you sure you want to delete <strong>{productName}</strong>?
          </p>
          <div className="flex justify-center gap-3 mt-3">
            <button
              onClick={async () => {
                toast.dismiss(t.id);
                await deleteProduct(productId);
              }}
              className="px-4 py-1 text-sm font-medium text-white bg-red-500 rounded hover:bg-red-600 transition"
            >
              Delete
            </button>
            <button
              onClick={() => toast.dismiss(t.id)}
              className="px-4 py-1 text-sm font-medium bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      ),
      { duration: 10000 }
    );
  };

  return (
    <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-300">
      {/* Product image */}
      <figure className="relative pt-[56.25%]">
        <img
          src={product.image}
          alt={product.name}
          className="absolute top-0 left-0 w-full h-full object-cover"
        />
      </figure>

      <div className="card-body">
        {/* Product info */}
        <h2 className="card-title text-lg font-semibold">{product.name}</h2>
        <p className="text-wxxl font-bold text-accent">
          ${Number(product.price).toFixed(2)}
        </p>

        {/* Product actions */}
        <div className="card-actions justify-end mt-4">
          <Link
            to={`/product/${product.id}`}
            className="btn btn-sm btn-secondary btn-outline"
          >
            <EditIcon className="size-4" />
          </Link>
          <button
            className="btn btn-sm btn-error btn-outline"
            onClick={() => handleDelete(product.id, product.name)}
          >
            <TrashIcon className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;