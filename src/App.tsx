/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { Quote, Product } from "./types";
import { DEFAULT_PRODUCTS, LOGO_B64, TEAL } from "./data";
import { Dashboard } from "./components/Dashboard";
import { QuoteBuilder } from "./components/QuoteBuilder";
import { AdminPanel } from "./components/AdminPanel";
import { ChevronRight } from "lucide-react";

// Helper function to generate unique ID
const uid = () => Math.random().toString(36).slice(2, 9);

export default function App() {
  const [view, setView] = useState<"dashboard" | "builder">("dashboard");
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [editingQuote, setEditingQuote] = useState<Quote | null>(null);
  const [showAdmin, setShowAdmin] = useState(false);

  // Initialize data on mount safe check
  useEffect(() => {
    try {
      const savedQuotes = localStorage.getItem("ln3_quotes");
      if (savedQuotes) {
        setQuotes(JSON.parse(savedQuotes));
      } else {
        // Hydrate with one realistic sample quote to provide immediate preview delight
        const sample: Quote = {
          id: uid(),
          customerName: "Sanjay Shah (Sample)",
          mobile: "+91 98250 12345",
          email: "sanjay.shah@yahoo.com",
          siteAddress: "B-402, Samrajya Apartments, Race Course Rd, Vadodara",
          projectName: "3 BHK Residence Wiring Setup",
          salesExecutive: "Priyank Patel",
          quoteNumber: "LN-849032",
          date: new Date().toLocaleDateString("en-IN"),
          wifiEnabled: true,
          rooms: [
            {
              id: uid(),
              name: "Living Room Area",
              boards: [
                {
                  id: uid(),
                  sbNo: "SB-01",
                  description: "Main Switchboard",
                  remarks: "Beside front entry door",
                  qty: 1,
                  modules: [
                    { id: uid(), productId: 11, qty: 1 }, // Elite Touch 4 Switch
                    { id: uid(), productId: 12, qty: 1 }, // Elite Touch 4 Switch 1 Fan regulator
                    { id: uid(), productId: 52, qty: 1 }, // Elite Socket 6 AMP
                  ],
                },
                {
                  id: uid(),
                  sbNo: "CB-01",
                  description: "Balcony Curtains",
                  remarks: "Motorized slider blinds",
                  isCurtain: true,
                  trackLengthFt: "11",
                  qty: 1,
                  modules: [],
                },
              ],
            },
            {
              id: uid(),
              name: "Master Suite Room",
              boards: [
                {
                  id: uid(),
                  sbNo: "SB-02",
                  description: "Bed Side switch panel",
                  remarks: "Right bed side drawer",
                  qty: 2,
                  modules: [
                    { id: uid(), productId: 5, qty: 1 }, // 2 Switch 1-2way
                    { id: uid(), productId: 51, qty: 1 }, // USB Charger A & C Type
                  ],
                },
              ],
            },
          ],
        };
        // Recalculate cost for sample quote
        let pTotal = 0;
        sample.rooms.forEach((r) => {
          r.boards.forEach((b) => {
            if (b.isCurtain) {
              b.boardCost = (parseInt(b.trackLengthFt || "10") * 500 + 5000 + 6000 + 7100) * b.qty;
            } else {
              const uPriceSum = b.modules.reduce((s, m) => {
                const prod = DEFAULT_PRODUCTS.find((p) => p.id === m.productId);
                const unit = prod ? (prod.noWifi ? prod.price : prod.price + 3500) : 0;
                return s + unit * m.qty;
              }, 0);
              b.boardCost = uPriceSum * b.qty;
            }
            pTotal += b.boardCost;
          });
        });
        const install = pTotal * 0.1;
        const gstVal = (pTotal + install) * 0.18;
        sample.productTotal = pTotal;
        sample.installation = install;
        sample.gst = gstVal;
        sample.grandTotal = pTotal + install + gstVal;

        setQuotes([sample]);
        localStorage.setItem("ln3_quotes", JSON.stringify([sample]));
      }
    } catch (e) {
      console.error("Failed to load quotes", e);
    }

    try {
      const savedProducts = localStorage.getItem("ln3_products");
      if (savedProducts) {
        setProducts(JSON.parse(savedProducts));
      } else {
        setProducts(DEFAULT_PRODUCTS);
        localStorage.setItem("ln3_products", JSON.stringify(DEFAULT_PRODUCTS));
      }
    } catch (e) {
      console.error("Failed to load products master list", e);
      setProducts(DEFAULT_PRODUCTS);
    }
  }, []);

  const saveQuotesList = (list: Quote[]) => {
    setQuotes(list);
    try {
      localStorage.setItem("ln3_quotes", JSON.stringify(list));
    } catch (e) {
      console.error("Failed to persist quotes list", e);
    }
  };

  const handleCreateNew = () => {
    setEditingQuote(null);
    setView("builder");
  };

  const handleEdit = (q: Quote) => {
    setEditingQuote(q);
    setView("builder");
  };

  const handleDuplicate = (q: Quote) => {
    const dup: Quote = {
      ...q,
      id: uid(),
      quoteNumber: `LN-${Date.now().toString().slice(-6)}`,
      date: new Date().toLocaleDateString("en-IN"),
      customerName: q.customerName.includes("(Copy)")
        ? q.customerName
        : `${q.customerName} (Copy)`,
    };
    saveQuotesList([dup, ...quotes]);
  };

  const handleDelete = (id: string) => {
    saveQuotesList(quotes.filter((q) => q.id !== id));
  };

  const handleSaveProducts = (list: Product[]) => {
    setProducts(list);
    try {
      localStorage.setItem("ln3_products", JSON.stringify(list));
    } catch (e) {
      console.error("Failed to persist products list", e);
    }
    setShowAdmin(false);
  };

  const handleBuilderSave = (data: Quote) => {
    if (editingQuote) {
      saveQuotesList(quotes.map((q) => (q.id === editingQuote.id ? { ...data, id: editingQuote.id } : q)));
    } else {
      saveQuotesList([{ ...data, id: uid() }, ...quotes]);
    }
    setView("dashboard");
  };

  return (
    <div className="min-h-screen pb-12 flex flex-col font-sans select-none" style={{ background: "#f5f6f9" }}>
      {/* Dynamic Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm leading-none shrink-0">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={LOGO_B64}
              alt="LazyNest Brand"
              className="h-9 w-auto filter invert"
              style={{ objectFit: "contain" }}
              referrerPolicy="no-referrer"
            />
            <div className="hidden sm:block">
              <div className="text-sm font-black tracking-widest text-neutral-900 uppercase">
                LazyNest
              </div>
              <div className="text-[10px] font-extrabold tracking-widest uppercase mt-0.5" style={{ color: TEAL }}>
                Quotation Builder
              </div>
            </div>
          </div>
          {view === "builder" && (
            <button
              onClick={() => setView("dashboard")}
              className="text-xs text-neutral-400 hover:text-neutral-700 flex items-center gap-1 font-extrabold transition-all cursor-pointer"
            >
              Back to Dashboard <ChevronRight className="w-4 h-4 text-neutral-300" />
            </button>
          )}
        </div>
      </div>

      {/* Main Workspace Frame container */}
      <div className="max-w-6xl mx-auto px-4 py-8 flex-1 w-full scale-100">
        {view === "dashboard" ? (
          <Dashboard
            quotes={quotes}
            products={products}
            onNew={handleCreateNew}
            onEdit={handleEdit}
            onDuplicate={handleDuplicate}
            onDelete={handleDelete}
            onOpenAdmin={() => setShowAdmin(true)}
          />
        ) : (
          <QuoteBuilder
            initialQuote={editingQuote}
            products={products}
            onSave={handleBuilderSave}
            onCancel={() => setView("dashboard")}
          />
        )}
      </div>

      {showAdmin && (
        <AdminPanel
          products={products}
          onSave={handleSaveProducts}
          onClose={() => setShowAdmin(false)}
        />
      )}
    </div>
  );
}

