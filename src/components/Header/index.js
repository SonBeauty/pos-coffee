import Head from "next/head";
import { useState } from "react";
import OfflineIndicator from "@/components/OfflineIndicator";

const Header = ({ isOnline, cart = [] }) => {
  const [showCart, setShowCart] = useState(false);
  const [showCategory, setShowCategory] = useState(false);
  return (
    <>
      <Head>
        <title>Cafe POS - Hệ thống tính tiền</title>
      </Head>
      <header className="h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-lg">
            C
          </div>
          <h1 className="text-xl font-black tracking-tight text-gray-800">
            CAFE NEXUS POS
          </h1>
        </div>

        {/* Mobile Actions */}
        <div className="flex items-center gap-4 md:hidden">
          {/* Category */}
          <button
            onClick={() => setShowCategory(true)}
            className="relative"
          ></button>

          {/* Cart */}
          <button onClick={() => setShowCart(true)} className="relative">
            🛒
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-orange-600 text-white text-xs px-2 rounded-full">
                {cart.length}
              </span>
            )}
          </button>
        </div>

        <OfflineIndicator isOnline={isOnline} />
      </header>
    </>
  );
};

export default Header;
