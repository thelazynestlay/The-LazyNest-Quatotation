import { Quote, Product } from "../types";
import { LOGO_B64, TERMS, calcCurtainCost, DEFAULT_PRODUCTS } from "../data";
import { Printer, X } from "lucide-react";

interface PrintViewProps {
  quote: Quote;
  wifiEnabled: boolean;
  products: Product[];
  onClose: () => void;
}

export function PrintView({ quote, wifiEnabled, products, onClose }: PrintViewProps) {
  // Recalculate cost metrics carefully
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
          const unitPrice =
            p ? (p.noWifi || !wifiEnabled ? p.price : p.price + 3500) : 0;
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
    <div className="fixed inset-0 bg-black/85 z-[100] overflow-auto p-4 md:p-8 flex flex-col items-center select-text">
      <div className="w-full max-w-4xl space-y-4">
        {/* Controls block */}
        <div className="flex gap-3 justify-end no-print w-full bg-neutral-900 p-3 rounded-2xl border border-neutral-800 shadow-md">
          <button
            onClick={() => window.print()}
            className="px-5 py-2.5 text-xs font-bold bg-white text-black rounded-xl hover:bg-gray-100 flex items-center gap-2 cursor-pointer shadow-sm"
          >
            <Printer className="w-4 h-4" /> Print / Save PDF
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2.5 text-xs font-bold bg-neutral-800 border border-neutral-700 text-neutral-300 rounded-xl hover:bg-neutral-700 flex items-center gap-1.5 cursor-pointer"
          >
            <X className="w-4 h-4" /> Close
          </button>
        </div>

        {/* Printable Root A4 Document */}
        <div
          id="print-root"
          className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100 print:rounded-none print:shadow-none print:border-none w-full print:m-0"
          style={{
            fontFamily: "'Segoe UI', Arial, sans-serif",
            fontSize: "11px",
            color: "#111111",
            lineHeight: "1.4",
          }}
        >
          {/* Header */}
          <div
            className="text-white p-6 md:p-8 flex items-center justify-between flex-wrap gap-4"
            style={{ background: "#111111" }}
          >
            <div className="flex items-center gap-4">
              <img
                src={LOGO_B64}
                alt="LazyNest Logo"
                className="h-10 w-auto object-contain"
                referrerPolicy="no-referrer"
              />
              <div className="w-[1.5px] h-10 bg-neutral-800" />
              <div>
                <div className="text-xl font-black tracking-wider leading-none">
                  EXPERIENCE <span style={{ color: "#00BFB3" }}>SMART</span> LIVING
                </div>
                <div className="text-[9px] text-neutral-400 font-bold uppercase tracking-[2px] mt-1">
                  Home Automation Estimate
                </div>
              </div>
            </div>
            <div className="text-left md:text-right space-y-0.5">
              <div className="text-sm font-extrabold tracking-tight" style={{ color: "#00BFB3" }}>
                {quote.quoteNumber}
              </div>
              <div className="text-[10px] text-neutral-400 font-medium">Date: {quote.date}</div>
              {quote.salesExecutive && (
                <div className="text-[10px] text-neutral-400 font-medium">Prepared by: {quote.salesExecutive}</div>
              )}
            </div>
          </div>

          {/* Color strip accent */}
          <div className="h-1 w-full bg-gradient-to-r from-teal-400 to-teal-700" />

          {/* Customer Context Grid */}
          <div className="p-6 bg-neutral-50/80 border-b border-gray-100 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 print:grid-cols-2">
            {[
              { label: "Client Name", val: quote.customerName || "—" },
              { label: "Contact No", val: quote.mobile || "—" },
              { label: "Site Location Address", val: quote.siteAddress || "—" },
              { label: "Project Name", val: quote.projectName || "—" },
            ].map((detail, idx) => (
              <div
                key={detail.label}
                className="bg-white border border-gray-200/80 rounded-xl p-3 flex flex-col justify-center space-y-0.5 shadow-sm"
              >
                <span className="text-[8px] text-gray-400 uppercase tracking-widest font-black leading-none mb-0.5">
                  {detail.label}
                </span>
                <span className="text-xs font-bold text-gray-800 tracking-tight leading-normal overflow-ellipsis overflow-hidden">
                  {detail.val}
                </span>
              </div>
            ))}
          </div>

          {/* BOQ Specifications */}
          <div className="p-6 md:p-8 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#007A73] border-b-2 border-gray-900 pb-1.5 leading-none">
              Configured Bill of Quantities (BOQ)
            </h3>

            {!hasContent ? (
              <div className="text-center py-10 font-bold text-gray-400 text-xs">No devices configured in this document.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-[10px]">
                  <thead>
                    <tr className="bg-neutral-900 text-white font-bold leading-normal">
                      <th className="py-2.5 px-3 min-w-[100px]">Room Area</th>
                      <th className="py-2.5 px-3 w-[70px]">SB No.</th>
                      <th className="py-2.5 px-3 min-w-[120px]">Board Description</th>
                      <th className="py-2.5 px-3 min-w-[200px]">Touch Modular Formula</th>
                      <th className="py-2.5 px-3 text-center w-[50px]">Size</th>
                      <th className="py-2.5 px-3 text-center w-[50px]">Qty</th>
                      <th className="py-2.5 px-3 w-[120px]">Remarks</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {roomSummary.map((room) => {
                      if (!room.boards || room.boards.length === 0) return null;
                      return room.boards.map((board, bIdx) => {
                        const descriptionList = board.isCurtain
                          ? `Motorized Curtain Board — Tracks segment: ${board.trackLengthFt || "0"}ft`
                          : (board.modules || [])
                              .map((m) => {
                                const p = products.find((x) => x.id === m.productId);
                                if (!p) return "";
                                return `${p.displayName} (x${m.qty})`;
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
                            className={`border-b border-gray-100 transition-colors ${
                              bIdx % 2 === 0 ? "bg-white" : "bg-neutral-50/30"
                            }`}
                          >
                            {bIdx === 0 && (
                              <td
                                rowSpan={room.boards.length}
                                className="py-2 px-3 font-extrabold text-[10px] text-[#007A73] align-middle border-r border-gray-100"
                                style={{ background: "#f0f9f8" }}
                              >
                                {room.name}
                              </td>
                            )}
                            <td className="py-2 px-3 font-mono font-bold text-gray-500">{board.sbNo}</td>
                            <td className="py-2 px-3 text-gray-700 font-medium">{board.description || "—"}</td>
                            <td className="py-2 px-3 font-semibold text-gray-800 leading-relaxed">
                              {descriptionList || "—"}
                            </td>
                            <td className="py-2 px-3 text-center font-bold text-neutral-400">
                              {typeof totalSize === "number" && totalSize > 0 ? `${totalSize}M` : "—"}
                            </td>
                            <td className="py-2 px-3 text-center font-extrabold text-neutral-700">
                              {board.qty || 1}
                            </td>
                            <td className="py-2 px-3 text-gray-400 font-medium italic overflow-ellipsis overflow-hidden max-w-[150px]">
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

          {/* All-Inclusive Cost Block */}
          <div className="px-6 md:px-8 pb-8 flex justify-end">
            <div className="w-full sm:w-[350px] bg-neutral-900 rounded-2xl overflow-hidden shadow-md">
              <div className="p-4 flex items-center justify-between">
                <div>
                  <div className="text-[8px] text-neutral-400 uppercase tracking-widest font-black leading-none mb-1">
                    TOTAL SUM PAYABLE
                  </div>
                  <div className="text-[8px] text-neutral-500 font-medium">
                    (Inclusive of all taxes & installation)
                  </div>
                </div>
                <div className="text-lg font-black" style={{ color: "#00BFB3" }}>
                  {fmtINR(grandTotal)}
                </div>
              </div>
            </div>
          </div>

          {/* Terms */}
          <div className="p-6 md:p-8 bg-neutral-50 border-t border-gray-100">
            <h4 className="text-[9px] font-black uppercase tracking-widest text-[#007A73] mb-3">
              Standard Terms & Conditions
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1.5">
              {TERMS.map((t, idx) => (
                <div key={idx} className="flex gap-2 items-start shrink-0 text-gray-500 text-[9px] font-medium leading-normal">
                  <span className="font-bold shrink-0" style={{ color: "#00BFB3" }}>
                    {idx + 1}.
                  </span>
                  <span>{t}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Document Footer info */}
          <div className="bg-[#111111] p-4 px-6 md:px-8 text-neutral-400 text-[8px] font-medium flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
            <div>LazyNest · GST: 24AASFD4198E1Z6 · F1/103 Tower 2A, KVT, Vadodara, Gujarat - 390007</div>
            <div style={{ color: "#00BFB3" }} className="font-bold flex flex-wrap gap-x-4 gap-y-1">
              <span>www.thelazynest.com</span>
              <span>hello@thelazynest.com</span>
              <span>+91 7874433388</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
