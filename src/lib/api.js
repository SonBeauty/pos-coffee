export async function sendInvoiceToServer(invoiceData) {
  console.log("Đang gửi hóa đơn lên server...", invoiceData);
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() > 0.1) {
        console.log("Hóa đơn đã được gửi thành công:", invoiceData.id);
        resolve({ success: true, invoiceId: invoiceData.id });
      } else {
        console.error(
          "Lỗi khi gửi hóa đơn lên server (giả lập):",
          invoiceData.id
        );
        reject(new Error("Lỗi mạng hoặc server không phản hồi."));
      }
    }, 1000);
  });
}
