import { removeEdgesAndNodes } from '@bigcommerce/catalyst-client';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { getSessionCustomerAccessToken } from '~/auth';
import { client } from '~/client';
import { graphql } from '~/client/graphql';
import { revalidate } from '~/client/revalidate-target';
import { ProductCardCarousel } from '~/components/product-card-carousel';
import { ProductCardCarouselFragment } from '~/components/product-card-carousel/fragment';
import { Slideshow } from '~/components/slideshow';
import ProductForm from '~/components/customproductform';
import { getWishlist } from '~/client/queries/get-wishlist';

const HomePageQuery = graphql(
  `
    query HomePageQuery {
      site {
        newestProducts(first: 12) {
          edges {
            node {
              ...ProductCardCarouselFragment
            }
          }
        }
        featuredProducts(first: 12) {
          edges {
            node {
              ...ProductCardCarouselFragment
            }
          }
        }
      }
    }
  `,
  [ProductCardCarouselFragment],
);

interface Props {
  params: Promise<{ locale: string }>;
}

export default async function Home({ params }: Props) {
  const { locale } = await params;

  setRequestLocale(locale);

  const t = await getTranslations('Home');
  const customerAccessToken = await getSessionCustomerAccessToken();

  const { data } = await client.fetch({
    document: HomePageQuery,
    customerAccessToken,
    fetchOptions: customerAccessToken ? { cache: 'no-store' } : { next: { revalidate } },
  });

  const featuredProducts = removeEdgesAndNodes(data.site.featuredProducts);
  const newestProducts = removeEdgesAndNodes(data.site.newestProducts);

  const wishlistData = await getWishlist();
  const wishlistProductIds = wishlistData?.[0]?.items.map(item => item.productId) || [];
  console.log('wishlistProductIds : ',wishlistProductIds);
  
  return (
    <>
      <Slideshow />
      <h1>Search your product</h1>
        <ProductForm/>

      <div className="my-10">
        <ProductCardCarousel
          products={featuredProducts}
          showCart={false}
          showCompare={true}
          title={t('Carousel.featuredProducts')}
          wishlistProductIds={wishlistProductIds}
        />
        <ProductCardCarousel
          products={newestProducts}
          showCart={false}
          showCompare={true}
          title={t('Carousel.newestProducts')}
          wishlistProductIds={wishlistProductIds}
        />
      </div>
    </>
  );
}

export const runtime = 'edge';
