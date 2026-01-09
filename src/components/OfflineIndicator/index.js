export default function OfflineIndicator({ isOnline }) {
  return (
    <div
      className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${
        isOnline
          ? "bg-green-100 text-green-700"
          : "bg-red-100 text-red-700 animate-pulse"
      }`}
    >
      <span
        className={`w-2 h-2 rounded-full ${
          isOnline ? "bg-green-500" : "bg-red-500"
        }`}
      ></span>
      {isOnline ? "online" : "Offline"}
    </div>
  );
}
