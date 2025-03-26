import { getSessionCustomerAccessToken } from "~/auth";
import { client } from "..";
import { graphql, VariablesOf } from "../graphql";

const DeleteWishlistItemMutation = graphql(`
  mutation deleteWishlistItemMutation($input: DeleteWishlistItemsInput!) {
    wishlist {
      deleteWishlistItems(input: $input) {
        result {
          entityId
          items {
            edges {
              node {
                productEntityId
                entityId
              }
            }
          }
        }
      }
    }
  }
`);

type Variables = VariablesOf<typeof DeleteWishlistItemMutation>;
type DeleteWishlistItemsInput = Variables["input"];

export const deleteWishlistItem = async (wishlistId: number, itemEntityId: any) => {
  const customerAccessToken = await getSessionCustomerAccessToken();

  if (!customerAccessToken) {
    throw new Error("User must be logged in to remove items from wishlist.");
  }

  const input: DeleteWishlistItemsInput = {
    entityId: wishlistId,
    itemEntityIds: [itemEntityId], 
  };

  const response = await client.fetch({
    document: DeleteWishlistItemMutation,
    variables: { input },
    customerAccessToken,
    fetchOptions: { cache: "no-store" },
  });

  console.log("Delete Item from Wishlist Response:", response);

  return response;
};

export function assertDeleteWishlistItemErrors(
  response: Awaited<ReturnType<typeof deleteWishlistItem>>
): asserts response is Awaited<ReturnType<typeof deleteWishlistItem>> {
  if (typeof response === "object" && "errors" in response && Array.isArray(response.errors)) {
    response.errors.forEach((error) => {
      throw new Error(error.message);
    });
  }
}
