export default function CategoryList({
  categories,
  selectedCategory,
  onSelectCategory,
}) {
  return (
    <div className="flex flex-col gap-2 p-4 bg-gray-100 h-full border-r border-gray-200">
      <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
        Danh mục
      </h2>
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onSelectCategory(cat.id)}
          className={`px-4 py-3 rounded-xl text-left font-medium transition-all ${
            selectedCategory === cat.id
              ? "bg-orange-500 text-white shadow-lg shadow-orange-200 translate-x-1"
              : "bg-white text-gray-700 hover:bg-orange-50"
          }`}
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
}
