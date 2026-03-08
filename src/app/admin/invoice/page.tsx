"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Plus, Trash2, Printer, FileText, ArrowLeft } from "lucide-react";
import { Dropdown } from "@/components/ui/Dropdown";
import { DatePicker } from "@/components/ui/DatePicker";
import Link from "next/link";

interface InvoiceItem {
    no: number;
    particulars: string;
    hsnCode: string;
    qty: string;
    rate: string;
    amount: string;
}

const EMPTY_ITEM: InvoiceItem = { no: 1, particulars: "", hsnCode: "5007", qty: "", rate: "", amount: "" };

const GST_RATES = ["0", "5", "12", "18", "28"];

export default function InvoicePage() {
    const printRef = useRef<HTMLDivElement>(null);

    // Customer details
    const [customer, setCustomer] = useState({ name: "", gstin: "", state: "", code: "" });

    // Invoice details
    const [invoiceNo, setInvoiceNo] = useState("");
    const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().split("T")[0]);
    const [transport, setTransport] = useState("");
    const [lrNo, setLrNo] = useState("");

    // Items
    const [items, setItems] = useState<InvoiceItem[]>([{ ...EMPTY_ITEM }]);

    // Tax
    const [discountPercent, setDiscountPercent] = useState("0");
    const [cgstRate, setCgstRate] = useState("0");
    const [sgstRate, setSgstRate] = useState("0");
    const [igstRate, setIgstRate] = useState("0");

    // Extra
    const [noOfBundles, setNoOfBundles] = useState("");
    const [bookingDate, setBookingDate] = useState("");
    const [paidOrToPay, setPaidOrToPay] = useState("Paid");

    // Calculations
    const subTotal = items.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);
    const discountAmount = (subTotal * (parseFloat(discountPercent) || 0)) / 100;
    const afterDiscount = subTotal - discountAmount;
    const cgstAmount = (afterDiscount * (parseFloat(cgstRate) || 0)) / 100;
    const sgstAmount = (afterDiscount * (parseFloat(sgstRate) || 0)) / 100;
    const igstAmount = (afterDiscount * (parseFloat(igstRate) || 0)) / 100;
    const totalBeforeRound = afterDiscount + cgstAmount + sgstAmount + igstAmount;
    const grandTotal = Math.round(totalBeforeRound);
    const roundOff = (grandTotal - totalBeforeRound).toFixed(2);

    function updateItem(index: number, field: keyof InvoiceItem, value: string) {
        setItems((prev) => {
            const updated = [...prev];
            updated[index] = { ...updated[index], [field]: value };
            // Auto-calculate amount
            if (field === "qty" || field === "rate") {
                const qty = parseFloat(field === "qty" ? value : updated[index].qty) || 0;
                const rate = parseFloat(field === "rate" ? value : updated[index].rate) || 0;
                updated[index].amount = (qty * rate).toFixed(2);
            }
            return updated;
        });
    }

    function addItem() {
        setItems((prev) => [...prev, { ...EMPTY_ITEM, no: prev.length + 1 }]);
    }

    function removeItem(index: number) {
        if (items.length <= 1) return;
        setItems((prev) => prev.filter((_, i) => i !== index).map((item, i) => ({ ...item, no: i + 1 })));
    }

    function numberToWords(num: number): string {
        if (num === 0) return "Zero";
        const ones = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten",
            "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
        const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

        function convert(n: number): string {
            if (n < 20) return ones[n];
            if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 ? " " + ones[n % 10] : "");
            if (n < 1000) return ones[Math.floor(n / 100)] + " Hundred" + (n % 100 ? " and " + convert(n % 100) : "");
            if (n < 100000) return convert(Math.floor(n / 1000)) + " Thousand" + (n % 1000 ? " " + convert(n % 1000) : "");
            if (n < 10000000) return convert(Math.floor(n / 100000)) + " Lakh" + (n % 100000 ? " " + convert(n % 100000) : "");
            return convert(Math.floor(n / 10000000)) + " Crore" + (n % 10000000 ? " " + convert(n % 10000000) : "");
        }
        return convert(Math.floor(num)) + " Rupees Only";
    }

    function handlePrint() {
        const content = printRef.current;
        if (!content) return;
        const printWindow = window.open("", "_blank");
        if (!printWindow) return;
        printWindow.document.write(`
      <html>
        <head>
          <title>Tax Invoice - Mahalakshmi Silks</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: 'Segoe UI', Arial, sans-serif; font-size: 12px; color: #111; }
            @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
            .invoice-box { max-width: 800px; margin: 0 auto; border: 2px solid #333; }
            .header { text-align: center; padding: 12px 16px; border-bottom: 2px solid #333; position: relative; }
            .header-title { font-size: 10px; letter-spacing: 3px; text-transform: uppercase; color: #555; margin-bottom: 4px; }
            .header-name { font-size: 26px; font-weight: 800; font-family: Georgia, serif; letter-spacing: 2px; }
            .header-tagline { font-size: 13px; font-style: italic; color: #444; margin: 2px 0 6px; }
            .header-address { font-size: 11px; color: #333; line-height: 1.5; }
            .gstin-box { position: absolute; top: 10px; right: 12px; border: 1px solid #333; padding: 4px 10px; font-size: 11px; text-align: left; line-height: 1.6; }
            .row { display: flex; border-bottom: 1px solid #333; }
            .row-thick { border-bottom: 2px solid #333; }
            .cell { padding: 5px 10px; border-right: 1px solid #333; font-size: 11px; }
            .cell:last-child { border-right: none; }
            .cell-half { width: 50%; }
            .cell-label { font-weight: 600; min-width: 90px; display: inline-block; }
            table { width: 100%; border-collapse: collapse; }
            th { background: #222; color: #fff; padding: 6px 8px; font-size: 11px; font-weight: 600; text-align: center; border: 1px solid #333; }
            td { padding: 5px 8px; border: 1px solid #ddd; font-size: 11px; text-align: center; min-height: 24px; }
            td:nth-child(2) { text-align: left; }
            .summary-row { display: flex; justify-content: flex-end; }
            .summary-table { width: 50%; }
            .summary-table td { text-align: left; padding: 4px 8px; border: 1px solid #333; }
            .summary-table td:last-child { text-align: right; font-weight: 500; }
            .footer-section { display: flex; border-top: 2px solid #333; }
            .bank-details { width: 50%; padding: 8px 10px; border-right: 1px solid #333; font-size: 10px; line-height: 1.8; }
            .bank-details strong { font-size: 11px; }
            .sign-area { width: 50%; padding: 8px 10px; text-align: right; font-size: 11px; display: flex; flex-direction: column; justify-content: space-between; min-height: 80px; }
            .rupees-row { padding: 5px 10px; border-bottom: 1px solid #333; font-size: 11px; }
            .bundles-row { display: flex; padding: 5px 10px; border-top: 1px solid #333; font-size: 10px; }
          </style>
        </head>
        <body>
          ${content.innerHTML}
          <script>window.onload = function() { window.print(); window.close(); }<\/script>
        </body>
      </html>
    `);
        printWindow.document.close();
    }

    return (
        <div className="max-w-5xl mx-auto">
            {/* Top bar */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <Link href="/admin/orders" className="w-10 h-10 flex items-center justify-center rounded-sm bg-cream-100 hover:bg-cream-200 text-maroon-700 transition-colors">
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <h1 className="font-heading text-3xl text-maroon-800">Tax Invoice</h1>
                        <p className="text-gray-500 text-sm mt-1">Generate invoice matching your bill format</p>
                    </div>
                </div>
                <button onClick={handlePrint} className="btn-primary flex items-center gap-2 text-sm">
                    <Printer size={16} /> Print Invoice
                </button>
            </div>

            {/* Form inputs (not printed) */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card-vintage p-6 mb-8">
                <h2 className="font-heading text-lg text-maroon-800 mb-4 flex items-center gap-2">
                    <FileText size={18} /> Invoice Details
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Invoice No. *</label>
                        <input className="input-vintage text-sm" value={invoiceNo} onChange={(e) => setInvoiceNo(e.target.value)} placeholder="336" />
                    </div>
                    <div style={{ position: "relative", zIndex: 20 }}>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Date *</label>
                        <DatePicker value={invoiceDate} onChange={setInvoiceDate} placeholder="Select invoice date" isClearable />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Transport</label>
                        <input className="input-vintage text-sm" value={transport} onChange={(e) => setTransport(e.target.value)} placeholder="Transport name" />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">L.R. No.</label>
                        <input className="input-vintage text-sm" value={lrNo} onChange={(e) => setLrNo(e.target.value)} />
                    </div>
                </div>

                <h3 className="text-sm font-medium text-gray-700 mb-3">Customer Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="md:col-span-2">
                        <label className="block text-xs font-medium text-gray-600 mb-1">Customer Name *</label>
                        <input className="input-vintage text-sm" value={customer.name} onChange={(e) => setCustomer({ ...customer, name: e.target.value })} placeholder="Customer / Company Name" />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">GSTIN</label>
                        <input className="input-vintage text-sm" value={customer.gstin} onChange={(e) => setCustomer({ ...customer, gstin: e.target.value })} placeholder="GSTIN" />
                    </div>
                    <div className="flex gap-2">
                        <div className="flex-1">
                            <label className="block text-xs font-medium text-gray-600 mb-1">State</label>
                            <input className="input-vintage text-sm" value={customer.state} onChange={(e) => setCustomer({ ...customer, state: e.target.value })} placeholder="Tamil Nadu" />
                        </div>
                        <div className="w-20">
                            <label className="block text-xs font-medium text-gray-600 mb-1">Code</label>
                            <input className="input-vintage text-sm" value={customer.code} onChange={(e) => setCustomer({ ...customer, code: e.target.value })} placeholder="33" />
                        </div>
                    </div>
                </div>

                <h3 className="text-sm font-medium text-gray-700 mb-3">Items</h3>
                <div className="overflow-x-auto mb-4">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="p-2 text-left text-xs text-gray-600 w-12">No.</th>
                                <th className="p-2 text-left text-xs text-gray-600">Particulars</th>
                                <th className="p-2 text-left text-xs text-gray-600 w-24">HSN Code</th>
                                <th className="p-2 text-left text-xs text-gray-600 w-20">Qty</th>
                                <th className="p-2 text-left text-xs text-gray-600 w-24">Rate (₹)</th>
                                <th className="p-2 text-left text-xs text-gray-600 w-28">Amount (₹)</th>
                                <th className="p-2 w-10"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item, i) => (
                                <tr key={i} className="border-b border-gray-100">
                                    <td className="p-2 text-gray-500">{item.no}</td>
                                    <td className="p-2">
                                        <input className="input-vintage text-sm py-1.5" value={item.particulars} onChange={(e) => updateItem(i, "particulars", e.target.value)} placeholder="Soft Silk Saree - Red" />
                                    </td>
                                    <td className="p-2">
                                        <input className="input-vintage text-sm py-1.5" value={item.hsnCode} onChange={(e) => updateItem(i, "hsnCode", e.target.value)} />
                                    </td>
                                    <td className="p-2">
                                        <input type="number" className="input-vintage text-sm py-1.5" value={item.qty} onChange={(e) => updateItem(i, "qty", e.target.value)} placeholder="1" />
                                    </td>
                                    <td className="p-2">
                                        <input type="number" className="input-vintage text-sm py-1.5" value={item.rate} onChange={(e) => updateItem(i, "rate", e.target.value)} placeholder="8500" />
                                    </td>
                                    <td className="p-2">
                                        <input className="input-vintage text-sm py-1.5 bg-gray-50" value={item.amount} readOnly />
                                    </td>
                                    <td className="p-2">
                                        <button onClick={() => removeItem(i)} className="text-gray-400 hover:text-red-500 transition-colors" disabled={items.length === 1}>
                                            <Trash2 size={14} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <button onClick={addItem} className="btn-secondary text-xs flex items-center gap-1">
                    <Plus size={14} /> Add Item
                </button>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                    <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Discount %</label>
                        <input type="number" className="input-vintage text-sm" value={discountPercent} onChange={(e) => setDiscountPercent(e.target.value)} />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">CGST %</label>
                        <Dropdown
                            options={GST_RATES.map((r) => ({ label: `${r}%`, value: r }))}
                            value={cgstRate}
                            onChange={setCgstRate}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">SGST %</label>
                        <Dropdown
                            options={GST_RATES.map((r) => ({ label: `${r}%`, value: r }))}
                            value={sgstRate}
                            onChange={setSgstRate}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">IGST %</label>
                        <Dropdown
                            options={GST_RATES.map((r) => ({ label: `${r}%`, value: r }))}
                            value={igstRate}
                            onChange={setIgstRate}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">No. of Bundles</label>
                        <input className="input-vintage text-sm" value={noOfBundles} onChange={(e) => setNoOfBundles(e.target.value)} />
                    </div>
                    <div style={{ position: "relative", zIndex: 10 }}>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Booking Date</label>
                        <DatePicker value={bookingDate} onChange={setBookingDate} placeholder="Select booking date" isClearable />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Payment</label>
                        <Dropdown
                            options={[{ label: "Paid", value: "Paid" }, { label: "To Pay", value: "To Pay" }]}
                            value={paidOrToPay}
                            onChange={setPaidOrToPay}
                        />
                    </div>
                </div>

                {/* Summary */}
                <div className="mt-6 pt-4 border-t border-gold-100">
                    <div className="flex justify-end">
                        <div className="w-full max-w-xs space-y-1 text-sm">
                            <div className="flex justify-between"><span className="text-gray-500">Sub Total:</span><span className="font-medium">₹{subTotal.toFixed(2)}</span></div>
                            {parseFloat(discountPercent) > 0 && <div className="flex justify-between"><span className="text-gray-500">Discount ({discountPercent}%):</span><span className="text-red-600">-₹{discountAmount.toFixed(2)}</span></div>}
                            {parseFloat(cgstRate) > 0 && <div className="flex justify-between"><span className="text-gray-500">CGST ({cgstRate}%):</span><span>₹{cgstAmount.toFixed(2)}</span></div>}
                            {parseFloat(sgstRate) > 0 && <div className="flex justify-between"><span className="text-gray-500">SGST ({sgstRate}%):</span><span>₹{sgstAmount.toFixed(2)}</span></div>}
                            {parseFloat(igstRate) > 0 && <div className="flex justify-between"><span className="text-gray-500">IGST ({igstRate}%):</span><span>₹{igstAmount.toFixed(2)}</span></div>}
                            <div className="flex justify-between"><span className="text-gray-500">Round off:</span><span>{roundOff}</span></div>
                            <div className="flex justify-between pt-2 border-t border-gold-200 font-heading text-lg text-maroon-800">
                                <span>Grand Total:</span><span>₹{grandTotal.toLocaleString("en-IN")}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* ──── PRINTABLE INVOICE (hidden on screen, shown in print) ──── */}
            <div className="hidden">
                <div ref={printRef}>
                    <div className="invoice-box">
                        {/* Header */}
                        <div className="header">
                            <div className="header-title">Tax Invoice</div>
                            <div className="header-name">MAHALAKSHMI SILKS</div>
                            <div className="header-tagline">Fancy Handloom Silk &amp; Silk Cotton Sarees</div>
                            <div className="header-address">
                                875, Mettupalayam Main Road, Erangattur, Uthandiyur (P.O.)<br />
                                Sathy (Tk.) Erode (Dt.) - 638 451, Tamilnadu
                            </div>
                            <div className="gstin-box">
                                <strong>GSTIN :</strong><br />33AMGPB1721P1Z9<br />
                                ☎ +91 90803 16738<br />&nbsp;&nbsp;&nbsp;+91 78068 65407
                            </div>
                        </div>

                        {/* Customer & Invoice info */}
                        <div className="row">
                            <div className="cell cell-half" style={{ borderRight: "1px solid #333" }}>
                                <span className="cell-label">To :</span> {customer.name}
                            </div>
                            <div className="cell" style={{ width: "25%" }}>
                                <span className="cell-label">Invoice No. :</span>
                            </div>
                            <div className="cell" style={{ width: "25%", fontWeight: 700, fontSize: "16px" }}>
                                {invoiceNo}
                            </div>
                        </div>
                        <div className="row">
                            <div className="cell cell-half" style={{ borderRight: "1px solid #333" }}>
                                <span className="cell-label">GSTIN :</span> {customer.gstin}
                            </div>
                            <div className="cell" style={{ width: "50%" }}>
                                <span className="cell-label">Date :</span> {invoiceDate}
                            </div>
                        </div>
                        <div className="row">
                            <div className="cell cell-half" style={{ borderRight: "1px solid #333" }}>
                                <span className="cell-label">STATE :</span> {customer.state}
                                <span style={{ marginLeft: "40px" }}><span className="cell-label">CODE :</span> {customer.code}</span>
                            </div>
                            <div className="cell" style={{ width: "50%" }}>
                                <span className="cell-label">Transport :</span> {transport}<br />
                                <span className="cell-label">L.R. No. :</span> {lrNo}
                            </div>
                        </div>

                        {/* Items table */}
                        <table>
                            <thead>
                                <tr>
                                    <th style={{ width: "5%" }}>No.</th>
                                    <th style={{ width: "35%" }}>Particulars</th>
                                    <th style={{ width: "12%" }}>HSN Code</th>
                                    <th style={{ width: "8%" }}>Qty.</th>
                                    <th style={{ width: "15%" }}>Rate</th>
                                    <th style={{ width: "25%" }} colSpan={2}>Amount<br /><span style={{ fontSize: "9px", fontWeight: 400 }}>Rs.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Ps.</span></th>
                                </tr>
                            </thead>
                            <tbody>
                                {items.map((item, i) => (
                                    <tr key={i}>
                                        <td>{item.no}</td>
                                        <td>{item.particulars}</td>
                                        <td>{item.hsnCode}</td>
                                        <td>{item.qty}</td>
                                        <td>{item.rate ? `₹${parseFloat(item.rate).toLocaleString("en-IN")}` : ""}</td>
                                        <td>{item.amount ? `₹${parseFloat(item.amount).toLocaleString("en-IN", { minimumFractionDigits: 2 })}` : ""}</td>
                                    </tr>
                                ))}
                                {/* Empty rows to fill space */}
                                {Array.from({ length: Math.max(0, 8 - items.length) }).map((_, i) => (
                                    <tr key={`empty-${i}`}>
                                        <td>&nbsp;</td><td></td><td></td><td></td><td></td><td></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* Rupees & Summary */}
                        <div style={{ display: "flex", borderTop: "2px solid #333" }}>
                            <div style={{ width: "50%", borderRight: "1px solid #333" }}>
                                <div className="rupees-row"><strong>Rupees :</strong> {numberToWords(grandTotal)}</div>
                            </div>
                            <div style={{ width: "50%" }}>
                                <table className="summary-table" style={{ width: "100%" }}>
                                    <tbody>
                                        <tr><td><strong>Sub Total</strong></td><td>₹{subTotal.toFixed(2)}</td></tr>
                                        <tr><td><strong>Discount</strong> &nbsp; {discountPercent}%</td><td>₹{discountAmount.toFixed(2)}</td></tr>
                                        <tr><td><strong>CGST @</strong> &nbsp; {cgstRate}%</td><td>₹{cgstAmount.toFixed(2)}</td></tr>
                                        <tr><td><strong>SGST @</strong> &nbsp; {sgstRate}%</td><td>₹{sgstAmount.toFixed(2)}</td></tr>
                                        <tr><td><strong>IGST @</strong> &nbsp; {igstRate}%</td><td>₹{igstAmount.toFixed(2)}</td></tr>
                                        <tr><td><strong>Round off</strong></td><td>{roundOff}</td></tr>
                                        <tr style={{ background: "#f5f5f5" }}><td><strong>Grand Total</strong></td><td><strong>₹{grandTotal.toLocaleString("en-IN")}</strong></td></tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Bank details & Signature */}
                        <div className="footer-section">
                            <div className="bank-details">
                                <strong>Bank Details :</strong><br />
                                Name &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: &nbsp;Mahalakshmi Silks<br />
                                Bank &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: &nbsp;Karurvysya Bank<br />
                                A/c. No. &nbsp;&nbsp;: &nbsp;1188280000000742<br />
                                IFSC Code : &nbsp;KVBL0001188
                            </div>
                            <div className="sign-area">
                                <div style={{ textAlign: "center", fontWeight: 700 }}>For MAHALAKSHMI SILKS</div>
                                <div style={{ height: "40px" }}></div>
                                <div style={{ textAlign: "center", fontStyle: "italic" }}>Authorised Signatory</div>
                            </div>
                        </div>

                        {/* Bundles & Payment */}
                        <div className="bundles-row">
                            <div style={{ width: "40%" }}>No. of Bundles : {noOfBundles}</div>
                            <div style={{ width: "30%" }}>Booking Date : {bookingDate}</div>
                            <div style={{ width: "30%", textAlign: "right" }}>{paidOrToPay}</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ──── ON-SCREEN PREVIEW ──── */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white border-2 border-gray-300 shadow-xl mb-8">
                {/* Header */}
                <div className="text-center py-4 px-6 border-b-2 border-gray-300 relative">
                    <p className="text-[10px] tracking-[3px] text-gray-500 uppercase">Tax Invoice</p>
                    <h2 className="text-2xl font-bold font-heading tracking-wider">MAHALAKSHMI SILKS</h2>
                    <p className="text-sm italic text-gray-600">Fancy Handloom Silk &amp; Silk Cotton Sarees</p>
                    <p className="text-xs text-gray-500 mt-1">
                        875, Mettupalayam Main Road, Erangattur, Uthandiyur (P.O.)<br />
                        Sathy (Tk.) Erode (Dt.) - 638 451, Tamilnadu
                    </p>
                    <div className="absolute top-3 right-4 border border-gray-400 px-3 py-1.5 text-[10px] text-left leading-relaxed">
                        <strong>GSTIN :</strong><br />33AMGPB1721P1Z9<br />
                        ☎ +91 90803 16738<br />&nbsp;&nbsp;&nbsp;+91 78068 65407
                    </div>
                </div>

                {/* Customer & Invoice */}
                <div className="grid grid-cols-2 border-b border-gray-300 text-xs">
                    <div className="p-2 border-r border-gray-300"><strong>To :</strong> {customer.name || <span className="text-gray-300">Customer name</span>}</div>
                    <div className="p-2 flex"><strong className="mr-1">Invoice No. :</strong> <span className="text-lg font-bold -mt-1">{invoiceNo || "—"}</span></div>
                </div>
                <div className="grid grid-cols-2 border-b border-gray-300 text-xs">
                    <div className="p-2 border-r border-gray-300"><strong>GSTIN :</strong> {customer.gstin || "—"}</div>
                    <div className="p-2"><strong>Date :</strong> {invoiceDate}</div>
                </div>
                <div className="grid grid-cols-2 border-b-2 border-gray-300 text-xs">
                    <div className="p-2 border-r border-gray-300"><strong>STATE :</strong> {customer.state || "—"} &nbsp;&nbsp;&nbsp; <strong>CODE :</strong> {customer.code || "—"}</div>
                    <div className="p-2"><strong>Transport :</strong> {transport || "—"} &nbsp;|&nbsp; <strong>L.R. No. :</strong> {lrNo || "—"}</div>
                </div>

                {/* Items */}
                <table className="w-full text-xs">
                    <thead>
                        <tr className="bg-gray-900 text-white">
                            <th className="p-1.5 border border-gray-700 w-10">No.</th>
                            <th className="p-1.5 border border-gray-700">Particulars</th>
                            <th className="p-1.5 border border-gray-700 w-16">HSN Code</th>
                            <th className="p-1.5 border border-gray-700 w-12">Qty.</th>
                            <th className="p-1.5 border border-gray-700 w-20">Rate</th>
                            <th className="p-1.5 border border-gray-700 w-24">Amount<br /><span className="text-[9px] font-normal">Rs.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Ps.</span></th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((item, i) => (
                            <tr key={i} className="border-b border-gray-200">
                                <td className="p-1.5 text-center border-r border-gray-200">{item.no}</td>
                                <td className="p-1.5 border-r border-gray-200">{item.particulars || <span className="text-gray-300">—</span>}</td>
                                <td className="p-1.5 text-center border-r border-gray-200">{item.hsnCode}</td>
                                <td className="p-1.5 text-center border-r border-gray-200">{item.qty || "—"}</td>
                                <td className="p-1.5 text-right border-r border-gray-200">{item.rate ? `₹${parseFloat(item.rate).toLocaleString("en-IN")}` : "—"}</td>
                                <td className="p-1.5 text-right">{item.amount && parseFloat(item.amount) > 0 ? `₹${parseFloat(item.amount).toLocaleString("en-IN", { minimumFractionDigits: 2 })}` : "—"}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Summary */}
                <div className="flex border-t-2 border-gray-300">
                    <div className="w-1/2 p-2 border-r border-gray-300 text-xs">
                        <strong>Rupees :</strong> {grandTotal > 0 ? numberToWords(grandTotal) : "—"}
                    </div>
                    <div className="w-1/2">
                        <table className="w-full text-xs">
                            <tbody>
                                <tr className="border-b border-gray-200"><td className="p-1.5 font-medium">Sub Total</td><td className="p-1.5 text-right">₹{subTotal.toFixed(2)}</td></tr>
                                <tr className="border-b border-gray-200"><td className="p-1.5">Discount {discountPercent}%</td><td className="p-1.5 text-right">₹{discountAmount.toFixed(2)}</td></tr>
                                <tr className="border-b border-gray-200"><td className="p-1.5">CGST @ {cgstRate}%</td><td className="p-1.5 text-right">₹{cgstAmount.toFixed(2)}</td></tr>
                                <tr className="border-b border-gray-200"><td className="p-1.5">SGST @ {sgstRate}%</td><td className="p-1.5 text-right">₹{sgstAmount.toFixed(2)}</td></tr>
                                <tr className="border-b border-gray-200"><td className="p-1.5">IGST @ {igstRate}%</td><td className="p-1.5 text-right">₹{igstAmount.toFixed(2)}</td></tr>
                                <tr className="border-b border-gray-200"><td className="p-1.5">Round off</td><td className="p-1.5 text-right">{roundOff}</td></tr>
                                <tr className="bg-gray-50 font-bold"><td className="p-1.5">Grand Total</td><td className="p-1.5 text-right">₹{grandTotal.toLocaleString("en-IN")}</td></tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Bank & Signature */}
                <div className="flex border-t-2 border-gray-300">
                    <div className="w-1/2 p-3 border-r border-gray-300 text-[10px] leading-relaxed">
                        <strong className="text-xs">Bank Details :</strong><br />
                        Name &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: &nbsp;Mahalakshmi Silks<br />
                        Bank &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: &nbsp;Karurvysya Bank<br />
                        A/c. No. &nbsp;&nbsp;: &nbsp;1188280000000742<br />
                        IFSC Code : &nbsp;KVBL0001188
                    </div>
                    <div className="w-1/2 p-3 flex flex-col justify-between items-center text-xs">
                        <strong>For MAHALAKSHMI SILKS</strong>
                        <div className="h-10"></div>
                        <em className="text-gray-500">Authorised Signatory</em>
                    </div>
                </div>

                {/* Bundles */}
                <div className="flex border-t border-gray-300 text-[10px] p-2">
                    <div className="w-1/3">No. of Bundles : {noOfBundles || "—"}</div>
                    <div className="w-1/3">Booking Date : {bookingDate || "—"}</div>
                    <div className="w-1/3 text-right">{paidOrToPay}</div>
                </div>
            </motion.div>
        </div>
    );
}
