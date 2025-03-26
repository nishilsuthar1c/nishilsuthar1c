import { client } from '~/client';
import { graphql } from '~/client/graphql';

const ProductQuery = graphql(`
    query ProductById($eid: Int!) {
        site {
            product(entityId: $eid) {
                defaultImage {
                    url(width: 100)
                }
                name
                prices {
                    price {
                        value
                        formatted
                    }
                }
            }
        }
    }
`);

interface ProductDisplayProps {
    productId: string;
}

export default async function ProductDisplay({ productId }: ProductDisplayProps) {
    if (!productId) return <p>No Product ID provided</p>;

    try {
        const response = await client.fetch({
            document: ProductQuery,
            variables: { eid: parseInt(productId, 10) },
            fetchOptions: { cache: 'no-store' },
        });

        const productInfo = response.data?.site?.product;
        
        if (!productInfo) {
            return <p>Product not found</p>;
        }

        return (
            <div>
                <h3>{productInfo?.name}</h3>
                <img src={productInfo?.defaultImage?.url} alt={productInfo?.name} />
                <p>Price: {productInfo?.prices?.price?.formatted}</p>    
            </div>
        );
    } catch (error) {
        console.error('Error fetching product data:', error);
        return <p>Failed to fetch product data.</p>;
    }
}