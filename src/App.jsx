import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Categories from "./components/Categories";
import Products from "./components/Products";
import Offers from "./components/Offers";
import Contact from "./components/Contact";
import Checkout from "./components/Checkout";
import { CartProvider, useCart } from "./components/CartContext";
import AdminApp from "./components/AdminApp";

function AppContent() {
  const { isCheckoutOpen, closeCheckout } = useCart();

  return (
    <div dir="rtl">
      {!isCheckoutOpen ? (
        <>
          <Navbar />

          <main>
            <Hero />
            <Categories />
            <Products />
            <Offers />
            <Contact />
          </main>
        </>
      ) : (
        <>
          <Checkout />

          <button
            type="button"
            onClick={closeCheckout}
            className="fixed right-4 top-4 z-50 rounded-xl bg-white px-4 py-2 text-sm font-bold text-gray-700 shadow-lg transition hover:bg-gray-100"
          >
            العودة
          </button>
        </>
      )}
    </div>
  );
}

function App() {
  const isAdminPage = window.location.pathname.startsWith("/admin");

  if (isAdminPage) {
    return <AdminApp />;
  }

  return (
    <CartProvider>
      <AppContent />
    </CartProvider>
  );
}

export default App;