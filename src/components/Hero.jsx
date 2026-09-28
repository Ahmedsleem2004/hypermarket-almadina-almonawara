import { ArrowLeft, ShoppingCart, Sparkles } from "lucide-react";

function Hero() {
  return (
    <section
      id="home"
      className="relative min-h-[620px] overflow-hidden bg-gray-900"
    >
      {/* Background Image */}
      <img
        src="https://images.unsplash.com/photo-1604719312566-8912e9227c6a?auto=format&fit=crop&w=2000&q=85"
        alt="هايبر ماركت"
        className="absolute inset-0 h-full w-full object-cover"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/65" />

      <div className="absolute inset-0 bg-gradient-to-l from-green-950/80 via-green-900/30 to-black/40" />

      {/* Content */}
      <div className="relative z-10 mx-auto flex min-h-[620px] max-w-7xl items-center px-4 py-16 sm:px-6 lg:px-8">
        <div className="max-w-3xl text-white">

          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-bold backdrop-blur">
            <Sparkles size={17} className="text-green-400" />
            مرحبًا بكم في هايبر المدينة المنورة
          </div>

          <h1 className="text-4xl font-extrabold leading-tight sm:text-5xl lg:text-7xl">
            كل احتياجات بيتك
            <span className="block text-green-400">
              في مكان واحد
            </span>
          </h1>

          <p className="mt-6 max-w-2xl text-sm leading-8 text-gray-200 sm:text-lg">
            كل اللي محتاجه لبيتك من منتجات غذائية ومشروبات ومنظفات وعناية
            شخصية، بأسعار مناسبة وعروض مستمرة.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">

            <a
              href="#products"
              className="flex items-center justify-center gap-2 rounded-xl bg-green-600 px-7 py-4 text-sm font-extrabold text-white transition hover:bg-green-500"
            >
              <ShoppingCart size={19} />
              تسوق الآن
            </a>

            <a
              href="#offers"
              className="flex items-center justify-center gap-2 rounded-xl border border-white/30 bg-white/10 px-7 py-4 text-sm font-extrabold text-white backdrop-blur transition hover:bg-white/20"
            >
              شاهد العروض
              <ArrowLeft size={18} />
            </a>

          </div>

          {/* Features */}
          <div className="mt-10 grid max-w-2xl grid-cols-3 gap-3 sm:gap-5">

            <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
              <p className="text-sm font-extrabold">
                منتجات متنوعة
              </p>
              <p className="mt-1 text-xs text-gray-300">
                كل احتياجاتك
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
              <p className="text-sm font-extrabold">
                عروض مستمرة
              </p>
              <p className="mt-1 text-xs text-gray-300">
                أسعار مناسبة
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
              <p className="text-sm font-extrabold">
                طلب بسهولة
              </p>
              <p className="mt-1 text-xs text-gray-300">
                اطلب أونلاين
              </p>
            </div>

          </div>
        </div>
      </div>

      {/* Bottom Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent" />
    </section>
  );
}

export default Hero;