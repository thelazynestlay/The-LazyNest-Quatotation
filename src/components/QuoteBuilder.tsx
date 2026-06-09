import { useState } from "react";
import { Quote, Room, Board, Module, Product } from "../types";
import {
  ROOM_PRESETS,
  TERMS,
  calcCurtainCost,
  TEAL,
  TEAL_DARK,
  VALID_SIZES,
  MAX_BOARD_SIZE,
} from "../data";
import {
  ArrowLeft,
  Check,
  Plus,
  Trash2,
  Copy,
  Printer,
  Minus,
  HelpCircle,
  Blinds,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  X,
} from "lucide-react";
import { PrintView } from "./PrintView";

// Helper function to generate unique ID
const uid = () => Math.random().toString(36).slice(2, 9);

interface QuoteBuilderProps {
  initialQuote: Quote | null;
  products: Product[];
  onSave: (data: Quote) => void;
  onCancel: () => void;
}

export function QuoteBuilder({
  initialQuote,
  products,
  onSave,
  onCancel,
}: QuoteBuilderProps) {
  // Setup Customer Info state
  const [customer, setCustomer] = useState({
    customerName: initialQuote?.customerName || "",
    mobile: initialQuote?.mobile || "",
    email: initialQuote?.email || "",
    siteAddress: initialQuote?.siteAddress || "",
    projectName: initialQuote?.projectName || "",
    salesExecutive: initialQuote?.salesExecutive || "",
    quoteNumber:
      initialQuote?.quoteNumber || `LN-${Date.now().toString().slice(-6)}`,
    date: initialQuote?.date || new Date().toLocaleDateString("en-IN"),
  });

  // Setup Rooms & Boards
  const [rooms, setRooms] = useState<Room[]>(initialQuote?.rooms || []);
  const [wifiEnabled, setWifiEnabled] = useState(
    initialQuote?.wifiEnabled !== undefined ? initialQuote.wifiEnabled : true
  );
  const [collapsedRooms, setCollapsedRooms] = useState<Record<string, boolean>>({});
  const [showPrint, setShowPrint] = useState(false);

  // Core metrics calculation helpers
  const getBoardModuleSize = (bModules: Module[]) => {
    return bModules.reduce((s, m) => {
      const p = products.find((x) => x.id === m.productId);
      return s + (p ? p.size * m.qty : 0);
    }, 0);
  };

  const validateBoardSize = (totalSize: number) => {
    if (totalSize === 0) return { valid: true, error: null };
    if (totalSize > MAX_BOARD_SIZE) {
      return {
        valid: false,
        error: `Size (${totalSize}M) exceeds the maximum allowed ${MAX_BOARD_SIZE}M.`,
      };
    }
    if (!VALID_SIZES.includes(totalSize)) {
      return {
        valid: false,
        error: `Size (${totalSize}M) must correspond to standard boards: ${VALID_SIZES.join(
          ", "
        )}M.`,
      };
    }
    return { valid: true, error: null };
  };

  // Build temporary on-the-fly summary of entire design
  const buildCurrentSummary = () => {
    let productTotal = 0;
    const updatedRooms = rooms.map((room) => {
      let roomTotal = 0;
      const updatedBoards = room.boards.map((board) => {
        let boardCost = 0;
        if (board.isCurtain) {
          boardCost = calcCurtainCost(board.trackLengthFt) * (board.qty || 1);
        } else {
          const moduleCosts = board.modules.map((m) => {
            const p = products.find((x) => x.id === m.productId);
            const unitPrice = p
              ? p.noWifi || !wifiEnabled
                ? p.price
                : p.price + 3500
              : 0;
            return unitPrice * (m.qty || 1);
          });
          boardCost = moduleCosts.reduce((s, c) => s + c, 0) * (board.qty || 1);
        }
        if (board.selected !== false) {
          roomTotal += boardCost;
        }
        return { ...board, boardCost };
      });
      productTotal += roomTotal;
      return { ...room, boards: updatedBoards, roomTotal };
    });
    const installation = productTotal * 0.1;
    const gst = (productTotal + installation) * 0.18;
    const grandTotal = productTotal + installation + gst;

    return { updatedRooms, productTotal, installation, gst, grandTotal };
  };

  const summary = buildCurrentSummary();

  // Switch boards validations checks group
  const hasValidationErrors = summary.updatedRooms.some((r) =>
    r.boards.some((b) => {
      if (b.isCurtain) return false;
      const size = getBoardModuleSize(b.modules);
      return !validateBoardSize(size).valid;
    })
  );

  // Event handlers
  const handleSave = () => {
    if (hasValidationErrors) return;
    onSave({
      ...customer,
      rooms,
      wifiEnabled,
      grandTotal: summary.grandTotal,
      productTotal: summary.productTotal,
      installation: summary.installation,
      gst: summary.gst,
      savedAt: new Date().toISOString(),
    });
  };

  const addRoom = (name: string = "New Area Room") => {
    setRooms([...rooms, { id: uid(), name, boards: [] }]);
  };

  const deleteRoom = (rid: string) => {
    setRooms(rooms.filter((r) => r.id !== rid));
  };

  const updateRoomName = (rid: string, newName: string) => {
    setRooms(rooms.map((r) => (r.id === rid ? { ...r, name: newName } : r)));
  };

  const duplicateRoom = (room: Room) => {
    setRooms([
      ...rooms,
      {
        ...room,
        id: uid(),
        name: `${room.name} (Copy)`,
        boards: room.boards.map((b) => ({
          ...b,
          id: uid(),
          sbNo: b.sbNo.includes("(Copy)") ? b.sbNo : `${b.sbNo} (Copy)`,
          modules: b.modules.map((m) => ({ ...m, id: uid() })),
        })),
      },
    ]);
  };

  const addBoard = (rid: string, isCurtain: boolean = false) => {
    setRooms(
      rooms.map((r) => {
        if (r.id === rid) {
          const count = r.boards.filter((b) => b.isCurtain === isCurtain).length + 1;
          const prefix = isCurtain ? "CB" : "SB";
          const newBoard: Board = {
            id: uid(),
            sbNo: `${prefix}-${String(count).padStart(2, "0")}`,
            description: isCurtain ? "Motorized Curtain Board" : "",
            modules: [],
            qty: 1,
            remarks: "",
            isCurtain,
            trackLengthFt: isCurtain ? "10" : undefined,
            selected: true,
          };
          return { ...r, boards: [...r.boards, newBoard] };
        }
        return r;
      })
    );
  };

  const deleteBoard = (rid: string, bid: string) => {
    setRooms(
      rooms.map((r) => {
        if (r.id === rid) {
          return { ...r, boards: r.boards.filter((b) => b.id !== bid) };
        }
        return r;
      })
    );
  };

  const updateBoardField = (rid: string, bid: string, field: keyof Board, value: any) => {
    setRooms(
      rooms.map((r) => {
        if (r.id === rid) {
          return {
            ...r,
            boards: r.boards.map((b) => (b.id === bid ? { ...b, [field]: value } : b)),
          };
        }
        return r;
      })
    );
  };

  const addModuleToBoard = (rid: string, bid: string) => {
    setRooms(
      rooms.map((r) => {
        if (r.id === rid) {
          return {
            ...r,
            boards: r.boards.map((b) => {
              if (b.id === bid) {
                return {
                  ...b,
                  modules: [...b.modules, { id: uid(), productId: null, qty: 1 }],
                };
              }
              return b;
            }),
          };
        }
        return r;
      })
    );
  };

  const updateModuleField = (
    rid: string,
    bid: string,
    mid: string,
    field: keyof Module,
    value: any
  ) => {
    setRooms(
      rooms.map((r) => {
        if (r.id === rid) {
          return {
            ...r,
            boards: r.boards.map((b) => {
              if (b.id === bid) {
                return {
                  ...b,
                  modules: b.modules.map((m) =>
                    m.id === mid ? { ...m, [field]: value } : m
                  ),
                };
              }
              return b;
            }),
          };
        }
        return r;
      })
    );
  };

  const deleteModuleFromBoard = (rid: string, bid: string, mid: string) => {
    setRooms(
      rooms.map((r) => {
        if (r.id === rid) {
          return {
            ...r,
            boards: r.boards.map((b) => {
              if (b.id === bid) {
                return { ...b, modules: b.modules.filter((m) => m.id !== mid) };
              }
              return b;
            }),
          };
        }
        return r;
      })
    );
  };

  const toggleRoomCollapse = (rid: string) => {
    setCollapsedRooms({ ...collapsedRooms, [rid]: !collapsedRooms[rid] });
  };

  const fmtINR = (n: number) => {
    return "₹" + Math.round(n).toLocaleString("en-IN");
  };

  return (
    <div className="space-y-6 select-none">
      {/* Controls Bar */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <button
            onClick={onCancel}
            className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center shadow-sm hover:bg-gray-50 active:scale-95 transition-all text-gray-600 cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl md:text-2xl font-black text-gray-900 tracking-tight">
              {initialQuote ? "Edit Room Specification" : "Create New Estimation"}
            </h1>
            <p className="text-xs text-gray-400 font-semibold tracking-wide">
              Configure switches and motors specifically room-wise
            </p>
          </div>
        </div>

        <div className="flex gap-2 flex-wrap w-full sm:w-auto">
          <button
           onClick={() => setShowPrint(true)}
  className="flex-1 sm:flex-none justify-center items-center inline-flex gap-2 px-4 py-2 text-xs font-bold bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 rounded-xl shadow-sm transition-all cursor-pointer"
>
  <Printer className="w-4 h-4" /> Save and download quote
</button>
          <button
            onClick={handleSave}
            disabled={hasValidationErrors}
            className="flex-1 sm:flex-none justify-center items-center inline-flex gap-2 px-5 py-2 text-xs font-bold text-white rounded-xl shadow-md transition-all cursor-pointer disabled:opacity-45 disabled:cursor-not-allowed"
            style={{ background: hasValidationErrors ? "#dc2626" : TEAL }}
          >
            <Check className="w-4 h-4" />
            {hasValidationErrors ? "Resolve Size Conflicts" : "Finalize Estimate"}
          </button>
        </div>
      </div>

      {/* Customer Info Form */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 md:p-6 shadow-sm space-y-4">
        <h2 className="text-[10px] font-black uppercase tracking-widest" style={{ color: TEAL }}>
          CUSTOMER INFORMATION
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { key: "customerName", label: "Client Full Name", placeholder: "e.g. Priyank Patel" },
            { key: "mobile", label: "Mobile Details", placeholder: "e.g. +91 98765 43210" },
            { key: "email", label: "Email Address", placeholder: "e.g. patel@gmail.com" },
            { key: "siteAddress", label: "Site Address", placeholder: "e.g. Villa 24, Marvel Green, Vadodara" },
            { key: "projectName", label: "Project Title", placeholder: "e.g. Duplex Penthouse Automation" },
            { key: "salesExecutive", label: "Consultant Sales Rep", placeholder: "e.g. Sales Executive" },
          ].map((field) => (
            <div key={field.key} className="space-y-1">
              <label className="block text-[10px] text-gray-400 uppercase tracking-wider font-extrabold">
                {field.label}
              </label>
              <input
                value={(customer as any)[field.key]}
                onChange={(e) => setCustomer({ ...customer, [field.key]: e.target.value })}
                placeholder={field.placeholder}
                className="w-full bg-gray-50 border border-gray-200/80 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-teal-400 focus:border-teal-400 focus:outline-none focus:bg-white transition-all font-semibold text-gray-800"
              />
            </div>
          ))}

          {/* Locked Readonly Meta fields */}
          <div className="space-y-1">
            <label className="block text-[10px] text-gray-400 uppercase tracking-wider font-extrabold text-neutral-400/90">
              Quotation Code
            </label>
            <div
              className="bg-neutral-50 px-3 py-2 rounded-xl text-xs font-mono font-black"
              style={{ color: TEAL_DARK }}
            >
              {customer.quoteNumber}
            </div>
          </div>
          <div className="space-y-1">
            <label className="block text-[10px] text-gray-400 uppercase tracking-wider font-extrabold text-neutral-400/90">
              Creation Date
            </label>
            <div className="bg-neutral-50 px-3 py-2 rounded-xl text-xs font-semibold text-neutral-600">
              {customer.date}
            </div>
          </div>
        </div>
      </div>

      {/* Connectivity Mode Settings */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 md:p-6 shadow-sm space-y-4">
        <h2 className="text-[10px] font-black uppercase tracking-widest" style={{ color: TEAL }}>
          WIFI BOARD CONNECTIVITY
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              enable: true,
              label: "Include Smart WiFi Integration",
              desc: "Provides individual WiFi module controller linking Alexa, Google, and mobile applications directly without a gateway hub. (Adds ₹3500 per device, excl. accessories).",
            },
            {
              enable: false,
              label: "Analog Classic Integration",
              desc: "Traditional Elite physical touch panels. Operates manually via responsive touch glass only without remote app capabilities.",
            },
          ].map((mode) => (
            <div
              key={String(mode.enable)}
              onClick={() => setWifiEnabled(mode.enable)}
              className="p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-start gap-4 select-none hover:shadow-sm"
              style={{
                borderColor: wifiEnabled === mode.enable ? TEAL : "#f3f4f6",
                background: wifiEnabled === mode.enable ? `${TEAL}08` : "transparent",
              }}
            >
              <div
                className="w-4 h-4 rounded-full border-2 flex items-center justify-center mt-0.5 shrink-0"
                style={{ borderColor: wifiEnabled === mode.enable ? TEAL : "#d1d5db" }}
              >
                {wifiEnabled === mode.enable && (
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: TEAL }} />
                )}
              </div>
              <div className="space-y-1">
                <div className="text-xs font-extrabold text-neutral-800 leading-none">{mode.label}</div>
                <p className="text-[10px] leading-relaxed text-neutral-400 font-semibold">{mode.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Switch Boards Section Area */}
      <div className="space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h2 className="text-[10px] font-black uppercase tracking-widest text-[#007A73] leading-none mb-1">
            Room-wise Switch Board Allocations
          </h2>
          <button
            onClick={() => addRoom()}
            className="px-3.5 py-1.5 text-xs font-bold bg-[#111111] text-white hover:brightness-110 flex items-center gap-1.5 rounded-xl cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-teal-400" /> Save Room Section
          </button>
        </div>

        {/* Room selection presets buttons */}
        <div className="flex flex-wrap gap-2">
          {ROOM_PRESETS.map((pName) => (
            <button
              key={pName}
              onClick={() => addRoom(pName)}
              className="text-xs px-3.5 py-1.5 rounded-full bg-white border border-gray-200 text-gray-600 hover:border-teal-400 hover:text-teal-500 font-bold transition-all shadow-sm cursor-pointer"
            >
              + {pName}
            </button>
          ))}
        </div>

        {/* Warnings list */}
        {hasValidationErrors && (
          <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold leading-relaxed flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-red-500 shrink-0" />
            <span>
              Configured modules do not resolve correctly into standard plate constraints (plate sizes: 2M, 4M, 6M, 8M, 12M). Please add filler accessories or adjust module allocations.
            </span>
          </div>
        )}

        {/* Rooms empty warning */}
        {summary.updatedRooms.length === 0 && (
          <div className="p-16 border-2 border-dashed border-gray-200 rounded-3xl text-center space-y-3">
            <HelpCircle className="w-10 h-10 text-gray-300 mx-auto" />
            <p className="text-gray-400 text-xs font-bold max-w-xs mx-auto">
              No rooms configured in this estimate yet. Select an area preset folder or click "Save Room Section" above to begin.
            </p>
          </div>
        )}

        {/* Room loops */}
        {summary.updatedRooms.map((room) => {
          const isCollapsed = !!collapsedRooms[room.id];
          return (
            <div key={room.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
              {/* Room Header bar */}
              <div
                className="p-4 text-white flex items-center justify-between gap-3 flex-wrap"
                style={{ background: "#111" }}
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <button
                    onClick={() => toggleRoomCollapse(room.id)}
                    className="p-1 rounded text-neutral-400 hover:text-white hover:bg-neutral-800 transition-all cursor-pointer"
                  >
                    {isCollapsed ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronUp className="w-4 h-4" />
                    )}
                  </button>
                  <input
                    value={room.name}
                    onChange={(e) => updateRoomName(room.id, e.target.value)}
                    className="bg-transparent border-b border-transparent focus:border-teal-400 focus:outline-none text-sm font-black tracking-tight text-white py-0.5 flex-1 min-w-0"
                  />
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-xs font-bold text-neutral-400">
                    Area Total:
                    <span className="ml-1 text-sm font-black" style={{ color: TEAL }}>
                      {fmtINR(room.roomTotal || 0)}
                    </span>
                  </div>
                  <div className="w-[1px] h-4 bg-neutral-800" />
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => duplicateRoom(room)}
                      className="p-1.5 rounded text-neutral-400 hover:bg-neutral-800 hover:text-white transition-all cursor-pointer"
                      title="Clone Area"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => deleteRoom(room.id)}
                      className="p-1.5 rounded text-neutral-400 hover:bg-red-950 hover:text-red-400 transition-all cursor-pointer"
                      title="Delete Area"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Room board items */}
              {!isCollapsed && (
                <div className="p-4 md:p-6 space-y-4">
                  {/* Boards lists */}
                  {room.boards.length === 0 ? (
                    <div className="py-4 text-center text-xs font-medium text-gray-400">
                      No configurations attached. Click below to add regular switch boards or curtain triggers.
                    </div>
                  ) : (
                    room.boards.map((board) => {
                      if (board.isCurtain) {
                        return (
                          <div
                            key={board.id}
                            className={`bg-teal-50/50 border border-teal-200 p-4 rounded-xl space-y-3 shadow-inner transition-opacity duration-200 ${board.selected === false ? "opacity-60" : ""}`}
                          >
                            <div className="flex items-center justify-between gap-3 flex-wrap">
                              <div className="flex items-center gap-2">
                                <input
                                  type="checkbox"
                                  checked={board.selected !== false}
                                  onChange={(e) =>
                                    updateBoardField(room.id, board.id, "selected", e.target.checked)
                                  }
                                  className="w-4 h-4 rounded border-teal-300 text-teal-600 focus:ring-teal-400 cursor-pointer shrink-0"
                                />
                                <Blinds className="w-5 h-5 text-teal-600" />
                                <span className="font-extrabold text-xs text-[#007A73] uppercase tracking-wider">
                                  MOTORIZED CURTAIN BOARD
                                </span>
                                <input
                                  value={board.sbNo}
                                  onChange={(e) =>
                                    updateBoardField(room.id, board.id, "sbNo", e.target.value)
                                  }
                                  className="w-20 bg-white border border-teal-200/80 rounded px-2 py-0.5 text-xs font-mono font-bold text-center text-[#007A73] focus:outline-none"
                                />
                              </div>
                              <button
                                onClick={() => deleteBoard(room.id, board.id)}
                                className="text-gray-400 hover:text-red-500 transition-colors p-1"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                              <div className="space-y-1">
                                <label className="block text-[9px] font-bold text-teal-700 uppercase tracking-wider">
                                  Board Description
                                </label>
                                <input
                                  value={board.description}
                                  onChange={(e) =>
                                    updateBoardField(room.id, board.id, "description", e.target.value)
                                  }
                                  placeholder="e.g. Master Slide Curtain"
                                  className="w-full bg-white border border-teal-200/80 rounded-lg px-2.5 py-1.5 text-xs focus:ring-1 focus:ring-teal-400 focus:border-teal-400 focus:outline-none font-semibold text-gray-800"
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="block text-[9px] font-bold text-teal-700 uppercase tracking-wider">
                                  Track length (ft)
                                </label>
                                <input
                                  type="number"
                                  min="1"
                                  value={board.trackLengthFt || ""}
                                  onChange={(e) =>
                                    updateBoardField(room.id, board.id, "trackLengthFt", e.target.value)
                                  }
                                  className="w-full bg-white border border-teal-200/80 rounded-lg px-2.5 py-1.5 text-xs focus:ring-1 focus:ring-teal-400 focus:border-teal-400 focus:outline-none font-mono font-black"
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="block text-[9px] font-bold text-teal-700 uppercase tracking-wider">
                                  Device Quantity
                                </label>
                                <input
                                  type="number"
                                  min="1"
                                  value={board.qty}
                                  onChange={(e) =>
                                    updateBoardField(
                                      room.id,
                                      board.id,
                                      "qty",
                                      parseInt(e.target.value) || 1
                                    )
                                  }
                                  className="w-full bg-white border border-teal-200/80 rounded-lg px-2.5 py-1.5 text-xs text-center focus:ring-1 focus:ring-teal-400 focus:border-teal-400 focus:outline-none font-bold"
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="block text-[9px] font-bold text-teal-700 uppercase tracking-wider">
                                  Any Specific Remarks
                                </label>
                                <input
                                  value={board.remarks}
                                  onChange={(e) =>
                                    updateBoardField(room.id, board.id, "remarks", e.target.value)
                                  }
                                  placeholder="e.g. Master Bedroom blinds"
                                  className="w-full bg-white border border-teal-200/80 rounded-lg px-2.5 py-1.5 text-xs focus:ring-1 focus:ring-teal-400 focus:border-teal-400 focus:outline-none font-semibold text-gray-500"
                                />
                              </div>
                            </div>
                            <div className="flex justify-between items-center bg-teal-100/40 p-2.5 rounded-lg border border-teal-200/30 text-xs">
                              <span className="text-teal-700 font-semibold">
                                Board Rate + Switch Setup (x{board.qty})
                              </span>
                              <span className="font-black text-[#007A73]">
                                {fmtINR(calcCurtainCost(board.trackLengthFt) * board.qty)}
                              </span>
                            </div>
                          </div>
                        );
                      }

                      // Regular Touch switch boards
                      const totalSize = getBoardModuleSize(board.modules);
                      const sizeValidation = validateBoardSize(totalSize);

                      return (
                        <div
                          key={board.id}
                          className={`p-4 rounded-xl border border-gray-150 space-y-3 transition-opacity duration-200 ${
                            sizeValidation.valid ? "bg-white" : "bg-red-50/50 border-red-200"
                          } ${board.selected === false ? "opacity-60" : ""}`}
                        >
                          {/* Board Top line config */}
                          <div className="flex items-center justify-between gap-3 flex-wrap">
                            <div className="flex items-center gap-2 flex-1 min-w-0">
                              <input
                                type="checkbox"
                                checked={board.selected !== false}
                                onChange={(e) =>
                                  updateBoardField(room.id, board.id, "selected", e.target.checked)
                                }
                                className="w-4 h-4 rounded border-gray-300 text-teal-600 focus:ring-teal-400 cursor-pointer shrink-0"
                              />
                              <input
                                value={board.sbNo}
                                onChange={(e) =>
                                  updateBoardField(room.id, board.id, "sbNo", e.target.value)
                                }
                                className="w-20 bg-gray-50 border border-gray-200 rounded-lg px-2 py-1 text-xs text-center font-mono font-bold text-neutral-700 focus:outline-none"
                              />
                              <input
                                value={board.description}
                                onChange={(e) =>
                                  updateBoardField(room.id, board.id, "description", e.target.value)
                                }
                                placeholder="Device Switchboard Area (e.g. Near Entry)"
                                className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-1 text-xs font-semibold focus:outline-none min-w-[120px]"
                              />
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="flex items-center gap-1 text-xs font-semibold text-gray-500">
                                <span>Qty:</span>
                                <input
                                  type="number"
                                  min="1"
                                  value={board.qty}
                                  onChange={(e) =>
                                    updateBoardField(
                                      room.id,
                                      board.id,
                                      "qty",
                                      parseInt(e.target.value) || 1
                                    )
                                  }
                                  className="w-10 bg-gray-50 border border-gray-200 rounded-lg px-1.5 py-0.5 text-center focus:outline-none font-bold"
                                />
                              </div>
                              <div className="w-[1px] h-4 bg-gray-200" />
                              <button
                                onClick={() => deleteBoard(room.id, board.id)}
                                className="text-gray-300 hover:text-red-500 transition-colors p-1"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                          {/* Board contained modules */}
                          <div className="space-y-2 pl-2">
                            {board.modules.map((m) => {
                              const activeProduct = products.find((x) => x.id === m.productId);
                              return (
                                <div key={m.id} className="flex gap-2 items-center flex-wrap sm:flex-nowrap">
                                  <select
                                    value={m.productId || ""}
                                    onChange={(e) =>
                                      updateModuleField(
                                        room.id,
                                        board.id,
                                        m.id,
                                        "productId",
                                        e.target.value ? parseInt(e.target.value) : null
                                      )
                                    }
                                    className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs font-semibold focus:outline-none min-w-0"
                                  >
                                    <option value="">Select Modular Board Option...</option>
                                    {[2, 4, 6, 8, 12, 0].map((sz) => (
                                      <optgroup
                                        key={sz}
                                        label={sz === 0 ? "Accessories" : `${sz}M Module Switches`}
                                      >
                                        {products
                                          .filter((p) => p.size === sz)
                                          .map((p) => (
                                            <option key={p.id} value={p.id}>
                                              {p.displayName} (Size: {p.size > 0 ? `${p.size}M` : "—"})
                                            </option>
                                          ))}
                                      </optgroup>
                                    ))}
                                  </select>

                                  <div className="text-xs font-semibold text-gray-400 select-none hidden sm:block shrink-0 w-8 text-center">
                                    {activeProduct && activeProduct.size > 0
                                      ? `${activeProduct.size}M`
                                      : "—"}
                                  </div>

                                  <div className="flex items-center gap-1.5">
                                    <button
                                      onClick={() =>
                                        updateModuleField(room.id, board.id, m.id, "qty", Math.max(1, m.qty - 1))
                                      }
                                      className="w-6 h-6 border border-gray-200 bg-white rounded-lg flex items-center justify-center hover:bg-gray-50 text-gray-500 cursor-pointer"
                                    >
                                      <Minus className="w-3.5 h-3.5" />
                                    </button>
                                    <span className="w-8 text-center text-xs font-black">{m.qty}</span>
                                    <button
                                      onClick={() =>
                                        updateModuleField(room.id, board.id, m.id, "qty", m.qty + 1)
                                      }
                                      className="w-6 h-6 border border-gray-200 bg-white rounded-lg flex items-center justify-center hover:bg-gray-50 text-gray-500 cursor-pointer"
                                    >
                                      <Plus className="w-3.5 h-3.5" />
                                    </button>
                                  </div>

                                  <button
                                    onClick={() => deleteModuleFromBoard(room.id, board.id, m.id)}
                                    className="p-1 border border-neutral-100 text-neutral-400 hover:text-red-500 transition-colors rounded-lg cursor-pointer"
                                  >
                                    <X className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              );
                            })}

                            <button
                              onClick={() => addModuleToBoard(room.id, board.id)}
                              className="text-xs font-bold text-gray-400 hover:text-teal-500 flex items-center gap-1 py-1 rounded transition-colors"
                            >
                              <Plus className="w-3.5 h-3.5" /> Add Switch Component
                            </button>
                          </div>

                          {/* Board Verification details */}
                          {board.modules.length > 0 && (
                            <div className="flex items-center justify-between border-t border-gray-50 pt-2 flex-wrap gap-2">
                              <div className="flex items-center gap-2">
                                <span
                                  className={`text-xs font-extrabold flex items-center gap-1 ${
                                    sizeValidation.valid ? "text-neutral-500" : "text-red-600"
                                  }`}
                                >
                                  {!sizeValidation.valid && (
                                    <AlertTriangle className="w-4 h-4 text-red-500 animate-bounce" />
                                  )}
                                  Configured plate size: {totalSize}M / {MAX_BOARD_SIZE}M
                                </span>
                                {sizeValidation.error && (
                                  <span className="text-[10px] text-red-500 font-bold">
                                    ({sizeValidation.error})
                                  </span>
                                )}
                              </div>
                              <div className="text-right">
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mr-1">
                                  Segment price sum:
                                </span>
                                <span className="font-extrabold text-gray-800 text-xs">
                                  {fmtINR(board.boardCost || 0)}
                                </span>
                              </div>
                            </div>
                          )}

                          {/* Remarks field */}
                          <input
                            value={board.remarks}
                            onChange={(e) =>
                              updateBoardField(room.id, board.id, "remarks", e.target.value)
                            }
                            placeholder="Add segment notes (e.g. Master Switch, entry controls, 16A Power line)..."
                            className="w-full bg-gray-50 border border-gray-100 rounded-lg px-2.5 py-1.5 text-xs text-gray-500 focus:outline-none focus:bg-white focus:border-gray-200 transition-all font-medium"
                          />
                        </div>
                      );
                    })
                  )}

                  {/* Add boards trigger handles */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => addBoard(room.id)}
                      className="flex-1 py-2.5 rounded-xl border border-dashed text-xs font-bold text-gray-400 hover:text-teal-500 hover:border-teal-200/80 transition-all bg-gray-50/50 cursor-pointer text-center"
                    >
                      <Plus className="w-4 h-4 inline mr-1" /> Touch Switch Board
                    </button>
                    <button
                      onClick={() => addBoard(room.id, true)}
                      className="flex-1 py-2.5 rounded-xl border border-dashed text-xs font-bold transition-all bg-teal-50/20 cursor-pointer text-center border-teal-200/40 text-teal-600 hover:text-teal-700 hover:border-teal-300"
                    >
                      <Blinds className="w-4 h-4 inline mr-1 text-teal-500" /> Motorized Curtain Board
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Internal summaries cost admin card */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 md:p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-gray-50 pb-2 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span
              className="text-xs font-black uppercase tracking-widest text-[#007A73]"
            >
              Consultant Calculations Summary
            </span>
            <span className="text-[9px] px-2 py-0.5 bg-amber-100 text-amber-800 rounded font-black uppercase tracking-wider">
              Internal Estimates — Hidden on Client layout
            </span>
          </div>
        </div>

        <div className="space-y-3 font-semibold text-gray-600 text-xs">
          <div className="flex justify-between">
            <span>Sum Total:</span>
            <span className="font-extrabold text-neutral-800">{fmtINR(summary.productTotal)}</span>
          </div>
          <div className="flex justify-between">
            <span>Installation &amp; Integration Charge (10%):</span>
            <span className="font-extrabold text-[#007A73]">{fmtINR(summary.installation)}</span>
          </div>
          <div className="flex justify-between">
            <span>Standard GST Applicable (18%):</span>
            <span className="font-extrabold text-neutral-800">{fmtINR(summary.gst)}</span>
          </div>
          <div className="border-t border-gray-100 pt-3 flex justify-between items-center text-sm font-black">
            <span className="text-gray-900">Total payable quotation (All inclusive):</span>
            <span className="text-xl tracking-tight" style={{ color: TEAL }}>
              {fmtINR(summary.grandTotal)}
            </span>
          </div>
        </div>
      </div>

      {/* Terms list */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm space-y-3">
        <h3 className="text-[10px] font-black uppercase tracking-widest text-neutral-400">
          PROJECT TERMS &AMP; REMARKS
        </h3>
        <ol className="space-y-1 text-xs text-neutral-400 font-semibold">
          {TERMS.map((termText, tIdx) => (
            <li key={tIdx} className="flex gap-2">
              <span className="font-black text-teal-500">{tIdx + 1}.</span>
              <span>{termText}</span>
            </li>
          ))}
        </ol>
      </div>

      {/* Document print window trigger */}
      {showPrint && (
        <PrintView
          quote={{ ...customer, rooms, wifiEnabled }}
          wifiEnabled={wifiEnabled}
          products={products}
          onClose={() => setShowPrint(false)}
        />
      )}
    </div>
  );
}

export default QuoteBuilder;
