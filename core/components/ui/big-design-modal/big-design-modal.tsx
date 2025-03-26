'use client'
import { Modal, Text } from '@bigcommerce/big-design';
import Button from '@mui/material/Button/Button';
import * as React from 'react';
import { ReactNode, useState } from "react";
import { Image } from '~/components/image';


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


export default function BigDesignModal({ id, name, image, price, addToCart }: QuickViewProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <Button onClick={() => setIsOpen(true)}>Quick-View-BD</Button>

            <Modal
                actions={[
                    {
                        text: 'Close',
                        onClick: () => setIsOpen(false),
                    }
                ]}
                closeOnClickOutside={true}
                closeOnEscKey={true}
                header={name}
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
            >
                <Text>
                    Product ID: {id}
                </Text>
                {image && (
                    <div style={{ position: "relative", width: "100%", height: "200px" }}>
                        <Image
                            alt={image.altText}
                            src={image.src}
                            fill
                            className="object-contain"
                            sizes="(max-width: 768px) 50vw, (max-width: 1536px) 25vw, 500px"
                        />
                    </div>
                )}

                {Boolean(price) &&
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
                    ))}
                <Text>
                    {addToCart}
                </Text>
            </Modal>
        </>
    );
}

