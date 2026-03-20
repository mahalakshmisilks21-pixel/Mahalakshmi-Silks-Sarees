export function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);
}

export function getDiscountPercentage(price: number, discountPrice: number): number {
  return Math.round(((price - discountPrice) / price) * 100);
}

// WhatsApp client number
const WHATSAPP_NUMBER = "918489240766";

export interface WhatsAppOrderItem {
  name: string;
  quantity: number;
  price: number;
}

export interface WhatsAppAddress {
  fullName: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
}

export function generateWhatsAppOrderMessage(
  items: WhatsAppOrderItem[],
  address: WhatsAppAddress,
  subtotal: number,
  shipping: number,
  tax: number,
  grandTotal: number
): string {
  const itemLines = items
    .map((item, i) => `${i + 1}. ${item.name} × ${item.quantity} — ${formatPrice(item.price * item.quantity)}`)
    .join("\n");

  return `🛍️ *New Order from Mahalakshmi Silks*
━━━━━━━━━━━━━━━━━
*Items:*
${itemLines}
━━━━━━━━━━━━━━━━━
Subtotal: ${formatPrice(subtotal)}
Shipping: ${shipping === 0 ? "FREE ✅" : formatPrice(shipping)}
Tax (5% GST): ${formatPrice(tax)}
*Total: ${formatPrice(grandTotal)}*
━━━━━━━━━━━━━━━━━
📍 *Ship to:*
${address.fullName}
${address.street}
${address.city}, ${address.state} - ${address.pincode}
📞 ${address.phone}
━━━━━━━━━━━━━━━━━
_Please confirm this order and share payment details._`;
}

export function generateWhatsAppProductMessage(
  productName: string,
  price: number,
  discountPrice: number | null,
  url: string
): string {
  const priceText = discountPrice
    ? `~${formatPrice(price)}~ *${formatPrice(discountPrice)}*`
    : `*${formatPrice(price)}*`;
  return `✨ Check out this beautiful saree from *Mahalakshmi Silks*!\n\n🧵 *${productName}*\n💰 ${priceText}\n\n🔗 ${url}`;
}

export function openWhatsApp(message: string, number: string = WHATSAPP_NUMBER): void {
  const encoded = encodeURIComponent(message);
  window.open(`https://wa.me/${number}?text=${encoded}`, "_blank");
}

export function getWhatsAppSubscriptionMessage(phone: string): string {
  return `Hi! 👋 I'm ${phone}. I'd like to receive exclusive offers and updates from Mahalakshmi Silks on WhatsApp. 🛍️`;
}

export function timeAgo(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} day${days !== 1 ? "s" : ""} ago`;
  const weeks = Math.floor(days / 7);
  if (weeks < 5) return `${weeks} week${weeks !== 1 ? "s" : ""} ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months} month${months !== 1 ? "s" : ""} ago`;
  const years = Math.floor(days / 365);
  return `${years} year${years !== 1 ? "s" : ""} ago`;
}
