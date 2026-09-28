import {
  MapPin,
  Phone,
  Clock3,
  MessageCircle,
  ArrowUpLeft,
} from "lucide-react";

function Contact() {
  return (
    <section id="contact" className="bg-gray-950 py-16 text-white sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10 text-center">
          <span className="mb-3 inline-block rounded-full bg-green-500/10 px-4 py-2 text-sm font-bold text-green-400">
            تواصل معنا
          </span>

          <h2 className="text-2xl font-extrabold sm:text-4xl">
            محتاج مساعدة؟
          </h2>

          <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-gray-400 sm:text-base">
            تواصل مع هايبر المدينة المنورة للاستفسار عن المنتجات والعروض
            والطلبات.
          </p>
        </div>

        {/* Contact Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {/* Location */}
          <a
            href="https://www.google.com/maps/search/?api=1&query=QGG4%2BWC4%2C%20العصايدة%2C%20ديرب%20نجم%2C%20الشرقية"
            target="_blank"
            rel="noreferrer"
            className="block rounded-2xl border border-white/10 bg-white/5 p-6 text-right transition hover:bg-white/10"
          >
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-green-500/10 text-green-400">
              <MapPin size={24} />
            </div>

            <h3 className="text-lg font-extrabold">
              موقعنا
            </h3>

            <p className="mt-2 text-sm leading-7 text-gray-400">
              حلواني المدينة المنورة
              <br />
              العصايدة، ديرب نجم، الشرقية
            </p>

            <span className="mt-4 inline-block text-sm font-bold text-green-400">
              فتح الموقع على الخريطة ←
            </span>
          </a>

          {/* Phone */}
          <a
            href="tel:01119193323"
            dir="ltr"
            className="block rounded-2xl border border-white/10 bg-white/5 p-6 text-right transition hover:bg-white/10"
          >
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-green-500/10 text-green-400">
              <Phone size={24} />
            </div>

            <h3 dir="rtl" className="text-lg font-extrabold">
              اتصل بنا
            </h3>

            <p className="mt-2 text-sm text-gray-400">
              011 1919 3323
            </p>
          </a>

          {/* Working Hours */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:bg-white/10">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-green-500/10 text-green-400">
              <Clock3 size={24} />
            </div>

            <h3 className="text-lg font-extrabold">
              مواعيد العمل
            </h3>

            <p className="mt-2 text-sm leading-7 text-gray-400">
              يوميًا من 8 صباحًا حتى 12 منتصف الليل
            </p>
          </div>
        </div>

        {/* WhatsApp */}
        <div className="mt-6 overflow-hidden rounded-3xl border border-green-500/20 bg-green-500/10 p-6 sm:p-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-500 text-white">
                  <MessageCircle size={25} />
                </div>

                <div>
                  <h3 className="text-lg font-extrabold">
                    اطلب عن طريق واتساب
                  </h3>

                  <p className="mt-1 text-sm text-gray-400">
                    ابعتلنا استفسارك أو طلبك مباشرة.
                  </p>
                </div>
              </div>
            </div>

            <a
              href="https://wa.me/201119193323"
              target="_blank"
              rel="noreferrer"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 px-6 py-3.5 text-sm font-extrabold text-white transition hover:bg-green-500 sm:w-auto"
            >
              تواصل على واتساب
              <ArrowUpLeft size={18} />
            </a>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 border-t border-white/10 pt-6 text-center">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} هايبر المدينة المنورة — جميع الحقوق
            محفوظة
          </p>
        </div>
      </div>
    </section>
  );
}

export default Contact;