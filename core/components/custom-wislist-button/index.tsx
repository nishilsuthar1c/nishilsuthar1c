"use client";

import { useEffect, useState } from "react";
import { Button } from "@mui/material";
import { Heart } from "lucide-react";

export default function WishlistButtonClient({ productId, wishlistProductIds = [] }: { productId: string; wishlistProductIds?: number[] }) {
    const [isWishlisted, setIsWishlisted] = useState(false);

    useEffect(() => {
        if (wishlistProductIds) {
            setIsWishlisted(wishlistProductIds.includes(Number(productId))); // ✅ Convert `productId` to number for comparison
        }
    }, [wishlistProductIds, productId]);

    return (
        <div>
            <Button type="submit">
                {/* <Heart
                    aria-hidden="true"
                    className={`mr-2 transition-colors ${isWishlisted ? "fill-red-500 text-red-500" : "fill-none text-gray-400"}`}
                /> */}
                WishList
            </Button>
        </div>
    );
}
