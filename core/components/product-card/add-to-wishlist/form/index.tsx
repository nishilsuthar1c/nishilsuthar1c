"use client";

import { AlertCircle, Check } from "lucide-react";
import { useTranslations } from "next-intl";
import { useId, useTransition } from "react";
import { toast } from "react-hot-toast";

import WishlistButtonClient from "~/components/custom-wislist-button";
import { addToWishlist } from "./_actions/add-to-wishlist";

interface Props {
    productId: string;
    wishlistProductIds: number[]
}

export const WishlistForm = ({ productId, wishlistProductIds }: Props) => {
    //   const t = useTranslations("Components.ProductCard.AddToWishlist");
    const toastId = useId();
    const [isPending, startTransition] = useTransition();


    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);

        startTransition(async () => {
            const result = await addToWishlist(formData);

            console.log('result : ', result);

            if (result.error) {
                toast.error(result.error, {
                    icon: <AlertCircle className="text-error-secondary" />,
                    id: toastId,
                });
            } else {
                // Show optimistic success message
                toast.success(
                    () => (
                        <div className="flex items-center gap-3">
                            <span>
                                {result.status === "removed" ? "Item removed from wishlist" : "Item added to wishlist"}
                            </span>
                        </div>
                    ),
                    { icon: <Check className="text-success-secondary" />, id: toastId }
                );
            }
        });
    };

    return (
        <form onSubmit={handleSubmit}>
            <input name="product_id" type="hidden" value={productId} />
            <WishlistButtonClient wishlistProductIds={wishlistProductIds} productId={productId} />
        </form>
    );
};
