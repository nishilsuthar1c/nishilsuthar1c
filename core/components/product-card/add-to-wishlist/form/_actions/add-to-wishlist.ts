"use server";

import { revalidateTag } from "next/cache";
import { addItemToWishlist, assertAddItemToWishlistErrors } from "~/client/mutations/add-wishlist-line-item";
import { createWishlist, assertCreateWishlistErrors } from "~/client/mutations/create-wishlist";
import { deleteWishlistItem, assertDeleteWishlistItemErrors } from "~/client/mutations/delete-wishlist-line-items";
import { getWishlist } from "~/client/queries/get-wishlist";

export const addToWishlist = async (data: FormData) => {
    const productEntityId = Number(data.get("product_id"));

    let wishlistData = await getWishlist();
    console.log(`📂 Retrieved wishlist data:`, wishlistData);

    try {
        if (wishlistData && wishlistData.length > 0) {
            const wishlistId = wishlistData[0]?.wishlistId ?? null;
            const wishlistItems = wishlistData[0]?.items || [];

            if (wishlistId !== null) {
                // Check if the product is already in the wishlist
                const existingItem = wishlistItems.find(item => item.productId === Number(productEntityId));

                if (existingItem) {
                    // ✅ Product exists in wishlist → Remove it
                    console.log(`🗑 Removing product ${productEntityId} from wishlist (ID: ${wishlistId}).`);

                    const deleteWishlistItemResponse = await deleteWishlistItem(wishlistId, productEntityId);
                    assertDeleteWishlistItemErrors(deleteWishlistItemResponse);

                    revalidateTag("wishlist");

                    return { status: "removed", data: deleteWishlistItemResponse };
                } else {
                    // ✅ Product does NOT exist → Add it
                    console.log(`🎉 Adding product ${productEntityId} to wishlist (ID: ${wishlistId}).`);

                    const addWishlistItemResponse = await addItemToWishlist(wishlistId, productEntityId);
                    assertAddItemToWishlistErrors(addWishlistItemResponse);

                    revalidateTag("wishlist");

                    return { status: "added", data: addWishlistItemResponse };
                }
            }
        }

        // If no wishlist exists, create a new one
        console.log(`⚠️ No existing wishlist found. Creating a new wishlist: "My Wishlist".`);
        const createWishlistResponse = await createWishlist("My Wishlist", true, productEntityId);
        console.log(`🎉 Successfully created a new wishlist and added product ${productEntityId}.`, createWishlistResponse);
        assertCreateWishlistErrors(createWishlistResponse);

        revalidateTag("wishlist");

        return { status: "success", data: createWishlistResponse };
    } catch (error: unknown) {
        console.error(`❌ Error in addToWishlist:`, error);

        if (error instanceof Error) {
            return { status: "error", error: error.message };
        }

        return { status: "error", error: "Something went wrong. Please try again." };
    }
};
