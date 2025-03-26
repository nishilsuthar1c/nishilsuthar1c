import { useFormatter } from 'next-intl';

import { ResultOf } from '~/client/graphql';
import { ProductCard as ComponentProductCard } from '~/components/ui/product-card';
import { pricesTransformer } from '~/data-transformers/prices-transformer';

import { AddToCart } from './add-to-cart';
import { ProductCardFragment } from './fragment';
import { ReactNode } from 'react';

interface Props {
  product: ResultOf<typeof ProductCardFragment>;
  imageSize?: 'tall' | 'wide' | 'square';
  imagePriority?: boolean;
  showCompare?: boolean;
  showCart?: boolean;
  wishlistProductIds: number[];
}

export const ProductCard = ({
  product,
  imageSize = 'square',
  imagePriority = false,
  showCart = true,
  showCompare = true,
  wishlistProductIds,
}: Props) => {
  const format = useFormatter();

  const { name, entityId, defaultImage, brand, path, prices } = product;

  const price = pricesTransformer(prices, format);

  return (
    <ComponentProductCard
      addToCart={<AddToCart data={product} />}
      href={path}
      id={entityId.toString()}
      image={defaultImage ? { src: defaultImage.url, altText: defaultImage.altText } : undefined}
      imagePriority={imagePriority}
      imageSize={imageSize}
      name={name}
      price={price}
      showCompare={showCompare}
      subtitle={brand?.name}
      wishlistProductIds={wishlistProductIds}
    />
  );
};
