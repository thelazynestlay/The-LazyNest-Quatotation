import { Quote, Product } from "../types";
import { TERMS, calcCurtainCost } from "../data";
import { Printer, X, Download, ShieldCheck, HeartHandshake, MapPin, Globe, Mail, Phone, Compass, Info } from "lucide-react";
import { Logo } from "./Logo";

interface PrintViewProps {
  quote: Quote;
  products: Product[];
  onClose: () => void;
}

export function PrintView({ quote, products, onClose }: PrintViewProps) {
  // Recalculate cost metrics carefully on individual module wifi configuration
  let productTotal = 0;

  const roomSummary = (quote.rooms || []).map((room) => {
    let roomTotal = 0;
    const boards = (room.boards || [])
      .filter((board) => board.selected !== false)
      .map((board) => {
        let boardCost = 0;
        if (board.isCurtain) {
          boardCost = calcCurtainCost(board.trackLengthFt) * (board.qty || 1);
        } else {
          const moduleCosts = (board.modules || []).map((m) => {
            const p = products.find((x) => x.id === m.productId);
            const isWifi = p && !p.noWifi && m.wifiEnabled !== false;
            const unitPrice = p ? (isWifi ? p.price + 3500 : p.price) : 0;
            return unitPrice * (m.qty || 1);
          });
          boardCost = moduleCosts.reduce((s, c) => s + c, 0) * (board.qty || 1);
        }
        roomTotal += boardCost;
        return { ...board, boardCost };
      });
    productTotal += roomTotal;
    return { ...room, boards, roomTotal };
  });

  const installation = productTotal * 0.1;
  const gst = (productTotal + installation) * 0.18;
  const grandTotal = productTotal + installation + gst;

  const fmtINR = (n: number) => {
    return "₹" + Math.round(n).toLocaleString("en-IN");
  };

  const hasContent = roomSummary.some((r) => r.boards && r.boards.length > 0);

  return (
    <div className="fixed inset-0 bg-black/90 z-[100] overflow-auto p-4 md:p-8 flex flex-col items-center select-text">
      <div className="w-full max-w-4xl space-y-5 animate-fadeIn">
        {/* Controls block with premium brand teal color download button */}
        <div className="flex gap-3 justify-end no-print w-full bg-neutral-950 p-4 rounded-2xl border border-neutral-800 shadow-xl">
          <button
            onClick={() => window.print()}
            className="px-6 py-3 text-xs font-black bg-[#00BFB3] text-white rounded-xl hover:bg-[#007A73] flex items-center gap-2 cursor-pointer shadow-md transition-all hover:scale-[1.01]"
          >
            <Download className="w-4 h-4 stroke-[2.5]" /> Save & Download Quote (PDF)
          </button>
          <button
            onClick={onClose}
            className="px-5 py-3 text-xs font-bold bg-neutral-900 border border-neutral-800 text-neutral-300 rounded-xl hover:bg-neutral-800 flex items-center gap-1.5 cursor-pointer transition-all"
          >
            <X className="w-4 h-4" /> Close Preview
          </button>
        </div>

        {/* Printable Root A4 Document */}
        <div
          id="print-root"
          className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 print:rounded-none print:shadow-none print:border-none w-full print:m-0"
          style={{
            fontFamily: "'Segoe UI', 'Inter', Arial, sans-serif",
            fontSize: "11px",
            color: "#1E293B",
            lineHeight: "1.5",
          }}
        >
          {/* Header Theme - Luxury Premium Brand Obsidian Black */}
          <div
            className="text-white p-8 md:p-10 flex flex-col md:flex-row items-start md:items-center justify-between flex-wrap gap-6 border-b-4 border-[#00BFB3]"
            style={{ background: "#111111" }}
          >
            <div className="flex items-center gap-4">
              <div className="p-2.5 bg-neutral-900/50 rounded-2xl border border-neutral-800 shadow-inner">
                <Logo showText={false} className="h-12 w-auto text-white" />
              </div>
              <div className="w-[1.5px] h-12 bg-neutral-800 opacity-40" />
              <div>
                <div className="text-xl font-black tracking-widest leading-none">
                  LAZY<span style={{ color: "#00BFB3" }}>NEST</span>
                </div>
                <div className="text-[10px] text-[#00BFB3] font-bold uppercase tracking-[3px] mt-1.5 flex items-center gap-1">
                  <Compass className="w-3.5 h-3.5 text-[#00BFB3]" /> Premium Smart Living
                </div>
              </div>
            </div>
            
            <div className="text-left md:text-right space-y-1">
              <div className="text-xs text-neutral-400 font-bold uppercase tracking-wider">
                Home Automation Estimate
              </div>
              <div className="text-base font-black tracking-tight" style={{ color: "#00BFB3" }}>
                {quote.quoteNumber}
              </div>
              <div className="text-[10px] text-neutral-400 font-medium">
                Quotation Date: <span className="text-white font-bold">{quote.date}</span>
              </div>
              {quote.salesExecutive && (
                <div className="text-[10px] text-neutral-400 font-medium">
                  Prepared by: <span className="text-white font-bold">{quote.salesExecutive}</span>
                </div>
              )}
            </div>
          </div>

          {/* Client Details Section */}
          <div className="p-8 bg-slate-50 border-b border-gray-200 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 print:grid-cols-2">
            {[
              { label: "Client Name", val: quote.customerName || "—" },
              { label: "Contact No", val: quote.mobile || "—" },
              { label: "Site Location Address", val: quote.siteAddress || "—" },
              { label: "Project Name", val: quote.projectName || "—" },
            ].map((detail) => (
              <div
                key={detail.label}
                className="bg-white border border-gray-200/80 rounded-2xl p-4 flex flex-col justify-center space-y-1 shadow-sm transition-all hover:border-[#00BFB3]/30"
              >
                <span className="text-[8px] text-[#007A73] uppercase tracking-widest font-black leading-none pb-0.5">
                  {detail.label}
                </span>
                <span className="text-xs font-bold text-slate-800 tracking-tight leading-normal overflow-ellipsis overflow-hidden">
                  {detail.val}
                </span>
              </div>
            ))}
          </div>

          {/* BOQ Specifications */}
          <div className="p-8 space-y-5">
            <div className="flex items-center gap-2 border-b-2 border-neutral-200 pb-2">
              <div className="w-1.5 h-4 bg-[#00BFB3] rounded-full" />
              <h3 className="text-xs font-black uppercase tracking-widest text-[#111111] leading-none">
                Configured Bill of Quantities (BOQ)
              </h3>
            </div>

            {!hasContent ? (
              <div className="text-center py-12 font-bold text-gray-400 text-xs">
                No active devices configured in this document.
              </div>
            ) : (
              <div className="overflow-x-auto border border-slate-100 rounded-2xl shadow-sm">
                <table className="w-full text-left border-collapse text-[10px]">
                  <thead>
                    <tr className="bg-[#111111] text-white font-bold tracking-wider uppercase border-b border-neutral-900">
                      <th className="py-3.5 px-4 min-w-[120px]">Room Area</th>
                      <th className="py-3.5 px-3 w-[70px]">SB No.</th>
                      <th className="py-3.5 px-4 min-w-[140px]">Board Description</th>
                      <th className="py-3.5 px-5 min-w-[220px]">Touch Modular Formula</th>
                      <th className="py-3.5 px-3 text-center w-[60px]">Size</th>
                      <th className="py-3.5 px-3 text-center w-[60px]">Qty</th>
                      <th className="py-3.5 px-4 w-[140px]">Remarks</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {roomSummary.map((room) => {
                      if (!room.boards || room.boards.length === 0) return null;
                      return room.boards.map((board, bIdx) => {
                        const descriptionList = board.isCurtain
                          ? `Motorized Curtain board — tracks segment: ${board.trackLengthFt || "0"}ft (Includes Motor kit & rail setups)`
                          : (board.modules || [])
                              .map((m) => {
                                const p = products.find((x) => x.id === m.productId);
                                if (!p) return "";
                                const isWifiEnabled = p.noWifi || m.wifiEnabled === false ? "" : " (WiFi)";
                                return `${p.displayName}${isWifiEnabled} [x${m.qty}]`;
                              })
                              .filter(Boolean)
                              .join(" + ");

                        const totalSize = board.isCurtain
                          ? "—"
                          : (board.modules || []).reduce((sum, m) => {
                              const p = products.find((x) => x.id === m.productId);
                              return sum + (p ? p.size * m.qty : 0);
                            }, 0);

                        return (
                          <tr
                            key={board.id}
                            className={`border-b border-slate-50 transition-colors ${
                              bIdx % 2 === 0 ? "bg-white" : "bg-slate-50/20"
                            }`}
                          >
                            {bIdx === 0 && (
                              <td
                                rowSpan={room.boards.length}
                                className="py-3 px-4 font-black text-[11px] text-[#007A73] align-middle border-r border-[#EFFDFB] bg-[#EFFDFB]"
                              >
                                {room.name}
                              </td>
                            )}
                            <td className="py-3 px-3 font-mono font-bold text-slate-500">{board.sbNo}</td>
                            <td className="py-3 px-4 text-slate-700 font-bold">{board.description || "—"}</td>
                            <td className="py-3 px-5 font-semibold text-slate-800 leading-relaxed">
                              {descriptionList || "—"}
                            </td>
                            <td className="py-3 px-3 text-center font-bold text-slate-400">
                              {typeof totalSize === "number" && totalSize > 0 ? `${totalSize}M` : "—"}
                            </td>
                            <td className="py-3 px-3 text-center font-black text-slate-800 text-[11px]">
                              {board.qty || 1}
                            </td>
                            <td className="py-3 px-4 text-slate-400 font-semibold italic">
                              {board.remarks || "—"}
                            </td>
                          </tr>
                        );
                      });
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Pricing Detailed Summary Block - Left aligned 10 Years Warranty Badge, Right Aligned Price calculations */}
          <div className="px-8 pb-8 flex flex-col sm:flex-row justify-between items-center gap-6">
            {/* Minimalist Premium 10 Years Warranty Badge */}
            <div className="flex items-center gap-3.5 bg-neutral-50 p-4.5 rounded-2xl border border-neutral-200/80 max-w-sm w-full sm:w-auto">
              <div className="p-2.5 bg-[#00BFB3]/10 text-[#007A73] rounded-xl flex items-center justify-center shrink-0">
                <ShieldCheck className="w-6 h-6 stroke-[2.5]" />
              </div>
              <div className="space-y-0.5">
                <div className="text-xs font-black tracking-wider uppercase text-slate-800">
                  10 Years Warranty
                </div>
                <p className="text-[10px] leading-relaxed text-slate-500 font-semibold">
                  Elite comprehensive 10-year replacement warranty is fully standard on all smart touch modular boards.
                </p>
              </div>
            </div>

            {/* Price Calculations in Luxury Obsidian Black Theme */}
            <div className="w-full sm:w-[380px] bg-[#111111] text-white rounded-2xl overflow-hidden shadow-lg border border-neutral-800 shrink-0">
              <div className="p-6 space-y-3">
                <div className="flex justify-between items-center text-[10px] uppercase font-bold tracking-widest text-[#94A3B8]">
                  <span>Equipment Total</span>
                  <span className="font-extrabold text-white">{fmtINR(productTotal)}</span>
                </div>
                <div className="flex justify-between items-center text-[10px] uppercase font-bold tracking-widest text-[#94A3B8]">
                  <span>Installation & Setup (10%)</span>
                  <span className="font-extrabold text-white">{fmtINR(installation)}</span>
                </div>
                <div className="flex justify-between items-center text-[10px] uppercase font-bold tracking-widest text-[#94A3B8]">
                  <span>GST Taxation (18%)</span>
                  <span className="font-extrabold text-white">{fmtINR(gst)}</span>
                </div>
                
                <div className="border-t border-neutral-800 pt-4 flex items-center justify-between">
                  <div>
                    <div className="text-[10px] text-[#00BFB3] uppercase tracking-widest font-black leading-none mb-1">
                      TOTAL SUM PAYABLE
                    </div>
                    <div className="text-[8px] text-neutral-400 font-semibold">
                      (All hardware, setup & taxes)
                    </div>
                  </div>
                  <div className="text-2xl font-black text-[#00BFB3]">
                    {fmtINR(grandTotal)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Terms & Conditions */}
          <div className="p-8 bg-slate-50 border-t border-gray-200">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-[#007A73] mb-4 flex items-center gap-1.5">
              <Info className="w-4 h-4 text-[#007A73]" /> Standard Terms & Conditions
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
              {TERMS.map((t, idx) => (
                <div key={idx} className="flex gap-2.5 items-start text-slate-500 text-[10px] font-semibold leading-relaxed">
                  <span className="font-extrabold shrink-0 text-[#007A73]">
                    {idx + 1}.
                  </span>
                  <span>{t}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Document Footer info in Obsidian Black */}
          <div className="bg-[#111111] p-6 px-8 text-slate-300/80 text-[10px] font-semibold flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-t border-neutral-800">
            <div className="flex items-center gap-2 flex-wrap">
              <MapPin className="w-3.5 h-3.5 text-[#00BFB3] shrink-0" />
              <span>
                LazyNest Home Automation · 715, Dalnex, Solitaire Business hub, Balewadi High street road, Baner, Pune · GST: 24AASFD4198E1Z6
              </span>
            </div>
            
            <div className="text-[#00BFB3] font-bold flex flex-wrap gap-x-5 gap-y-1.5 shrink-0">
              <a href="https://www.thelazynest.com" className="flex items-center gap-1 hover:underline">
                <Globe className="w-3.5 h-3.5" /> www.thelazynest.com
              </a>
              <a href="mailto:hello@thelazynest.com" className="flex items-center gap-1 hover:underline">
                <Mail className="w-3.5 h-3.5" /> hello@thelazynest.com
              </a>
              <span className="flex items-center gap-1">
                <Phone className="w-3.5 h-3.5" /> +91 7874433388
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}