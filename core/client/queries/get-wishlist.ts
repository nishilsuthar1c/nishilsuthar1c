import { cache } from "react";
import { getSessionCustomerAccessToken } from "~/auth";
import { client } from "..";
import { graphql } from "../graphql";

const GetWishlistQuery = graphql(`
  query GetWishlist {
    customer {
      wishlists {
        edges {
          node {
            entityId
            items {
              edges {
                node {
                  productEntityId
                  product {
                    name
                    entityId
                    prices {
                      price {
                        value
                      }
                    }
                    images {
                      edges {
                        node {
                          urlOriginal
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`);
  

export const getWishlist = cache(async () => {
  const customerAccessToken = await getSessionCustomerAccessToken();

  if (!customerAccessToken) {
    console.warn("No customer access token found. Cannot fetch wishlist.");
    return null;
  }

  const response = await client.fetch({
    document: GetWishlistQuery,
    customerAccessToken,
    fetchOptions: {
      cache: "no-store",
    },
  });

  const wishlists = response?.data?.customer?.wishlists?.edges || [];

  if (wishlists.length === 0) {
    return null;
  }

  // Extract wishlist items and format the response
  return wishlists.map(({ node }) => ({
    wishlistId: node.entityId,
    items: node?.items?.edges?.map(({ node }) => ({
      productId: node.productEntityId,
      productName: node.product?.name ?? "Unknown Product",
      productPrice : node.product.prices?.price.value,
      productImage : node?.product?.images?.edges[0]?.node?.urlOriginal ?? undefined
    })) ?? [], 
  }));
});
