import { Search, ShoppingCart, Plus, Minus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useCart } from "./CartContext";
import { getProducts } from "../firebaseProducts";

const categories = [
  "الكل",
  "مشروبات وعصائر",
  "ألبان ومنتجات مبردة",
  "سناكس وحلويات",
  "بقالة ومعلبات",
  "منظفات",
  "عناية شخصية",
  "صلصات وتوابل",
  "مخبوزات",
];

function Products() {
  const [products, setProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState("الكل");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const {
    cart,
    cartItems,
    cartCount,
    cartTotal,
    addToCart,
    removeFromCart,
    openCheckout,
  } = useCart();

  // تحميل المنتجات
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getProducts();
        setProducts(data);
      } catch (err) {
        console.error("Error loading products:", err);
        setError("حصلت مشكلة أثناء تحميل المنتجات.");
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  // استقبال اختيار القسم من Categories
  useEffect(() => {
    const handleCategoryChange = (event) => {
      const category = event.detail;

      if (categories.includes(category)) {
        setActiveCategory(category);
        setSearchTerm("");
      }
    };

    window.addEventListener(
      "change-product-category",
      handleCategoryChange
    );

    return () => {
      window.removeEventListener(
        "change-product-category",
        handleCategoryChange
      );
    };
  }, []);

  // استقبال البحث من الـ Navbar
  useEffect(() => {
    const handleProductSearch = (event) => {
      const value = event.detail || "";

      setSearchTerm(value);

      // البحث من الـ Navbar يبحث في كل الأقسام
      if (value.trim() !== "") {
        setActiveCategory("الكل");
      }
    };

    window.addEventListener("product-search", handleProductSearch);

    return () => {
      window.removeEventListener("product-search", handleProductSearch);
    };
  }, []);

  // فلترة المنتجات
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory =
        activeCategory === "الكل" ||
        product.category === activeCategory;

      const searchValue = searchTerm.trim().toLowerCase();

      const matchesSearch =
        searchValue === "" ||
        product.name?.toLowerCase().includes(searchValue) ||
        product.category?.toLowerCase().includes(searchValue) ||
        product.description?.toLowerCase().includes(searchValue);

      return matchesCategory && matchesSearch;
    });
  }, [products, activeCategory, searchTerm]);

  // إضافة المنتج للسلة
  const handleAddToCart = (product) => {
    const productForCart = {
      id: product.id,
      name: product.name,
      description: product.description || "",
      category: product.category || "",
      price: Number(product.price) || 0,
      oldPrice: product.oldPrice || null,
      image: product.image || product.imageUrl || "",
      imageUrl: product.imageUrl || product.image || "",
      isOffer: Boolean(product.isOffer),
    };

    addToCart(productForCart);
  };

  return (
    <>
      {/* Full Screen Loader */}
      {loading && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white">
          <div className="flex flex-col items-center">
            <div className="relative flex h-24 w-24 items-center justify-center">
              <div className="absolute h-24 w-24 animate-spin rounded-full border-4 border-gray-200 border-t-green-700" />

              <ShoppingCart
                size={32}
                className="text-green-700"
              />
            </div>

            <h2 className="mt-6 text-xl font-extrabold text-gray-900">
              هايبر المدينة المنورة
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              جاري تحميل المنتجات...
            </p>
          </div>
        </div>
      )}

      <section
        id="products"
        className="bg-gray-50 py-16 sm:py-20"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          {/* Header */}
          <div className="mb-8 text-center">
            <span className="mb-3 inline-block rounded-full bg-green-100 px-4 py-2 text-sm font-bold text-green-700">
              منتجاتنا
            </span>

            <h2 className="text-2xl font-extrabold text-gray-900 sm:text-4xl">
              اختار اللي محتاجه
            </h2>

            <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-gray-500 sm:text-base">
              مجموعة متنوعة من المنتجات اليومية بأسعار مناسبة.
            </p>
          </div>

          {/* Search */}
          <div className="mx-auto mb-6 max-w-2xl">
            <div className="relative">
              <Search
                size={20}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="ابحث عن منتج..."
                className="w-full rounded-2xl border border-gray-200 bg-white py-4 pr-12 pl-4 text-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-500/10"
              />
            </div>
          </div>

          {/* Categories */}
          <div className="mb-8 flex gap-2 overflow-x-auto pb-2">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => {
                  setActiveCategory(category);
                  setSearchTerm("");
                }}
                className={`shrink-0 rounded-xl px-4 py-2.5 text-sm font-bold transition ${
                  activeCategory === category
                    ? "bg-green-700 text-white"
                    : "border border-gray-200 bg-white text-gray-600 hover:border-green-200 hover:text-green-700"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Active Category */}
          {activeCategory !== "الكل" && (
            <div className="mb-6 flex items-center justify-between rounded-2xl border border-green-100 bg-green-50 px-4 py-3">
              <p className="text-sm font-bold text-green-800">
                بتعرض دلوقتي: {activeCategory}
              </p>

              <button
                type="button"
                onClick={() => {
                  setActiveCategory("الكل");
                  setSearchTerm("");
                }}
                className="text-xs font-extrabold text-green-700 hover:text-green-900"
              >
                عرض الكل
              </button>
            </div>
          )}

          {/* Error */}
          {!loading && error ? (
            <div className="rounded-3xl border border-red-100 bg-white py-16 text-center">
              <h3 className="text-lg font-extrabold text-red-600">
                حصل خطأ
              </h3>

              <p className="mt-2 text-sm text-gray-500">
                {error}
              </p>
            </div>
          ) : !loading && filteredProducts.length > 0 ? (

            /* Products */
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {filteredProducts.map((product) => {
                const quantity =
                  cart[product.id]?.quantity || 0;

                return (
                  <div
                    key={product.id}
                    className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
                  >
                    {/* Product Image */}
                    <div className="relative flex h-40 items-center justify-center bg-gray-100 sm:h-48">
                      {product.image || product.imageUrl ? (
                        <img
                          src={
                            product.image ||
                            product.imageUrl
                          }
                          alt={product.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span className="text-6xl">
                          🛒
                        </span>
                      )}

                      {product.isOffer && (
                        <span className="absolute right-3 top-3 rounded-full bg-red-500 px-3 py-1 text-xs font-extrabold text-white">
                          عرض
                        </span>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="p-4">
                      <p className="text-xs font-bold text-green-700">
                        {product.category}
                      </p>

                      <h3 className="mt-2 min-h-[44px] text-sm font-extrabold leading-6 text-gray-900">
                        {product.name}
                      </h3>

                      <div className="mt-4 flex items-center justify-between gap-2">
                        <div>
                          <span className="text-lg font-extrabold text-gray-900">
                            {product.price} ج.م
                          </span>

                          {product.isOffer &&
                            product.oldPrice && (
                              <span className="mr-2 text-xs text-gray-400 line-through">
                                {product.oldPrice} ج.م
                              </span>
                            )}
                        </div>

                        {/* Add / Quantity */}
                        {quantity === 0 ? (
                          <button
                            type="button"
                            onClick={() =>
                              handleAddToCart(product)
                            }
                            className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-700 text-white transition hover:bg-green-800"
                            aria-label={`إضافة ${product.name} للسلة`}
                          >
                            <Plus size={20} />
                          </button>
                        ) : (
                          <div className="flex items-center gap-1 rounded-xl border border-gray-200 bg-gray-50 p-1">

                            <button
                              type="button"
                              onClick={() =>
                                removeFromCart(
                                  product.id
                                )
                              }
                              className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-600 transition hover:bg-white"
                              aria-label="تقليل الكمية"
                            >
                              <Minus size={15} />
                            </button>

                            <span className="min-w-6 text-center text-sm font-extrabold">
                              {quantity}
                            </span>

                            <button
                              type="button"
                              onClick={() =>
                                handleAddToCart(product)
                              }
                              className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-100 text-green-700 transition hover:bg-green-200"
                              aria-label="زيادة الكمية"
                            >
                              <Plus size={15} />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

          ) : !loading ? (

            /* No Products */
            <div className="rounded-3xl border border-gray-100 bg-white py-16 text-center">
              <ShoppingCart
                size={42}
                className="mx-auto text-gray-300"
              />

              <h3 className="mt-4 text-lg font-extrabold text-gray-800">
                مفيش منتجات مطابقة
              </h3>

              <p className="mt-2 text-sm text-gray-500">
                جرّب تبحث باسم منتج مختلف أو اختار قسم تاني.
              </p>
            </div>

          ) : null}
        </div>

        {/* Sticky Cart */}
        {cartCount > 0 && (
          <div className="sticky bottom-4 z-30 mx-4 mt-8 sm:mx-auto sm:max-w-3xl">
            <div className="flex flex-col gap-3 rounded-2xl border border-gray-200 bg-white/95 p-4 shadow-2xl backdrop-blur sm:flex-row sm:items-center sm:justify-between">

              <div className="flex min-w-0 items-center gap-3">
                <div className="flex shrink-0 -space-x-2 space-x-reverse">

                  {cartItems.slice(0, 4).map((item) => {
                    const productImage =
                      item.image ||
                      item.imageUrl ||
                      "";

                    return (
                      <div
                        key={item.id}
                        className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-xl border-2 border-white bg-gray-100 shadow-sm"
                      >
                        {productImage ? (
                          <img
                            src={productImage}
                            alt={
                              item.name ||
                              "صورة المنتج"
                            }
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <ShoppingCart
                            size={19}
                            className="text-gray-400"
                          />
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="min-w-0">
                  <p className="truncate text-sm font-extrabold text-gray-900">
                    {cartCount} منتج في السلة
                  </p>

                  <p className="mt-1 text-xs text-gray-500">
                    إجمالي الطلب:{" "}
                    <span className="font-extrabold text-green-700">
                      {cartTotal} ج.م
                    </span>
                  </p>
                </div>
              </div>

              <button
                type="button"
                data-checkout-button
                onClick={openCheckout}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-700 px-6 py-3.5 text-sm font-extrabold text-white transition hover:bg-green-800 sm:w-auto"
              >
                إتمام الطلب
              </button>
            </div>
          </div>
        )}
      </section>
    </>
  );
}

export default Products;