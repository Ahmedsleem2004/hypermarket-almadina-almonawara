const categories = [
  {
    id: 1,
    name: "مشروبات وعصائر",
    description: "بيبسي، جهينة، عصائر ومياه",
    image:
      "https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: 2,
    name: "ألبان ومنتجات مبردة",
    description: "المراعي، جهينة، دومتي وأكثر",
    image:
      "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: 3,
    name: "سناكس وحلويات",
    description: "شيبسي، شوكولاتة، بسكويت وحلويات",
    image:
      "https://images.unsplash.com/photo-1600952841320-db92ec4047ca?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: 4,
    name: "بقالة ومعلبات",
    description: "أرز، مكرونة، زيت، سكر ومعلبات",
    image:
      "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: 5,
    name: "منظفات",
    description: "مساحيق، منظفات منزلية",
    image:
      "https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: 6,
    name: "عناية شخصية",
    description: "شامبو، صابون، عناية يومية",
    image:
      "https://images.unsplash.com/photo-1556228578-8c89e6adf883?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: 7,
    name: "صلصات وتوابل",
    description: "كاتشب، مايونيز، توابل وصوصات",
    image:
      "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: 8,
    name: "مخبوزات",
    description: "عيش، توست ومخبوزات متنوعة",
    image:
      "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=900&q=85",
  },
];

function Categories() {
  const handleCategoryClick = (categoryName) => {
    window.dispatchEvent(
      new CustomEvent("change-product-category", {
        detail: categoryName,
      })
    );

    setTimeout(() => {
      document.getElementById("products")?.scrollIntoView({
        behavior: "smooth",
      });
    }, 50);
  };

  return (
    <section id="categories" className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10 text-center">
          <span className="mb-3 inline-block rounded-full bg-green-100 px-4 py-2 text-sm font-bold text-green-700">
            أقسام الهايبر
          </span>

          <h2 className="text-2xl font-extrabold text-gray-900 sm:text-4xl">
            اختار القسم اللي محتاجه
          </h2>

          <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-gray-500 sm:text-base">
            كل منتجات البيت مجمعة في أقسام منظمة عشان تلاقي اللي محتاجه
            بسهولة.
          </p>
        </div>

        {/* Categories */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
          {categories.map((category) => (
            <button
              type="button"
              onClick={() => handleCategoryClick(category.name)}
              key={category.id}
              className="group relative min-h-[220px] overflow-hidden rounded-2xl bg-gray-900 text-right shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl sm:min-h-[280px]"
            >
              <img
                src={category.image}
                alt={category.name}
                className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-110"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

              <span className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-xs font-extrabold text-green-800">
                {String(category.id).padStart(2, "0")}
              </span>

              <div className="absolute bottom-0 right-0 left-0 p-4 sm:p-5">
                <h3 className="text-base font-extrabold text-white sm:text-xl">
                  {category.name}
                </h3>

                <p className="mt-2 text-xs leading-5 text-gray-200 sm:text-sm">
                  {category.description}
                </p>

                <span className="mt-3 inline-block text-xs font-bold text-green-300">
                  تصفح المنتجات ←
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Categories;