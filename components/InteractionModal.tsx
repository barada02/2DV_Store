import React, { useEffect, useState } from 'react';
import { Product } from '../types';
import { generateProductDetails } from '../services/geminiService';

interface InteractionModalProps {
  product: Product;
  onClose: () => void;
}

interface AIResponse {
  description: string;
  price: number;
  salesPitch: string;
}

export const InteractionModal: React.FC<InteractionModalProps> = ({ product, onClose }) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<AIResponse | null>(null);

  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      setLoading(true);
      const result = await generateProductDetails(product.name, product.basePrice);
      if (mounted && result) {
        setData(result);
        setLoading(false);
      }
    };

    fetchData();

    return () => {
      mounted = false;
    };
  }, [product]);

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm p-4">
      <div className="bg-white border-4 border-slate-800 rounded-lg p-6 max-w-sm w-full shadow-2xl relative animate-in fade-in zoom-in duration-200">
        
        {/* Close Button */}
        <button 
            onClick={onClose}
            className="absolute top-2 right-2 text-slate-500 hover:text-red-500 font-bold"
        >
            ✕
        </button>

        <div className="text-center mb-4">
          <div className="text-6xl mb-2 animate-bounce">{product.emoji}</div>
          <h2 className="text-2xl font-bold font-mono uppercase text-slate-800 border-b-2 border-slate-200 pb-2">
            {product.name}
          </h2>
        </div>

        {loading ? (
          <div className="space-y-3 py-4">
            <div className="h-4 bg-slate-200 rounded animate-pulse w-3/4 mx-auto"></div>
            <div className="h-4 bg-slate-200 rounded animate-pulse w-full"></div>
            <div className="text-center text-sm text-slate-400 mt-2 font-mono">
              The shopkeeper is thinking...
            </div>
          </div>
        ) : data ? (
          <div className="space-y-4 font-mono text-sm">
            <div className="bg-amber-50 p-3 rounded border border-amber-200 text-amber-900 italic">
              "{data.salesPitch}"
            </div>
            
            <p className="text-slate-600">
              {data.description}
            </p>

            <div className="flex justify-between items-center pt-2 border-t border-slate-100">
              <span className="text-slate-500">Price:</span>
              <span className="text-xl font-bold text-green-600">{data.price} Gold</span>
            </div>
            
            <button 
                onClick={onClose}
                className="w-full mt-4 bg-slate-800 text-white py-2 rounded hover:bg-slate-700 transition-colors font-bold uppercase"
            >
                Add to Cart (Space)
            </button>
          </div>
        ) : (
             <div className="text-red-500 text-center">Shopkeeper is on break (Error).</div>
        )}
        
        <div className="mt-4 text-xs text-center text-slate-400">
            Press ESC or click X to close
        </div>
      </div>
    </div>
  );
};
