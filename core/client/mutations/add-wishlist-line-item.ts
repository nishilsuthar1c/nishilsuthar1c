import { getSessionCustomerAccessToken } from '~/auth';
import { client } from '..';
import { graphql, VariablesOf } from '../graphql';

const AddItemToWishlistMutation = graphql(`
  mutation addItemToWishlistMutation($input: AddWishlistItemsInput!) {
    wishlist {
      addWishlistItems(input: $input) {
        result {
          entityId
          items {
            edges {
              node {
                entityId
                productEntityId
                product {
                  entityId
                  name
                }
              }
            }
          }
        }
      }
    }
  }
`);

type Variables = VariablesOf<typeof AddItemToWishlistMutation>;
type AddWishlistItemsInput = Variables['input'];

export const addItemToWishlist = async (
  wishlistId: number,
  productEntityId: string,
) => {
  const customerAccessToken = await getSessionCustomerAccessToken();

  if (!customerAccessToken) {
    throw new Error("User must be logged in to add items to wishlist.");
  }

  const input: AddWishlistItemsInput = {
    entityId: wishlistId,
    items: [{ productEntityId: parseInt(productEntityId, 10) }],
  };

  const response = await client.fetch({
    document: AddItemToWishlistMutation,
    variables: { input },
    customerAccessToken,
    fetchOptions: { cache: 'no-store' },
  });

  console.log("Add Item to Wishlist Response:", response); 

  return response;
};

export function assertAddItemToWishlistErrors(
  response: Awaited<ReturnType<typeof addItemToWishlist>>,
): asserts response is Awaited<ReturnType<typeof addItemToWishlist>> {
  if (typeof response === 'object' && 'errors' in response && Array.isArray(response.errors)) {
    response.errors.forEach((error) => {
      throw new Error(error.message);
    });
  }
}
