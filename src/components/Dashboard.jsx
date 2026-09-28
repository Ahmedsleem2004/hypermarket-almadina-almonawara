import {
  LayoutDashboard,
  Package,
  Plus,
  Search,
  Pencil,
  Trash2,
  Tag,
  LogOut,
  ImagePlus,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { signOut } from "firebase/auth";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
  getFirestore,
} from "firebase/firestore";
import { auth } from "../firebase";
import app from "../firebase";

const db = getFirestore(app);

const CLOUDINARY_CLOUD_NAME = "fcf3coqo";
const CLOUDINARY_UPLOAD_PRESET = "hypermarket";

const categories = [
  "مشروبات وعصائر",
  "ألبان ومنتجات مبردة",
  "سناكس وحلويات",
  "بقالة ومعلبات",
  "منظفات",
  "عناية شخصية",
  "صلصات وتوابل",
  "مخبوزات",
];

function Dashboard() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("الكل");

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    category: categories[0],
    price: "",
    oldPrice: "",
    description: "",
    image: "",
    isOffer: false,
  });

  // تسجيل الخروج
  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout error:", error);
      alert("حصل خطأ أثناء تسجيل الخروج.");
    }
  };

  // تحميل المنتجات من Firestore
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);

        const snapshot = await getDocs(
          collection(db, "products")
        );

        const data = snapshot.docs.map((item) => ({
          id: item.id,
          ...item.data(),
        }));

        setProducts(data);
      } catch (error) {
        console.error(
          "Error loading dashboard products:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory =
        activeCategory === "الكل" ||
        product.category === activeCategory;

      const searchValue = searchTerm
        .trim()
        .toLowerCase();

      const matchesSearch =
        searchValue === "" ||
        product.name?.toLowerCase().includes(searchValue) ||
        product.category?.toLowerCase().includes(searchValue);

      return matchesCategory && matchesSearch;
    });
  }, [products, activeCategory, searchTerm]);

  const resetForm = () => {
    setFormData({
      name: "",
      category: categories[0],
      price: "",
      oldPrice: "",
      description: "",
      image: "",
      isOffer: false,
    });

    setSelectedImage(null);
    setImagePreview("");
    setUploadingImage(false);
    setEditingProduct(null);
  };

  const handleOpenAdd = () => {
    resetForm();
    setIsFormOpen(true);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);

    setFormData({
      name: product.name || "",
      category: product.category || categories[0],
      price: product.price ?? "",
      oldPrice: product.oldPrice ?? "",
      description: product.description || "",
      image: product.image || "",
      isOffer: product.isOffer || false,
    });

    setSelectedImage(null);
    setImagePreview(product.image || "");
    setIsFormOpen(true);
  };

  // اختيار صورة من الجهاز + Preview
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      alert("من فضلك اختر صورة JPG أو PNG أو WEBP.");
      e.target.value = "";
      return;
    }

    const maxSize = 5 * 1024 * 1024;

    if (file.size > maxSize) {
      alert("حجم الصورة يجب ألا يتجاوز 5 ميجابايت.");
      e.target.value = "";
      return;
    }

    setSelectedImage(file);

    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
  };

  // رفع الصورة إلى Cloudinary
  const uploadImageToCloudinary = async (file) => {
    if (!file) {
      return formData.image || "https://placehold.co/600x600";
    }

    const uploadData = new FormData();

    uploadData.append("file", file);
    uploadData.append(
      "upload_preset",
      CLOUDINARY_UPLOAD_PRESET
    );

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: uploadData,
      }
    );

    const data = await response.json();

    if (!response.ok || !data.secure_url) {
      console.error("Cloudinary upload error:", data);
      throw new Error("فشل رفع الصورة.");
    }

    return data.secure_url;
  };

  // حذف منتج من Firestore
  const handleDelete = async (id) => {
    const product = products.find(
      (item) => item.id === id
    );

    if (!product) {
      return;
    }

    const confirmed = window.confirm(
      `هل أنت متأكد من حذف "${product.name}"؟`
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteDoc(doc(db, "products", id));

      setProducts((prev) =>
        prev.filter((item) => item.id !== id)
      );
    } catch (error) {
      console.error(
        "Error deleting product:",
        error
      );

      alert("حصل خطأ أثناء حذف المنتج.");
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? checked : value,
    }));
  };

  // إضافة أو تعديل منتج في Firestore
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.name.trim() ||
      !formData.price
    ) {
      return;
    }

    try {
      setUploadingImage(true);

      let imageUrl = formData.image;

      // لو المستخدم اختار صورة جديدة، ارفعها إلى Cloudinary
      if (selectedImage) {
        imageUrl = await uploadImageToCloudinary(
          selectedImage
        );
      }

      const productData = {
        name: formData.name.trim(),
        category: formData.category,
        price: Number(formData.price),
        oldPrice: formData.oldPrice
          ? Number(formData.oldPrice)
          : null,
        description:
          formData.description.trim(),
        image:
          imageUrl?.trim() ||
          "https://placehold.co/600x600",
        isOffer: formData.isOffer,
      };

      if (editingProduct) {
        await updateDoc(
          doc(db, "products", editingProduct.id),
          productData
        );

        setProducts((prev) =>
          prev.map((product) =>
            product.id === editingProduct.id
              ? {
                  ...product,
                  ...productData,
                }
              : product
          )
        );
      } else {
        const newProduct = await addDoc(
          collection(db, "products"),
          productData
        );

        setProducts((prev) => [
          {
            id: newProduct.id,
            ...productData,
          },
          ...prev,
        ]);
      }

      setIsFormOpen(false);
      resetForm();
    } catch (error) {
      console.error(
        "Error saving product:",
        error
      );

      alert(
        error.message ||
          "حصل خطأ أثناء حفظ المنتج."
      );
    } finally {
      setUploadingImage(false);
    }
  };

  const removeSelectedImage = () => {
    setSelectedImage(null);

    if (editingProduct?.image) {
      setImagePreview(editingProduct.image);
    } else {
      setImagePreview("");
    }
  };

  const totalProducts = products.length;

  const offerProducts = products.filter(
    (product) => product.isOffer
  ).length;

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-gray-100 text-gray-900"
    >
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-gray-200 bg-white">
        <div className="mx-auto flex h-20 max-w-[1500px] items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-700 text-white">
              <LayoutDashboard size={22} />
            </div>

            <div>
              <h1 className="text-lg font-extrabold text-gray-900">
                لوحة تحكم الهايبر
              </h1>

              <p className="text-xs text-gray-500">
                هايبر المدينة المنورة
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="hidden items-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-bold text-gray-600 transition hover:bg-gray-50 sm:flex"
          >
            <LogOut size={17} />
            تسجيل الخروج
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        {/* Page Header */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-bold text-green-700">
              لوحة التحكم
            </p>

            <h2 className="mt-1 text-2xl font-extrabold text-gray-900 sm:text-3xl">
              إدارة المنتجات
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              أضف وعدّل منتجات الهايبر بسهولة.
            </p>
          </div>

          <button
            type="button"
            onClick={handleOpenAdd}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-700 px-5 py-3.5 text-sm font-extrabold text-white transition hover:bg-green-800 sm:w-auto"
          >
            <Plus size={19} />
            إضافة منتج
          </button>
        </div>

        {/* Statistics */}
        <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-3">
          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-gray-500">
                  إجمالي المنتجات
                </p>

                <p className="mt-2 text-2xl font-extrabold text-gray-900">
                  {totalProducts}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-100 text-green-700">
                <Package size={21} />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-gray-500">
                  المنتجات عليها عروض
                </p>

                <p className="mt-2 text-2xl font-extrabold text-red-600">
                  {offerProducts}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-100 text-red-600">
                <Tag size={21} />
              </div>
            </div>
          </div>

          <div className="col-span-2 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm lg:col-span-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-gray-500">
                  الأقسام
                </p>

                <p className="mt-2 text-2xl font-extrabold text-blue-600">
                  {categories.length}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                <LayoutDashboard size={21} />
              </div>
            </div>
          </div>
        </div>

        {/* Products */}
        <section className="rounded-3xl border border-gray-100 bg-white shadow-sm">
          <div className="border-b border-gray-100 p-5 sm:p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <h3 className="text-lg font-extrabold text-gray-900">
                المنتجات
              </h3>

              <div className="relative w-full lg:max-w-sm">
                <Search
                  size={19}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) =>
                    setSearchTerm(e.target.value)
                  }
                  placeholder="ابحث عن منتج..."
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pr-11 pl-4 text-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-500/10"
                />
              </div>
            </div>

            <div className="mt-5 flex gap-2 overflow-x-auto pb-1">
              <button
                type="button"
                onClick={() =>
                  setActiveCategory("الكل")
                }
                className={`shrink-0 rounded-xl px-4 py-2 text-xs font-bold transition ${
                  activeCategory === "الكل"
                    ? "bg-green-700 text-white"
                    : "border border-gray-200 bg-white text-gray-600"
                }`}
              >
                الكل
              </button>

              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() =>
                    setActiveCategory(category)
                  }
                  className={`shrink-0 rounded-xl px-4 py-2 text-xs font-bold transition ${
                    activeCategory === category
                      ? "bg-green-700 text-white"
                      : "border border-gray-200 bg-white text-gray-600"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="grid gap-4 p-5 sm:grid-cols-2 lg:hidden">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="h-28 animate-pulse rounded-2xl bg-gray-100"
                />
              ))}
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden overflow-x-auto lg:block">
                <table className="w-full text-right">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-xs font-extrabold text-gray-500">
                        المنتج
                      </th>

                      <th className="px-6 py-4 text-xs font-extrabold text-gray-500">
                        القسم
                      </th>

                      <th className="px-6 py-4 text-xs font-extrabold text-gray-500">
                        السعر
                      </th>

                      <th className="px-6 py-4 text-xs font-extrabold text-gray-500">
                        العرض
                      </th>

                      <th className="px-6 py-4 text-xs font-extrabold text-gray-500">
                        الإجراءات
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredProducts.map(
                      (product) => (
                        <tr
                          key={product.id}
                          className="border-t border-gray-100"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={product.image}
                                alt={product.name}
                                className="h-14 w-14 rounded-xl object-cover"
                              />

                              <div>
                                <p className="text-sm font-extrabold text-gray-900">
                                  {product.name}
                                </p>

                                <p className="mt-1 max-w-xs truncate text-xs text-gray-500">
                                  {product.description}
                                </p>
                              </div>
                            </div>
                          </td>

                          <td className="px-6 py-4 text-sm font-bold text-gray-600">
                            {product.category}
                          </td>

                          <td className="px-6 py-4">
                            <p className="text-sm font-extrabold text-green-700">
                              {product.price} ج.م
                            </p>

                            {product.oldPrice && (
                              <p className="mt-1 text-xs text-gray-400 line-through">
                                {product.oldPrice} ج.م
                              </p>
                            )}
                          </td>

                          <td className="px-6 py-4">
                            {product.isOffer ? (
                              <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-extrabold text-red-600">
                                عرض
                              </span>
                            ) : (
                              <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-bold text-gray-500">
                                عادي
                              </span>
                            )}
                          </td>

                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() =>
                                  handleEdit(
                                    product
                                  )
                                }
                                className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600 transition hover:bg-blue-100"
                                aria-label="تعديل المنتج"
                              >
                                <Pencil size={16} />
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  handleDelete(
                                    product.id
                                  )
                                }
                                className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-50 text-red-600 transition hover:bg-red-100"
                                aria-label="حذف المنتج"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="space-y-3 p-4 lg:hidden">
                {filteredProducts.map(
                  (product) => (
                    <div
                      key={product.id}
                      className="rounded-2xl border border-gray-100 bg-gray-50 p-4"
                    >
                      <div className="flex gap-3">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="h-20 w-20 shrink-0 rounded-xl object-cover"
                        />

                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <h4 className="text-sm font-extrabold text-gray-900">
                                {product.name}
                              </h4>

                              <p className="mt-1 text-xs text-gray-500">
                                {product.category}
                              </p>
                            </div>

                            {product.isOffer && (
                              <span className="shrink-0 rounded-full bg-red-100 px-2 py-1 text-[10px] font-extrabold text-red-600">
                                عرض
                              </span>
                            )}
                          </div>

                          <div className="mt-3 flex items-center justify-between">
                            <div>
                              <span className="text-sm font-extrabold text-green-700">
                                {product.price} ج.م
                              </span>

                              {product.oldPrice && (
                                <span className="mr-2 text-xs text-gray-400 line-through">
                                  {product.oldPrice} ج.م
                                </span>
                              )}
                            </div>

                            <div className="flex gap-2">
                              <button
                                type="button"
                                onClick={() =>
                                  handleEdit(
                                    product
                                  )
                                }
                                className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600"
                                aria-label="تعديل المنتج"
                              >
                                <Pencil size={16} />
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  handleDelete(
                                    product.id
                                  )
                                }
                                className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-50 text-red-600"
                                aria-label="حذف المنتج"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                )}
              </div>
            </>
          )}

          {!loading &&
            filteredProducts.length === 0 && (
              <div className="px-5 py-16 text-center">
                <Package
                  size={42}
                  className="mx-auto text-gray-300"
                />

                <h3 className="mt-4 text-lg font-extrabold text-gray-800">
                  مفيش منتجات
                </h3>

                <p className="mt-2 text-sm text-gray-500">
                  مفيش منتجات مطابقة للبحث الحالي.
                </p>
              </div>
            )}
        </section>
      </main>

      {/* Add / Edit Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white shadow-2xl">
            <div className="border-b border-gray-100 p-5 sm:p-6">
              <h2 className="text-xl font-extrabold text-gray-900">
                {editingProduct
                  ? "تعديل المنتج"
                  : "إضافة منتج جديد"}
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                اكتب بيانات المنتج الأساسية.
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-5 p-5 sm:p-6"
            >
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="mb-2 block text-sm font-bold text-gray-700">
                    اسم المنتج
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="مثال: بيبسي كانز"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-500/10"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-bold text-gray-700">
                    القسم
                  </label>

                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm outline-none focus:border-green-500"
                  >
                    {categories.map(
                      (category) => (
                        <option
                          key={category}
                          value={category}
                        >
                          {category}
                        </option>
                      )
                    )}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-bold text-gray-700">
                    السعر
                  </label>

                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    required
                    min="0"
                    placeholder="0"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm outline-none transition focus:border-green-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-bold text-gray-700">
                    السعر القديم
                  </label>

                  <input
                    type="number"
                    name="oldPrice"
                    value={formData.oldPrice}
                    onChange={handleChange}
                    min="0"
                    placeholder="اختياري"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm outline-none transition focus:border-green-500"
                  />
                </div>

                {/* Image Upload */}
                <div className="sm:col-span-2">
                  <label className="mb-2 block text-sm font-bold text-gray-700">
                    صورة المنتج
                  </label>

                  <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-4">
                    {imagePreview ? (
                      <div className="relative overflow-hidden rounded-xl">
                        <img
                          src={imagePreview}
                          alt="معاينة صورة المنتج"
                          className="h-56 w-full object-contain bg-white"
                        />

                        <button
                          type="button"
                          onClick={removeSelectedImage}
                          className="absolute left-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white text-red-600 shadow-md transition hover:bg-red-50"
                          aria-label="إزالة الصورة"
                        >
                          <X size={18} />
                        </button>
                      </div>
                    ) : (
                      <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl bg-white px-5 py-10 text-center transition hover:bg-gray-50">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-green-100 text-green-700">
                          <ImagePlus size={26} />
                        </div>

                        <p className="mt-4 text-sm font-extrabold text-gray-800">
                          اختر صورة المنتج
                        </p>

                        <p className="mt-1 text-xs text-gray-500">
                          JPG أو PNG أو WEBP — بحد أقصى 5MB
                        </p>

                        <input
                          type="file"
                          accept="image/jpeg,image/jpg,image/png,image/webp"
                          onChange={handleImageChange}
                          className="hidden"
                        />
                      </label>
                    )}

                    {imagePreview && (
                      <label className="mt-3 flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-bold text-gray-700 transition hover:bg-gray-50">
                        <ImagePlus size={18} />
                        اختيار صورة أخرى

                        <input
                          type="file"
                          accept="image/jpeg,image/jpg,image/png,image/webp"
                          onChange={handleImageChange}
                          className="hidden"
                        />
                      </label>
                    )}

                    {selectedImage && (
                      <p className="mt-3 text-center text-xs font-bold text-green-700">
                        تم اختيار: {selectedImage.name}
                      </p>
                    )}
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="mb-2 block text-sm font-bold text-gray-700">
                    وصف المنتج
                  </label>

                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="3"
                    placeholder="اكتب وصفًا مختصرًا للمنتج..."
                    className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm outline-none transition focus:border-green-500"
                  />
                </div>
              </div>

              <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 p-4">
                <input
                  type="checkbox"
                  name="isOffer"
                  checked={formData.isOffer}
                  onChange={handleChange}
                  className="h-5 w-5 accent-green-700"
                />

                <div>
                  <p className="text-sm font-extrabold text-gray-800">
                    المنتج عليه عرض
                  </p>

                  <p className="mt-1 text-xs text-gray-500">
                    سيظهر عليه علامة عرض في الموقع.
                  </p>
                </div>
              </label>

              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  disabled={uploadingImage}
                  onClick={() => {
                    setIsFormOpen(false);
                    resetForm();
                  }}
                  className="rounded-xl border border-gray-200 bg-white px-6 py-3.5 text-sm font-bold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  إلغاء
                </button>

                <button
                  type="submit"
                  disabled={uploadingImage}
                  className="rounded-xl bg-green-700 px-6 py-3.5 text-sm font-extrabold text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {uploadingImage
                    ? "جاري رفع الصورة..."
                    : editingProduct
                    ? "حفظ التعديلات"
                    : "إضافة المنتج"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;