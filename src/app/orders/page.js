"use client";
import { useState, useEffect } from "react";
import { db } from "../../lib/indexedDB";

export default function OrdersPage() {
  const [pendingInvoices, setPendingInvoices] = useState([]);
  const [syncedInvoices, setSyncedInvoices] = useState([]);

  useEffect(() => {
    // 1. Lấy hóa đơn đang chờ trong máy (Offline)
    const loadOfflineData = async () => {
      const offlineItems = await db.pendingInvoices.toArray();
      setPendingInvoices(offlineItems);
    };

    // 2. Lấy hóa đơn từ Server (Giả lập API)
    const loadOnlineData = async () => {
      //   const res = await fetch("/api/orders");
      //   const data = await res.json();
      //   setSyncedInvoices(data);
    };

    loadOfflineData();
    loadOnlineData();
  }, []);

  return (
    <div className="p-8 bg-white min-h-screen">
      <h1 className="text-2xl font-black mb-6">QUẢN LÝ HÓA ĐƠN</h1>

      {/* Danh sách hóa đơn CHỜ ĐỒNG BỘ */}
      <section className="mb-8">
        <h2 className="text-orange-600 font-bold mb-4 flex items-center gap-2">
          <span className="w-3 h-3 bg-orange-500 rounded-full animate-pulse"></span>
          Đang chờ đồng bộ (Offline)
        </h2>
        <div className="overflow-x-auto border rounded-xl">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="p-4 border-b">Mã đơn</th>
                <th className="p-4 border-b">Thời gian</th>
                <th className="p-4 border-b">Tổng tiền</th>
                <th className="p-4 border-b">Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {pendingInvoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-gray-50">
                  <td className="p-4 border-b font-mono text-sm">#{inv.id}</td>
                  <td className="p-4 border-b">
                    {new Date(inv.timestamp).toLocaleString()}
                  </td>
                  <td className="p-4 border-b font-bold">
                    ${inv.total.toFixed(2)}
                  </td>
                  <td className="p-4 border-b">
                    <span className="px-2 py-1 bg-gray-200 text-gray-700 rounded text-xs">
                      Chờ có mạng...
                    </span>
                  </td>
                </tr>
              ))}
              {pendingInvoices.length === 0 && (
                <tr>
                  <td colSpan="4" className="p-4 text-center text-gray-400">
                    Không có hóa đơn chờ
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
