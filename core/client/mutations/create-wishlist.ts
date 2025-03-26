import { getSessionCustomerAccessToken } from '~/auth';
import { client } from '..';
import { graphql, VariablesOf } from '../graphql';

const CreateWishlistMutation = graphql(`
  mutation createWishlistMutation($input: CreateWishlistInput!) {
    wishlist {
      createWishlist(input: $input) {
        result {
          entityId
          name
          items {
          edges {
            node {
              product{
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

type Variables = VariablesOf<typeof CreateWishlistMutation>;
type CreateWishlistInput = Variables['input'];

export const createWishlist = async (
  name: string,
  isPublic: boolean,
  productEntityId?: string, 
) => {
  const customerAccessToken = await getSessionCustomerAccessToken();

  const input: CreateWishlistInput = {
    name,
    isPublic,
    items: productEntityId ? [{ productEntityId: parseInt(productEntityId, 10) }] : null, 
  };

  const response = await client.fetch({
    document: CreateWishlistMutation,
    variables: { input },
    customerAccessToken,
    fetchOptions: { cache: 'no-store' },
  });

  console.log("Wishlist Creation Response:", response); // ✅ Logs response here

  return response;
};

export function assertCreateWishlistErrors(
  response: Awaited<ReturnType<typeof createWishlist>>,
): asserts response is Awaited<ReturnType<typeof createWishlist>> {
  if (typeof response === 'object' && 'errors' in response && Array.isArray(response.errors)) {
    response.errors.forEach((error) => {
      throw new Error(error.message);
    });
  }
}
