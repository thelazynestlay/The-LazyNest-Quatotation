import { useState } from "react";
import { Quote, Product } from "../types";
import { TEAL } from "../data";
import { Plus, Settings, Search, Trash2, Copy, Edit, Home, Sparkles } from "lucide-react";

interface DashboardProps {
  quotes: Quote[];
  products: Product[];
  onNew: () => void;
  onEdit: (q: Quote) => void;
  onDuplicate: (q: Quote) => void;
  onDelete: (id: string) => void;
  onOpenAdmin: () => void;
}

export function Dashboard({
  quotes,
  products,
  onNew,
  onEdit,
  onDuplicate,
  onDelete,
  onOpenAdmin,
}: DashboardProps) {
  const [search, setSearch] = useState("");

  const filtered = quotes.filter((q) => {
    const rawSearch = search.toLowerCase();
    return (
      q.customerName.toLowerCase().includes(rawSearch) ||
      (q.projectName && q.projectName.toLowerCase().includes(rawSearch)) ||
      q.quoteNumber.toLowerCase().includes(rawSearch)
    );
  });

  const totalValue = quotes.reduce((sum, q) => sum + (q.grandTotal || 0), 0);
  const currentMonth = new Date().getMonth();
  const thisMonthQuotes = quotes.filter((q) => {
    try {
      const date = q.savedAt ? new Date(q.savedAt) : new Date();
      return date.getMonth() === currentMonth;
    } catch {
      return false;
    }
  }).length;

  const fmtINR = (n: number) => {
    return "₹" + Math.round(n).toLocaleString("en-IN");
  };

  return (
    <div className="space-y-6">
      {/* Upper Brand Card */}
      <div
        className="rounded-3xl text-white p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl relative overflow-hidden"
        style={{ background: "#111111" }}
      >
        <div className="relative z-10 space-y-1">
          <p className="text-xs font-bold uppercase tracking-widest" style={{ color: TEAL }}>
            LAZYNEST HOME AUTOMATION
          </p>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight flex items-center gap-2">
            Quotation Dashboard <Sparkles className="w-6 h-6 text-teal-300 animate-pulse" />
          </h1>
          <p className="text-gray-400 text-sm max-w-xl font-medium">
            Configure premium Elite & Touch smart switch boards, curtain motorized boards, and accessory modules for luxury home automation projects.
          </p>
        </div>
        <div className="flex gap-2.5 flex-wrap relative z-10 w-full md:w-auto">
          <button
            onClick={onOpenAdmin}
            className="flex-1 md:flex-none justify-center items-center inline-flex gap-2 rounded-xl text-xs font-semibold px-4 py-2.5 bg-white/10 hover:bg-white/15 border border-white/20 text-white transition-all cursor-pointer"
          >
            <Settings className="w-4 h-4" /> Admin Catalog
          </button>
          <button
            onClick={onNew}
            className="flex-1 md:flex-none justify-center items-center inline-flex gap-2 rounded-xl text-xs font-bold px-5 py-2.5 text-black hover:brightness-110 shadow-lg transition-all cursor-pointer"
            style={{ background: TEAL }}
          >
            <Plus className="w-4 h-4" /> New Quote
          </button>
        </div>
        {/* Subtle decorative background gradient */}
        <div className="absolute right-0 top-0 w-80 h-80 rounded-full bg-teal-500/10 blur-[100px] pointer-events-none" />
      </div>

      {/* Numerical Indicators */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Quotes", val: quotes.length, sub: "Cumulative BOQs" },
          { label: "Created This Month", val: thisMonthQuotes, sub: "New instances" },
          { label: "Project Value Sum", val: fmtINR(totalValue), sub: "Total pipeline" },
          { label: "Average Deal Size", val: quotes.length ? fmtINR(totalValue / quotes.length) : "₹0", sub: "Mean quotation cost" },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm space-y-1">
            <p className="text-[10px] text-gray-400 uppercase tracking-widest font-black">{stat.label}</p>
            <p className="text-xl font-black text-gray-900 tracking-tight">{stat.val}</p>
            <p className="text-xs text-gray-400 font-medium">{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* Global Lookup Field */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter saved quotations by client name, project details or quote tag..."
          className="w-full bg-white border border-gray-200/80 rounded-2xl pl-10 pr-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:ring-1 focus:ring-teal-400 focus:border-teal-400 focus:outline-none shadow-sm transition-all"
        />
      </div>

      {/* Quotations List */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl p-16 text-center border border-gray-100 shadow-sm space-y-5">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mx-auto shadow-inner"
            style={{ background: TEAL + "15" }}
          >
            <Home className="w-8 h-8" style={{ color: TEAL }} />
          </div>
          <div className="space-y-1">
            <p className="text-gray-800 font-black text-lg">No automated estimates found</p>
            <p className="text-sm text-gray-400 max-w-sm mx-auto font-medium">
              Start by building your first switchboard-to-room modular configuration and print professional PDFs instantly.
            </p>
          </div>
          <button
            onClick={onNew}
            className="px-5 py-2.5 text-xs font-bold text-black rounded-xl hover:brightness-110 shadow-md transition-all cursor-pointer"
            style={{ background: TEAL }}
          >
            <Plus className="w-4 h-4 inline mr-1" /> Create First Quotation
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((quote) => (
            <div
              key={quote.id}
              className="bg-white rounded-2xl p-4 md:p-5 border border-gray-100 shadow-sm hover:shadow-md hover:border-gray-200 transition-all flex flex-col md:flex-row items-start md:items-center gap-4 justify-between"
            >
              <div className="space-y-1.5 min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-extrabold text-gray-900 tracking-tight text-base">
                    {quote.customerName || "Draft Client Estimate"}
                  </span>
                  <span
                    className="text-[9px] px-2 py-0.5 rounded-full font-black text-white uppercase tracking-wider"
                    style={{ background: TEAL }}
                  >
                    {quote.quoteNumber}
                  </span>
                </div>
                <p className="text-xs font-semibold text-gray-400 flex items-center gap-2 flex-wrap">
                  <span className="text-gray-500 font-bold">{quote.projectName || "Standard Apartment"}</span>
                  <span className="w-1 h-1 rounded-full bg-gray-300" />
                  <span>{quote.date}</span>
                  {quote.salesExecutive && (
                    <>
                      <span className="w-1 h-1 rounded-full bg-gray-300" />
                      <span>{quote.salesExecutive}</span>
                    </>
                  )}
                </p>
              </div>

              <div className="flex items-center gap-6 justify-between w-full md:w-auto md:border-l md:border-gray-100 md:pl-6">
                <div className="text-left md:text-right shrink-0">
                  <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-0.5">Grand Total</div>
                  <div className="text-lg font-black tracking-tight" style={{ color: TEAL }}>
                    {fmtINR(quote.grandTotal || 0)}
                  </div>
                  <div className="text-[10px] font-bold text-gray-400">
                    {quote.rooms?.length || 0} configured room{(quote.rooms?.length ?? 0) !== 1 ? "s" : ""}
                  </div>
                </div>

                <div className="flex gap-2 items-center">
                  <button
                    onClick={() => onEdit(quote)}
                    className="p-2 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 active:scale-95 transition-all cursor-pointer"
                    title="Edit Estimate"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDuplicate(quote)}
                    className="p-2 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 active:scale-95 transition-all cursor-pointer"
                    title="Clone Estimate"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => quote.id && onDelete(quote.id)}
                    className="p-2 border border-red-100 text-red-500 bg-red-50/50 rounded-xl hover:bg-red-50 hover:text-red-700 active:scale-95 transition-all cursor-pointer"
                    title="Delete Estimate"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
