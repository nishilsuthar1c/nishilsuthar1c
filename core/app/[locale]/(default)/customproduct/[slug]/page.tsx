import ProductForm from "~/components/customproductform";
import ProductDisplay from "~/components/customproductdisplay";

interface ProductPageProps {
    params: {
        slug: string;
    };
}

export default function ProductPage({ params }: ProductPageProps) {
    const { slug } = params; 

    return (
        <div>
            <h1 className='text-xl font-semibold pb-2'>Product Lookup</h1>
            <ProductForm />
            {slug && <ProductDisplay productId={slug} />}
        </div>
    );
}
