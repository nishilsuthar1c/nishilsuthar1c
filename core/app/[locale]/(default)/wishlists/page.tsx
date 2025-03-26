import { getWishlist } from "~/client/queries/get-wishlist";

export default async function WishlistPage() {
    const wishlists = await getWishlist();
    console.log('Wishlists : ', wishlists);

    const handleRemoveItem = () => {
        console.log(`Removing product with ID`);
    };


    return (
        <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {wishlists[0].items.map((item) => (
                    <div key={item.productId} className="border rounded-lg shadow-md p-4">
                        <img
                            src={item.productImage}
                            alt={item.productName}
                            className="w-full h-48 object-cover rounded-t-lg"
                        />
                        <div className="p-4">
                            <h2 className="text-xl font-semibold">{item.productName}</h2>
                            <p className="text-gray-600">${item.productPrice.toFixed(2)}</p>
                        </div>
                    </div>          
                ))}
            </div>
        </div>
    );
}