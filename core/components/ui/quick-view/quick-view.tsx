'use client'
import { ReactNode, useState } from "react";
import ReactModal from "react-modal";
import { Image } from "~/components/image";

interface Image {
    altText: string;
    src: string;
}

type Price =
    | string
    | {
        type: 'sale';
        currentValue: string;
        previousValue: string;
    }
    | {
        type: 'range';
        minValue: string;
        maxValue: string;
    };

interface QuickViewProps {
    id: string;
    name: string;
    image?: Image;
    price?: Price; 
    addToCart?: ReactNode;
}


export default function QuickView({ id, name, image, price, addToCart }: QuickViewProps) {
    const [showModal, setShowModal] = useState(false);price
    
    return (
        <>
            <button onClick={() => setShowModal(true)}>Open Modal</button>
            <ReactModal isOpen={showModal} ariaHideApp={false}>
                <button onClick={() => setShowModal(false)}>Close Modal </button>
                <h1>This is QuickView Modal</h1>
                <p>Product ID: {id}</p>
                <p>Name : {name}</p>
                {image && (
                    <div style={{ position: 'relative', width: '100%', height: '200px' }}>
                        <Image
                            alt={image.altText}
                            src={image.src}
                            fill
                            className="object-contain"
                            sizes="(max-width: 768px) 50vw, (max-width: 1536px) 25vw, 500px"
                        />
                    </div>
                )}

                <p>price : {Boolean(price) &&
                    (typeof price === 'object' ? (
                        <p className="flex flex-col gap-1">
                            {price.type === 'range' && (
                                <span>
                                    {price.minValue} - {price.maxValue}
                                </span>
                            )}

                            {price.type === 'sale' && (
                                <>
                                    <span>
                                        Was: <span className="line-through">{price.previousValue}</span>
                                    </span>
                                    <span>Now: {price.currentValue}</span>
                                </>
                            )}
                        </p>
                    ) : (
                        <span>{price}</span>
                    ))}</p>  

                    {addToCart}  
            </ReactModal>
        </>
    );
}