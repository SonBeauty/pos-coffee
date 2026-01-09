// pages/index.js
"use client";
import { useState, useEffect } from "react";
import CategoryList from "@/components/CategoryList";
import CartItem from "@/components/CardItem";
import { db } from "@/lib/indexedDB"; // IndexedDB instance
import { sendInvoiceToServer } from "../lib/api"; // API to backend
import Image from "next/image";
import Header from "@/components/Header";

const categories = [
  { id: "coffee", name: "Coffee" },
  { id: "tea", name: "Tea" },
  { id: "pastries", name: "Pastries" },
  { id: "snacks", name: "Snacks" },
];

const products = {
  coffee: [
    { id: "c1", name: "Espresso", price: 3.5, img: "/images/espresso.jpg" },
    { id: "c2", name: "Latte", price: 5.1, img: "/images/latte.jpg" },
    { id: "c3", name: "Cold Brew", price: 5.5, img: "/images/coldbrew.jpg" },
  ],
  tea: [
    { id: "t1", name: "Black Tea", price: 4.0, img: "/images/blacktea.jpg" },
    { id: "t2", name: "Green Tea", price: 4.0, img: "/images/greentea.jpg" },
  ],
  pastries: [
    { id: "p1", name: "Croissant", price: 3.0, img: "/images/croissant.jpg" },
    { id: "p2", name: "Muffin", price: 3.2, img: "/images/muffin.jpg" },
  ],
  snacks: [{ id: "s1", name: "Cookie", price: 2.5, img: "/images/cookie.png" }],
};

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState("coffee");
  const [cart, setCart] = useState([]); // { product, quantity, notes }
  const [isOnline, setIsOnline] = useState(true);

  // --- Đồng bộ Offline ---
  useEffect(() => {
    const handleOnlineStatusChange = () => {
      setIsOnline(navigator.onLine);
      if (navigator.onLine) {
        syncPendingInvoices();
      }
    };

    window.addEventListener("online", handleOnlineStatusChange);
    window.addEventListener("offline", handleOnlineStatusChange);

    // Kiểm tra trạng thái mạng ban đầu
    setIsOnline(navigator.onLine);
    if (navigator.onLine) {
      syncPendingInvoices();
    }

    return () => {
      window.removeEventListener("online", handleOnlineStatusChange);
      window.removeEventListener("offline", handleOnlineStatusChange);
    };
  }, []);

  const syncPendingInvoices = async () => {
    console.log("Đang kiểm tra hóa đơn chờ đồng bộ...");
    try {
      const pendingInvoices = await db.pendingInvoices.toArray();
      if (pendingInvoices.length > 0) {
        for (const invoice of pendingInvoices) {
          console.log("Đồng bộ hóa đơn:", invoice);
          await sendInvoiceToServer(invoice);
          await db.pendingInvoices.delete(invoice.id);
        }
        alert("Đã đồng bộ các hóa đơn ngoại tuyến thành công!");
      }
    } catch (error) {
      console.error("Lỗi khi đồng bộ hóa đơn:", error);
      alert(
        "Lỗi khi đồng bộ hóa đơn. Vui lòng kiểm tra lại kết nối hoặc thử lại sau."
      );
    }
  };

  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find(
        (item) => item.product.id === product.id
      );
      if (existingItem) {
        return prevCart.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { product, quantity: 1, notes: "" }];
    });
  };

  const updateCartItemQuantity = (productId, newQuantity) => {
    setCart((prevCart) => {
      if (newQuantity <= 0) {
        return prevCart.filter((item) => item.product.id !== productId);
      }
      return prevCart.map((item) =>
        item.product.id === productId
          ? { ...item, quantity: newQuantity }
          : item
      );
    });
  };

  const updateCartItemNotes = (productId, notes) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.product.id === productId ? { ...item, notes } : item
      )
    );
  };

  const calculateSubtotal = () => {
    return cart.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );
  };

  const handleCheckout = async () => {
    if (cart.length === 0) {
      alert("Giỏ hàng trống!");
      return;
    }

    const newInvoice = {
      id: Date.now(),
      items: cart,
      subtotal: calculateSubtotal(),
      total: calculateSubtotal(),
      timestamp: new Date().toISOString(),
      status: isOnline ? "completed" : "pending",
    };

    if (isOnline) {
      try {
        await sendInvoiceToServer(newInvoice);
        alert("Thanh toán thành công! Hóa đơn đã được gửi.");
        setCart([]);
      } catch (error) {
        console.error("Lỗi khi gửi hóa đơn lên server:", error);
        await db.pendingInvoices.add(newInvoice);
        alert(
          "Lỗi kết nối server. Hóa đơn đã được lưu tạm, sẽ đồng bộ khi có mạng!"
        );
        setCart([]);
      }
    } else {
      await db.pendingInvoices.add(newInvoice);
      alert(
        "Đang ngoại tuyến. Hóa đơn đã được lưu tạm, sẽ đồng bộ khi có mạng!"
      );
      setCart([]);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50 font-sans text-gray-900 overflow-hidden">
      {/* Top Header */}
      <Header isOnline={isOnline} />

      {/* Main Body */}
      <main className="flex flex-1 overflow-hidden">
        {/* Left Sidebar: Categories */}
        <aside className="w-48 shrink-0">
          <CategoryList
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
        </aside>

        {/* Center: Products Grid */}
        <section className="flex-1 p-6 overflow-y-auto bg-white">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {products[selectedCategory]?.map((product) => (
              <div
                key={product.id}
                onClick={() => addToCart(product)}
                className="bg-gray-50 rounded-2xl p-4 border border-transparent hover:border-orange-300 hover:bg-orange-50 transition-all cursor-pointer group"
              >
                <div className="w-full h-48 bg-gray-200 rounded-xl mb-3 flex items-center justify-center text-gray-400 group-hover:scale-105 transition-transform relative">
                  <Image
                    src={product.img}
                    alt={product.name}
                    fill
                    className="object-cover rounded"
                  />
                </div>
                <h3 className="font-bold text-gray-800 leading-tight">
                  {product.name}
                </h3>
                <p className="text-orange-600 font-black mt-1">
                  ${product.price.toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Right Sidebar: Cart */}
        <aside className="w-96 shrink-0 bg-gray-100 border-l border-gray-200 flex flex-col p-6 shadow-2xl">
          <h2 className="text-xl font-black mb-6 flex items-center gap-2">
            GIỎ HÀNG{" "}
            <span className="text-xs bg-gray-300 px-2 py-1 rounded-full">
              {cart.length}
            </span>
          </h2>

          <div className="flex-1 overflow-y-auto pr-2 space-y-1">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-gray-400 opacity-50">
                <p className="text-lg">Chưa có món nào</p>
              </div>
            ) : (
              cart.map((item) => (
                <CartItem
                  key={item.product.id}
                  item={item}
                  onUpdateQuantity={updateCartItemQuantity}
                  onUpdateNotes={updateCartItemNotes}
                />
              ))
            )}
          </div>

          <div className="mt-6 pt-6 border-t-2 border-dashed border-gray-300">
            <div className="flex justify-between text-gray-600 mb-2 font-medium">
              <span>Tạm tính</span>
              <span>${calculateSubtotal().toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-2xl font-black text-gray-900 mb-6">
              <span>TỔNG CỘNG</span>
              <span>${calculateSubtotal().toFixed(2)}</span>
            </div>

            <button
              onClick={handleCheckout}
              disabled={cart.length === 0}
              className={`w-full py-4 rounded-2xl font-bold text-xl shadow-xl transition-all ${
                cart.length === 0
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-orange-600 text-white hover:bg-orange-700 active:scale-95"
              }`}
            >
              XUẤT HÓA ĐƠN
            </button>
          </div>
        </aside>
      </main>
    </div>
  );
}
