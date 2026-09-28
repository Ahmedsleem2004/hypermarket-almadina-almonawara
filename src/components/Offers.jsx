import { ShoppingCart, ArrowLeft, Tag } from "lucide-react";
import { useEffect, useState } from "react";
import { useCart } from "./CartContext";
import { getProducts } from "../firebaseProducts";

function Offers() {
  const { addToCart } = useCart();

  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOffers = async () => {
      try {
        const products = await getProducts();

        const offerProducts = products.filter(
          (product) => product.isOffer === true
        );

        setOffers(offerProducts);
      } catch (error) {
        console.error("Error loading offers:", error);
      } finally {
        setLoading(false);
      }
    };

    loadOffers();
  }, []);

  const handleAddToCart = (offer) => {
    const offerForCart = {
      id: offer.id,
      name: offer.name,
      description: offer.description || "",
      category: offer.category || "",
      price: Number(offer.price) || 0,
      oldPrice: offer.oldPrice || null,
      image: offer.image || offer.imageUrl || "",
      imageUrl: offer.imageUrl || offer.image || "",
      isOffer: true,
    };

    addToCart(offerForCart);
  };

  return (
    <section id="offers" className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="mb-3 inline-flex items-center gap-2 rounded-full bg-red-50 px-4 py-2 text-sm font-bold text-red-600">
              <Tag size={16} />
              عروض اليوم
            </span>

            <h2 className="text-2xl font-extrabold text-gray-900 sm:text-4xl">
              عروض وتخفيضات
            </h2>

            <p className="mt-3 text-sm leading-7 text-gray-500 sm:text-base">
              وفر أكتر واستفيد من أفضل العروض المتاحة في هايبر المدينة المنورة.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              document
                .getElementById("products")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            className="flex w-fit items-center gap-2 rounded-xl bg-green-700 px-5 py-3 text-sm font-bold text-white transition hover:bg-green-800"
          >
            كل المنتجات
            <ArrowLeft size={18} />
          </button>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="h-72 animate-pulse rounded-2xl bg-gray-100"
              />
            ))}
          </div>
        ) : offers.length > 0 ? (
          /* Offers */
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
            {offers.map((offer) => {
              const productImage =
                offer.image || offer.imageUrl || "";

              return (
                <div
                  key={offer.id}
                  className="group overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  {/* Image */}
                  <div className="relative flex h-36 items-center justify-center overflow-hidden bg-red-50 sm:h-48">
                    <span className="absolute right-3 top-3 z-10 rounded-full bg-red-500 px-3 py-1 text-xs font-bold text-white">
                      خصم
                    </span>

                    {productImage ? (
                      <img
                        src={productImage}
                        alt={offer.name}
                        className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <ShoppingCart
                        size={48}
                        className="text-red-300"
                      />
                    )}
                  </div>

                  {/* Details */}
                  <div className="p-3 sm:p-5">
                    <h3 className="text-sm font-extrabold text-gray-900 sm:text-base">
                      {offer.name}
                    </h3>

                    <p className="mt-1 text-xs text-gray-500">
                      {offer.description}
                    </p>

                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <span className="text-lg font-extrabold text-red-600">
                        {offer.price} ج.م
                      </span>

                      {offer.oldPrice && (
                        <span className="text-xs text-gray-400 line-through">
                          {offer.oldPrice} ج.م
                        </span>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => handleAddToCart(offer)}
                      className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-green-700 py-3 text-xs font-bold text-white transition hover:bg-green-800 sm:text-sm"
                    >
                      <ShoppingCart size={16} />
                      اطلب الآن
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="rounded-3xl border border-gray-100 bg-gray-50 py-16 text-center">
            <Tag
              size={42}
              className="mx-auto text-gray-300"
            />

            <h3 className="mt-4 text-lg font-extrabold text-gray-800">
              مفيش عروض حالياً
            </h3>

            <p className="mt-2 text-sm text-gray-500">
              تابعنا باستمرار لمعرفة أحدث العروض.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

export default Offers;