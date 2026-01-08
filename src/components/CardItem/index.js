export default function CartItem({ item, onUpdateQuantity, onUpdateNotes }) {
  const { product, quantity, notes } = item;

  return (
    <div className="flex flex-col border-b border-gray-100 py-3 gap-1">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h4 className="font-semibold text-gray-800">{product.name}</h4>
          <span className="text-xs text-gray-500">
            ${product.price.toFixed(2)} / món
          </span>
        </div>

        <div className="flex items-center bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => onUpdateQuantity(product.id, quantity - 1)}
            className="w-8 h-8 flex items-center justify-center bg-white rounded shadow-sm text-lg font-bold"
          >
            -
          </button>
          <span className="px-3 font-bold text-gray-700 w-8 text-center">
            {quantity}
          </span>
          <button
            onClick={() => onUpdateQuantity(product.id, quantity + 1)}
            className="w-8 h-8 flex items-center justify-center bg-white rounded shadow-sm text-lg font-bold"
          >
            +
          </button>
        </div>
      </div>

      <input
        type="text"
        placeholder="Ghi chú (ít đá, không đường...)"
        value={notes}
        onChange={(e) => onUpdateNotes(product.id, e.target.value)}
        className="text-xs italic text-gray-500 bg-transparent border-none focus:ring-0 p-0"
      />
    </div>
  );
}
