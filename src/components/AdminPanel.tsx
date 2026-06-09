import React, { useState } from "react";
import { Product } from "../types";
import { TEAL, VALID_SIZES, LOGO_B64 } from "../data";
import { Settings, X, Plus, Trash2, Search, Lock, Eye, EyeOff } from "lucide-react";

interface AdminPanelProps {
  products: Product[];
  onSave: (list: Product[]) => void;
  onClose: () => void;
}

export function AdminPanel({ products, onSave, onClose }: AdminPanelProps) {
  const [list, setList] = useState<Product[]>(products.map((p) => ({ ...p })));
  const [newName, setNewName] = useState("");
  const [newDisplay, setNewDisplay] = useState("");
  const [newSize, setNewSize] = useState("4");
  const [newPrice, setNewPrice] = useState("");
  const [newNoWifi, setNewNoWifi] = useState(false);
  const [search, setSearch] = useState("");

  // Authorization states
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem("ln3_admin_auth") === "true";
  });
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const filtered = list.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.displayName.toLowerCase().includes(search.toLowerCase())
  );

  const addProduct = () => {
    if (!newName.trim() || !newPrice) return;
    const id = Math.max(...list.map((p) => p.id), 0) + 1;
    setList([
      ...list,
      {
        id,
        name: newName.trim(),
        displayName: newDisplay.trim() || newName.trim(),
        size: parseInt(newSize) || 0,
        price: parseInt(newPrice) || 0,
        noWifi: newNoWifi,
      },
    ]);
    setNewName("");
    setNewDisplay("");
    setNewPrice("");
    setNewNoWifi(false);
    setNewSize("4");
  };

  const deleteProduct = (id: number) => {
    setList(list.filter((p) => p.id !== id));
  };

  const updateProduct = (id: number, key: keyof Product, val: any) => {
    setList(
      list.map((p) => {
        if (p.id === id) {
          if (key === "price" || key === "size") {
            return { ...p, [key]: parseInt(val) || 0 };
          }
          return { ...p, [key]: val };
        }
        return p;
      })
    );
  };

  const handleVerify = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (password === "Lazynest@123") {
      setIsAuthenticated(true);
      sessionStorage.setItem("ln3_admin_auth", "true");
      setError("");
    } else {
      setError("Authorization failed: Invalid supervisor credentials.");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 bg-black/85 z-50 flex items-center justify-center p-4 backdrop-blur-md animate-fadeIn">
        <div id="admin-auth-card" className="bg-white rounded-3xl shadow-2xl w-full max-w-sm border border-gray-100 overflow-hidden transform transition-all p-6 space-y-6">
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="bg-[#111111] p-3.5 rounded-2xl shadow-inner inline-flex items-center justify-center">
              <img
                src={LOGO_B64}
                alt="LazyNest Logo"
                className="h-10 w-10 object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="space-y-1">
              <h2 className="text-sm font-black text-gray-900 tracking-wider uppercase">Catalog Authorization</h2>
              <p className="text-[11px] text-gray-400 font-medium max-w-xs leading-normal">
                Supervisor access is required to edit the global equipment list, customize pricing formulas, or alter modules.
              </p>
            </div>
          </div>

          <form onSubmit={handleVerify} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[9px] text-gray-400 font-black uppercase tracking-widest pl-1">
                Enter Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError("");
                  }}
                  placeholder="e.g. ••••••••••••"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-3 pr-10 py-2.5 text-xs focus:ring-1 focus:ring-teal-400 focus:border-teal-400 focus:outline-none font-semibold shadow-sm transition-all text-gray-800 tracking-wide"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {error && (
                <p className="text-[10px] font-bold text-red-500 flex items-center gap-1 mt-1 pl-1">
                  <Lock className="w-3.5 h-3.5 animate-bounce" /> {error}
                </p>
              )}
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 border border-gray-200 rounded-xl text-[10px] font-extrabold uppercase tracking-wider text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-all cursor-pointer text-center"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-xl text-[10px] font-extrabold uppercase tracking-wider text-white shadow-md hover:brightness-110 transition-all cursor-pointer text-center flex items-center justify-center gap-1.5"
                style={{ background: TEAL }}
              >
                <Lock className="w-3.5 h-3.5" /> Authorize
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-start justify-center p-4 overflow-auto animate-fadeIn backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl mt-8 mb-8 border border-gray-100 overflow-hidden">
        {/* Header bar */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-gray-50/50">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shadow-inner"
              style={{ background: TEAL }}
            >
              <Settings className="text-white w-5 h-5" />
            </div>
            <div>
              <h2 className="font-black text-gray-900 text-lg">Admin Panel — Product Master</h2>
              <p className="text-xs text-gray-400">
                {list.length} products · Changes affect all new switch board configurations
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => onSave(list)}
              className="px-4 py-2 text-xs font-bold text-white rounded-lg shadow-sm hover:brightness-110 transition-all cursor-pointer"
              style={{ background: TEAL }}
            >
              Save Key Settings
            </button>
            <button
              onClick={onClose}
              className="p-2 border border-gray-200 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-5">
          {/* Add Product Form */}
          <div className="p-5 rounded-xl bg-gray-50 border border-gray-200/80 space-y-3 shadow-inner">
            <p className="text-xs font-bold uppercase tracking-wider text-gray-500">Add New Touch Switch / Accessory</p>
            <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
              <input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Full Switch Name (e.g. Elite Touch 4 Switch)"
                className="md:col-span-2 bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-teal-400 focus:border-teal-400 focus:outline-none shadow-sm font-medium"
              />
              <input
                value={newDisplay}
                onChange={(e) => setNewDisplay(e.target.value)}
                placeholder="Short Display (e.g. 4 Switch)"
                className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-teal-400 focus:border-teal-400 focus:outline-none shadow-sm font-medium"
              />
              <select
                value={newSize}
                onChange={(e) => setNewSize(e.target.value)}
                className="bg-white border border-gray-200 rounded-lg px-2 py-2 text-xs focus:ring-1 focus:ring-teal-400 focus:border-teal-400 focus:outline-none shadow-sm cursor-pointer"
              >
                <option value="0">Accessory (0M)</option>
                {VALID_SIZES.map((s) => (
                  <option key={s} value={s}>
                    {s}M Module
                  </option>
                ))}
              </select>
              <input
                type="number"
                value={newPrice}
                onChange={(e) => setNewPrice(e.target.value)}
                placeholder="Base Price (₹)"
                className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-teal-400 focus:border-teal-400 focus:outline-none shadow-sm font-mono font-medium"
              />
              <div className="flex items-center justify-between md:justify-around gap-2">
                <label className="flex items-center gap-1.5 text-xs text-gray-600 font-medium cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={newNoWifi}
                    onChange={(e) => setNewNoWifi(e.target.checked)}
                    className="rounded border-gray-300 text-teal-500 focus:ring-teal-400 w-3.5 h-3.5"
                  />
                  No WiFi
                </label>
                <button
                  onClick={addProduct}
                  className="px-3 py-1.5 text-xs font-bold text-white rounded-lg hover:opacity-90 transition-all flex items-center gap-1 shadow-sm cursor-pointer"
                  style={{ background: TEAL }}
                >
                  <Plus className="w-3.5 h-3.5" /> Add
                </button>
              </div>
            </div>
          </div>

          {/* Search bar */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search components, modules, sockets..."
              className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:ring-1 focus:ring-teal-400 focus:border-teal-400 focus:outline-none shadow-sm"
            />
          </div>

          {/* Catalog grid */}
          <div className="border border-gray-100 rounded-xl overflow-hidden shadow-sm">
            <div className="grid grid-cols-[3fr_2fr_1fr_1.5fr_1fr_40px] gap-2 px-4 py-2 bg-gray-900 text-white text-xs font-bold uppercase tracking-wider sticky top-0 items-center">
              <span>Full Device Name</span>
              <span>Display Tag</span>
              <span className="text-center">Size</span>
              <span className="text-right">Unit Price</span>
              <span className="text-center">WiFi Block</span>
              <span></span>
            </div>
            <div className="max-h-[380px] overflow-y-auto divide-y divide-gray-100">
              {filtered.length === 0 ? (
                <div className="p-8 text-center text-gray-400 text-xs font-medium">No matching items found</div>
              ) : (
                filtered.map((item) => (
                  <div
                    key={item.id}
                    className="grid grid-cols-[3fr_2fr_1fr_1.5fr_1fr_40px] gap-2 items-center px-4 py-2 hover:bg-gray-50 transition-colors"
                  >
                    <input
                      value={item.name}
                      onChange={(e) => updateProduct(item.id, "name", e.target.value)}
                      className="text-xs font-semibold bg-transparent focus:bg-white border-b border-transparent focus:border-gray-200 focus:outline-none py-1 px-1 rounded text-gray-800 focus:shadow-sm"
                    />
                    <input
                      value={item.displayName}
                      onChange={(e) => updateProduct(item.id, "displayName", e.target.value)}
                      className="text-xs bg-transparent focus:bg-white border-b border-transparent focus:border-gray-200 focus:outline-none py-1 px-1 rounded text-gray-600 focus:shadow-sm"
                    />
                    <div className="text-center">
                      <select
                        value={item.size}
                        onChange={(e) => updateProduct(item.id, "size", e.target.value)}
                        className="text-xs bg-gray-50 border border-gray-200 rounded px-1.5 py-0.5 focus:outline-none font-semibold text-gray-700"
                      >
                        <option value="0">0M</option>
                        {VALID_SIZES.map((s) => (
                          <option key={s} value={s}>
                            {s}M
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="text-right font-mono font-bold text-gray-800 flex items-center justify-end gap-1 text-xs">
                      <span>₹</span>
                      <input
                        type="number"
                        value={item.price}
                        onChange={(e) => updateProduct(item.id, "price", e.target.value)}
                        className="w-16 bg-gray-50 border border-gray-200 rounded px-1.5 py-0.5 text-right font-mono font-bold text-gray-800 focus:bg-white focus:outline-none"
                      />
                    </div>
                    <div className="text-center">
                      <input
                        type="checkbox"
                        checked={!!item.noWifi}
                        onChange={(e) => updateProduct(item.id, "noWifi", e.target.checked)}
                        className="rounded border-gray-300 text-teal-500 focus:ring-teal-400 w-3.5 h-3.5 cursor-pointer"
                      />
                    </div>
                    <div className="flex justify-end">
                      <button
                        onClick={() => deleteProduct(item.id)}
                        className="text-gray-300 hover:text-red-500 transition-colors p-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
