import {
  Menu,
  ShoppingCart,
  X,
  Search,
  Trash2,
  Plus,
  Minus,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useCart } from "./CartContext";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  // Search
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const {
    cartItems,
    cartCount,
    cartTotal,
    addToCart,
    removeFromCart,
    deleteFromCart,
    openCheckout,
  } = useCart();

  // Detect current section while scrolling
  useEffect(() => {
    const sections = [
      { id: "home", nav: "home" },
      { id: "categories", nav: "categories" },
      { id: "products", nav: "products" },
      { id: "offers", nav: "offers" },
      { id: "contact", nav: "contact" },
    ];

    const handleScroll = () => {
      const scrollPosition = window.scrollY + 140;

      let currentSection = "home";

      for (const section of sections) {
        const element = document.getElementById(section.id);

        if (!element) {
          continue;
        }

        if (scrollPosition >= element.offsetTop) {
          currentSection = section.nav;
        }
      }

      setActiveSection(currentSection);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleNavClick = (section) => {
    setActiveSection(section);
    setIsOpen(false);
  };

  // Search
  const handleSearch = (value) => {
    setSearchQuery(value);

    window.dispatchEvent(
      new CustomEvent("product-search", {
        detail: value,
      })
    );

    // يروح لقسم المنتجات أول ما يبدأ البحث
    if (value.trim() !== "") {
      const productsSection =
        document.getElementById("products");

      if (productsSection) {
        productsSection.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }

      setActiveSection("products");
    }
  };

  const handleSearchButton = () => {
    setIsSearchOpen((prev) => {
      const newState = !prev;

      if (!newState) {
        setSearchQuery("");

        window.dispatchEvent(
          new CustomEvent("product-search", {
            detail: "",
          })
        );
      }

      return newState;
    });
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      return;
    }

    setIsCartOpen(false);
    openCheckout();
  };

  const navLinkClass = (section) =>
    `group relative py-2 text-sm font-bold transition-colors duration-300 ${
      activeSection === section
        ? "text-green-700"
        : "text-gray-700 hover:text-green-700"
    }`;

  return (
    <>
      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <a
            href="#home"
            onClick={() => handleNavClick("home")}
            className="text-xl font-extrabold text-green-700 sm:text-2xl"
          >
            هايبر المدينة المنورة
          </a>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-7 lg:flex">
            {/* Home */}
            <a
              href="#home"
              onClick={() => handleNavClick("home")}
              className={navLinkClass("home")}
            >
              الرئيسية

              <span
                className={`absolute bottom-0 left-0 h-0.5 rounded-full bg-green-700 transition-all duration-300 ${
                  activeSection === "home"
                    ? "w-full"
                    : "w-0 group-hover:w-full"
                }`}
              />
            </a>

            {/* Categories */}
            <a
              href="#categories"
              onClick={() => handleNavClick("categories")}
              className={navLinkClass("categories")}
            >
              الأقسام

              <span
                className={`absolute bottom-0 left-0 h-0.5 rounded-full bg-green-700 transition-all duration-300 ${
                  activeSection === "categories"
                    ? "w-full"
                    : "w-0 group-hover:w-full"
                }`}
              />
            </a>

            {/* Products */}
            <a
              href="#products"
              onClick={() => handleNavClick("products")}
              className={navLinkClass("products")}
            >
              المنتجات

              <span
                className={`absolute bottom-0 left-0 h-0.5 rounded-full bg-green-700 transition-all duration-300 ${
                  activeSection === "products"
                    ? "w-full"
                    : "w-0 group-hover:w-full"
                }`}
              />
            </a>

            {/* Offers */}
            <a
              href="#offers"
              onClick={() => handleNavClick("offers")}
              className={navLinkClass("offers")}
            >
              العروض

              <span
                className={`absolute bottom-0 left-0 h-0.5 rounded-full bg-green-700 transition-all duration-300 ${
                  activeSection === "offers"
                    ? "w-full"
                    : "w-0 group-hover:w-full"
                }`}
              />
            </a>

            {/* Contact */}
            <a
              href="#contact"
              onClick={() => handleNavClick("contact")}
              className={navLinkClass("contact")}
            >
              اتصل بنا

              <span
                className={`absolute bottom-0 left-0 h-0.5 rounded-full bg-green-700 transition-all duration-300 ${
                  activeSection === "contact"
                    ? "w-full"
                    : "w-0 group-hover:w-full"
                }`}
              />
            </a>
          </div>

          {/* Desktop Actions */}
          <div className="hidden items-center gap-3 sm:flex">
            {/* Search */}
            <div className="relative">
              {isSearchOpen && (
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) =>
                    handleSearch(e.target.value)
                  }
                  autoFocus
                  placeholder="ابحث عن منتج..."
                  className="absolute left-0 top-14 z-50 w-72 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 shadow-lg outline-none focus:border-green-500"
                />
              )}

              <button
                type="button"
                onClick={handleSearchButton}
                className="flex h-11 w-11 items-center justify-center rounded-xl border border-gray-200 text-gray-700 transition hover:border-green-200 hover:bg-green-50 hover:text-green-700"
                aria-label="بحث"
              >
                {isSearchOpen ? (
                  <X size={20} />
                ) : (
                  <Search size={20} />
                )}
              </button>
            </div>

            {/* Cart */}
            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              className="relative flex h-11 items-center gap-2 rounded-xl bg-green-700 px-4 text-white transition hover:bg-green-800"
            >
              <ShoppingCart size={20} />

              <span className="text-sm font-bold">
                السلة
              </span>

              {cartCount > 0 && (
                <span className="absolute -right-2 -top-2 flex h-6 min-w-6 items-center justify-center rounded-full bg-red-600 px-1 text-xs font-extrabold text-white">
                  {cartCount}
                </span>
              )}
            </button>
          </div>

          {/* Mobile Actions */}
          <div className="flex items-center gap-2 sm:hidden">
            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-green-700 text-white"
              aria-label="السلة"
            >
              <ShoppingCart size={19} />

              {cartCount > 0 && (
                <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-extrabold text-white">
                  {cartCount}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 text-gray-700"
              aria-label="القائمة"
            >
              {isOpen ? <X size={21} /> : <Menu size={21} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`overflow-hidden border-t border-gray-100 bg-white transition-all duration-300 lg:hidden ${
            isOpen
              ? "max-h-96 opacity-100"
              : "max-h-0 opacity-0"
          }`}
        >
          <div className="mx-auto flex max-w-7xl flex-col px-4 py-3 sm:px-6">
            <a
              href="#home"
              onClick={() => handleNavClick("home")}
              className="border-b border-gray-100 py-4 text-sm font-bold text-gray-700 transition hover:bg-green-50 hover:text-green-700"
            >
              الرئيسية
            </a>

            <a
              href="#categories"
              onClick={() =>
                handleNavClick("categories")
              }
              className="border-b border-gray-100 py-4 text-sm font-bold text-gray-700 transition hover:bg-green-50 hover:text-green-700"
            >
              الأقسام
            </a>

            <a
              href="#products"
              onClick={() => handleNavClick("products")}
              className="border-b border-gray-100 py-4 text-sm font-bold text-gray-700 transition hover:bg-green-50 hover:text-green-700"
            >
              المنتجات
            </a>

            <a
              href="#offers"
              onClick={() => handleNavClick("offers")}
              className="border-b border-gray-100 py-4 text-sm font-bold text-gray-700 transition hover:bg-green-50 hover:text-green-700"
            >
              العروض
            </a>

            <a
              href="#contact"
              onClick={() => handleNavClick("contact")}
              className="py-4 text-sm font-bold text-gray-700 transition hover:bg-green-50 hover:text-green-700"
            >
              اتصل بنا
            </a>
          </div>
        </div>
      </nav>

      {/* Cart Drawer */}
      <div
        className={`fixed inset-0 z-[60] transition-opacity duration-500 ${
          isCartOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
      >
        {/* Backdrop */}
        <button
          type="button"
          onClick={() => setIsCartOpen(false)}
          className="absolute inset-0 h-full w-full bg-black/50 backdrop-blur-[3px]"
          aria-label="إغلاق السلة"
        />

        {/* Drawer */}
        <aside
          className={`absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-white shadow-2xl transition-transform duration-500 ease-out ${
            isCartOpen
              ? "translate-x-0"
              : "translate-x-full"
          }`}
        >
          {/* Cart Header */}
          <div className="flex items-center justify-between border-b border-gray-100 px-5 py-5">
            <div>
              <h2 className="text-lg font-extrabold text-gray-900">
                سلة المشتريات
              </h2>

              <p className="mt-1 text-xs text-gray-500">
                {cartCount} منتج في السلة
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsCartOpen(false)}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 text-gray-600 transition hover:bg-gray-200"
              aria-label="إغلاق"
            >
              <X size={20} />
            </button>
          </div>

          {/* Cart Content */}
          <div className="flex-1 overflow-y-auto px-5 py-5">
            {cartItems.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center text-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-50">
                  <ShoppingCart
                    size={34}
                    className="text-green-700"
                  />
                </div>

                <h3 className="mt-5 text-lg font-extrabold text-gray-900">
                  السلة فاضية
                </h3>

                <p className="mt-2 max-w-xs text-sm leading-6 text-gray-500">
                  أضف المنتجات اللي محتاجها للسلة وابدأ طلبك بسهولة.
                </p>

                <button
                  type="button"
                  onClick={() => {
                    setIsCartOpen(false);

                    setTimeout(() => {
                      document
                        .getElementById("products")
                        ?.scrollIntoView({
                          behavior: "smooth",
                        });
                    }, 100);
                  }}
                  className="mt-6 rounded-xl bg-green-700 px-6 py-3 text-sm font-extrabold text-white transition hover:bg-green-800"
                >
                  تصفح المنتجات
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-2xl border border-gray-100 bg-gray-50 p-4"
                  >
                    <div className="flex gap-3">
                      {/* Product Image */}
                      <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gray-100">
                        {item.image || item.imageUrl ? (
                          <img
                            src={
                              item.image ||
                              item.imageUrl
                            }
                            alt={
                              item.name ||
                              "صورة المنتج"
                            }
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <ShoppingCart
                            size={24}
                            className="text-gray-400"
                          />
                        )}
                      </div>

                      {/* Product Info */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="text-sm font-extrabold text-gray-800">
                            {item.name}
                          </h3>

                          <button
                            type="button"
                            onClick={() =>
                              deleteFromCart(item.id)
                            }
                            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-gray-400 transition hover:bg-red-50 hover:text-red-600"
                            aria-label={`حذف ${item.name}`}
                          >
                            <Trash2 size={17} />
                          </button>
                        </div>

                        <p className="mt-1 text-sm font-bold text-green-700">
                          {item.price} ج.م
                        </p>

                        {/* Quantity */}
                        <div className="mt-3 flex items-center justify-between">
                          <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white p-1">
                            <button
                              type="button"
                              onClick={() =>
                                removeFromCart(item.id)
                              }
                              className="flex h-7 w-7 items-center justify-center rounded-md text-gray-600 transition hover:bg-gray-100"
                              aria-label="تقليل الكمية"
                            >
                              <Minus size={15} />
                            </button>

                            <span className="min-w-6 text-center text-sm font-extrabold">
                              {item.quantity}
                            </span>

                            <button
                              type="button"
                              onClick={() =>
                                addToCart(item)
                              }
                              className="flex h-7 w-7 items-center justify-center rounded-md bg-green-50 text-green-700 transition hover:bg-green-100"
                              aria-label="زيادة الكمية"
                            >
                              <Plus size={15} />
                            </button>
                          </div>

                          <span className="text-sm font-extrabold text-gray-900">
                            {item.price *
                              item.quantity}{" "}
                            ج.م
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Cart Footer */}
          {cartItems.length > 0 && (
            <div className="border-t border-gray-100 bg-white p-5">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-sm font-bold text-gray-500">
                  الإجمالي
                </span>

                <span className="text-xl font-extrabold text-green-700">
                  {cartTotal} ج.م
                </span>
              </div>

              <button
                type="button"
                onClick={handleCheckout}
                className="w-full rounded-xl bg-green-700 py-4 text-sm font-extrabold text-white transition hover:bg-green-800"
              >
                إتمام الطلب
              </button>
            </div>
          )}
        </aside>
      </div>
    </>
  );
}

export default Navbar;