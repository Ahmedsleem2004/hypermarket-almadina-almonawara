
import { useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  MapPin,
  Phone,
  User,
  MessageCircle,
} from "lucide-react";
import { useCart } from "./CartContext";

console.log("CHECKOUT FILE LOADED");

function Checkout() {
  const {
    cartItems,
    cartTotal,
    clearCart,
    closeCheckout,
  } = useCart();

  console.log("CART ITEMS:", cartItems);
  console.log(
    "CHECKOUT IMAGE:",
    cartItems?.[0]?.image
  );

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
  });

  const [orderSent, setOrderSent] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (cartItems.length === 0) {
      return;
    }

    const productsText = cartItems
      .map(
        (item) =>
          `• ${item.name} × ${item.quantity} = ${
            item.price * item.quantity
          } ج.م`
      )
      .join("\n");

    const message = `🛒 *طلب جديد - هايبر المدينة المنورة*

👤 *بيانات العميل*
الاسم: ${formData.name}
رقم الموبايل: ${formData.phone}
العنوان: ${formData.address}

📦 *المنتجات*
${productsText}

💰 *إجمالي الطلب: ${cartTotal} ج.م*

يرجى التواصل مع العميل لتأكيد الطلب.`;

    const whatsappUrl = `https://wa.me/201119193323?text=${encodeURIComponent(
      message
    )}`;

    window.open(whatsappUrl, "_blank");

    setOrderSent(true);
    clearCart();
  };

  if (orderSent) {
    return (
      <section className="min-h-screen bg-gray-50 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto flex min-h-[70vh] max-w-xl items-center justify-center">
          <div className="w-full rounded-3xl border border-gray-100 bg-white p-8 text-center shadow-sm sm:p-10">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
              <CheckCircle2
                size={42}
                className="text-green-700"
              />
            </div>

            <h1 className="mt-6 text-2xl font-extrabold text-gray-900 sm:text-3xl">
              تم تجهيز طلبك بنجاح
            </h1>

            <p className="mt-3 text-sm leading-7 text-gray-500">
              تم فتح واتساب برسالة الطلب.
              <br />
              ابعت الرسالة لتأكيد الطلب مع هايبر المدينة المنورة.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <a
                href="https://wa.me/201119193323"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-700 px-6 py-3.5 text-sm font-extrabold text-white transition hover:bg-green-800"
              >
                <MessageCircle size={19} />
                فتح واتساب
              </a>

              <button
                type="button"
                onClick={closeCheckout}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-6 py-3.5 text-sm font-extrabold text-gray-700 transition hover:bg-gray-50"
              >
                العودة للموقع
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-gray-50 px-4 py-10 sm:px-6 sm:py-16 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <button
            type="button"
            onClick={closeCheckout}
            className="mb-5 inline-flex items-center gap-2 text-sm font-bold text-green-700 transition hover:text-green-800"
          >
            <ArrowRight size={18} />
            العودة للموقع
          </button>

          <h1 className="text-2xl font-extrabold text-gray-900 sm:text-4xl">
            إتمام الطلب
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            اكتب بياناتك عشان نقدر نتواصل معاك لتأكيد الطلب.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
          {/* Customer Form */}
          <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm sm:p-7">
            <h2 className="text-lg font-extrabold text-gray-900">
              بيانات العميل
            </h2>

            <form
              onSubmit={handleSubmit}
              className="mt-6 space-y-5"
            >
              {/* Name */}
              <div>
                <label className="mb-2 block text-sm font-bold text-gray-700">
                  الاسم بالكامل
                </label>

                <div className="relative">
                  <User
                    size={19}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="اكتب اسمك بالكامل"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3.5 pr-12 pl-4 text-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-500/10"
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="mb-2 block text-sm font-bold text-gray-700">
                  رقم الموبايل
                </label>

                <div className="relative">
                  <Phone
                    size={19}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    placeholder="01xxxxxxxxx"
                    dir="ltr"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3.5 pr-12 pl-4 text-right text-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-500/10"
                  />
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="mb-2 block text-sm font-bold text-gray-700">
                  العنوان بالتفصيل
                </label>

                <div className="relative">
                  <MapPin
                    size={19}
                    className="absolute right-4 top-4 text-gray-400"
                  />

                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    rows="4"
                    placeholder="المحافظة، المنطقة، الشارع، رقم العمارة والشقة..."
                    className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 py-3.5 pr-12 pl-4 text-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-500/10"
                  />
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-700 py-4 text-sm font-extrabold text-white transition hover:bg-green-800"
              >
                <MessageCircle size={19} />
                تأكيد الطلب عبر واتساب
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="h-fit rounded-3xl border border-gray-100 bg-white p-5 shadow-sm sm:p-7">
            <h2 className="text-lg font-extrabold text-gray-900">
              ملخص الطلب
            </h2>

            <div className="mt-5 space-y-4">
              {cartItems.map((item) => {
                const productImage =
                  item.image || item.imageUrl || "";

                return (
                  <div
                    key={item.id}
                    className="border-b border-gray-100 pb-4"
                  >
                    <div className="flex items-center gap-3">
                      {/* Product Image */}
                      <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gray-100">
                        {productImage ? (
                          <img
                            src={productImage}
                            alt={item.name || "صورة المنتج"}
                            className="h-full w-full object-contain"
                            onError={(e) => {
                              e.currentTarget.style.display = "none";
                            }}
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center">
                            <span className="text-2xl">🛒</span>
                          </div>
                        )}
                      </div>

                      {/* Product Info */}
                      <div className="min-w-0 flex-1">
                        <h3 className="truncate text-sm font-bold text-gray-800">
                          {item.name}
                        </h3>

                        <p className="mt-1 text-xs text-gray-500">
                          {item.quantity} × {item.price} ج.م
                        </p>
                      </div>

                      {/* Total */}
                      <span className="shrink-0 text-sm font-extrabold text-green-700">
                        {item.price * item.quantity} ج.م
                      </span>
                    </div>

                    {/* TEST: show image URL */}
                    <div className="mt-3 rounded-lg bg-gray-50 p-2">
                      <p className="mb-1 text-xs font-bold text-gray-500">
                        رابط الصورة الموجود في السلة:
                      </p>

                      <p
                        dir="ltr"
                        className="break-all text-[10px] leading-4 text-gray-600"
                      >
                        {productImage || "لا يوجد رابط صورة"}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 border-t border-gray-100 pt-5">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-gray-500">
                  إجمالي الطلب
                </span>

                <span className="text-2xl font-extrabold text-green-700">
                  {cartTotal} ج.م
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Checkout;
