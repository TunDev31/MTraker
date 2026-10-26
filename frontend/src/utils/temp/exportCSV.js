const pad = (n) => String(n).padStart(2, "0");

const formatDate = (value) => {
  if (!value) return "";
  const d = new Date(value);
  if (isNaN(d)) return "";
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

// Cột chữ: escape dấu " và chặn CSV injection
const text = (v) => {
  let s = String(v ?? "");
  if (/^[=+\-@\t\r]/.test(s)) s = "'" + s;
  return `"${s.replace(/"/g, '""')}"`;
};

export const exportCSV = (transactions, filename) => {
  if (!transactions?.length) {
    alert("Không có giao dịch để xuất!");
    return;
  }

  const headers = ["Tên", "Loại", "Số tiền", "Ví", "Tag", "Mô tả", "Ngày tạo", "Ngày hoàn thành"];

  const rows = transactions.map((t) =>
    [
      text(t.title),
      text(t.type === "income" ? "Thu nhập" : "Chi tiêu"),
      Number(t.amount) || 0, // để dạng số, Excel tính tổng được
      text(t.walletId?.walletName ?? ""),
      text(t.tag),
      text(t.description),
      text(formatDate(t.createdAt)),
      text(formatDate(t.completedAt)),
    ].join(",")
  );

  const csv = [headers.map(text).join(","), ...rows].join("\r\n");

  // \uFEFF (BOM) để Excel đọc đúng tiếng Việt có dấu
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const name =
    filename ?? `giao-dich-${new Date().toISOString().slice(0, 10)}.csv`;

  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  document.body.appendChild(a); // một số trình duyệt cần link nằm trong DOM
  a.click();
  document.body.removeChild(a);

  setTimeout(() => URL.revokeObjectURL(url), 1000); // thu hồi muộn để tải không bị huỷ
};