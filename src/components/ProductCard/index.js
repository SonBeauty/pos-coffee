export default function ProductCard({ product, onAddToCart }) {
  return (
    <div
      onClick={() => onAddToCart(product)}
      className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm hover:border-orange-300 hover:shadow-md transition-all cursor-pointer group active:scale-95 flex flex-col items-center text-center"
    >
      <div className="w-full h-32 bg-gray-50 rounded-xl mb-3 overflow-hidden flex items-center justify-center">
        <img
          src={product.img || "/images/default.png"}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
      </div>

      <h3 className="font-bold text-gray-800 leading-tight h-10 flex items-center justify-center">
        {product.name}
      </h3>

      <p className="text-orange-600 font-black text-lg mt-1">
        ${product.price.toFixed(2)}
      </p>

      <div className="mt-3 w-full py-2 bg-orange-50 text-orange-600 rounded-lg text-xs font-bold group-hover:bg-orange-600 group-hover:text-white transition-colors">
        Thêm vào đơn
      </div>
    </div>
  );
}
