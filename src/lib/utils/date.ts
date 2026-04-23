export function toVNDateStr(date = new Date()): string {
  const vn = new Date(date.toLocaleString("en-US", { timeZone: "Asia/Ho_Chi_Minh" }));
  const y = vn.getFullYear();
  const m = String(vn.getMonth() + 1).padStart(2, "0");
  const d = String(vn.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function formatDate(dateStr: string, short = false): string {
  const vn = new Date(
    new Date(dateStr + "T12:00:00").toLocaleString("en-US", { timeZone: "Asia/Ho_Chi_Minh" })
  );
  const d = String(vn.getDate()).padStart(2, "0");
  const m = String(vn.getMonth() + 1).padStart(2, "0");
  const y = short ? String(vn.getFullYear()).slice(2) : vn.getFullYear();
  return `${d}/${m}/${y}`;
}
