'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ProductForm() {
    const [productId, setProductId] = useState<string>('');
    const router = useRouter();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (productId) {
            router.push(`/customproduct/${productId}`);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                className='border-slate-500 border-2'
                placeholder='Enter product-ID'
                id="productId"
                value={productId}
                onChange={(e) => setProductId(e.target.value)}
                required
            />
            <button
            type="submit">Fetch Product</button>
        </form>
    );
}
