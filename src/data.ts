import { Product } from "./types";

export const TEAL = "#00BFB3";
export const TEAL_DARK = "#007A73";
export const VALID_SIZES = [2, 4, 6, 8, 12];
export const MAX_BOARD_SIZE = 12;
export const WIFI_PRICE = 3500;

// Curtain formula constants
export const CURTAIN_PER_FT = 500;
export const CURTAIN_TRACK_BASE = 5000;
export const CURTAIN_MOTOR = 6000;
export const CURTAIN_SWITCH = 7100;

export const DEFAULT_PRODUCTS: Product[] = [
  { id:1,  name:"IR Remote Control",                            displayName:"IR Remote Control",                          size:0, price:420,   noWifi:true },
  { id:2,  name:"Wifi Dongle",                                  displayName:"Wifi Dongle",                                size:0, price:3500,  noWifi:true },
  { id:3,  name:"Laze IR Blaster",                              displayName:"IR Blaster",                                 size:0, price:2760,  noWifi:true },
  { id:4,  name:"Elite Touch Door Bell",                        displayName:"Door Bell",                                  size:2, price:2160,  noWifi:true },
  { id:5,  name:"Elite Touch 2 Switch (1-2way)",                displayName:"2 Switch (1-2way)",                          size:2, price:3480  },
  { id:6,  name:"Elite Touch 2 Switch (1-16A)",                 displayName:"2 Switch (1-16A)",                           size:2, price:3600  },
  { id:7,  name:"Elite Touch 4 Switch Scene Control",           displayName:"4 Switch Scene Control",                     size:2, price:3720  },
  { id:8,  name:"Elite Touch 2 Dimmer",                         displayName:"2 Dimmer",                                   size:2, price:4440  },
  { id:9,  name:"Elite Touch 2 Switch 1 Socket",                displayName:"2 Switch 1 Socket",                          size:4, price:4140  },
  { id:10, name:"Touch 2 Switch (1-16A) 1 Socket (16A Socket)", displayName:"2 Switch (16A) 1 Socket",                   size:4, price:4380  },
  { id:11, name:"Elite Touch 4 Switch",                         displayName:"4 Switch",                                   size:4, price:5160  },
  { id:12, name:"Elite Touch 4 Switch 1 Fan regulator",         displayName:"4 Switch 1 Fan Regulator",                   size:4, price:6960  },
  { id:13, name:"Elite Touch 4 Dimmer",                         displayName:"4 Dimmer",                                   size:6, price:8460  },
  { id:14, name:"Elite Touch 2 Switch 2 Socket",                displayName:"2 Switch 2 Socket",                          size:6, price:4860  },
  { id:15, name:"Elite Touch 2 Switch (1-16A) 2 Socket",        displayName:"2 Switch (16A) 2 Socket",                   size:6, price:5100  },
  { id:16, name:"Elite Touch 4 Switch 1 Socket",                displayName:"4 Switch 1 Socket",                          size:6, price:5880  },
  { id:17, name:"Elite Touch 6 Switch",                         displayName:"6 Switch",                                   size:6, price:6780  },
  { id:18, name:"Elite Touch 8 Switch (6M)",                    displayName:"8 Switch",                                   size:6, price:8040  },
  { id:19, name:"Elite Touch 6 Switch 1 Socket",                displayName:"6 Switch 1 Socket",                          size:6, price:7140  },
  { id:20, name:"Elite Touch 4 Switch 1 Fan 1 Socket",          displayName:"4 Switch 1 Fan 1 Socket",                    size:6, price:7680  },
  { id:21, name:"Elite Touch 6 Switch 1 Fan (6M)",              displayName:"6 Switch 1 Fan",                             size:6, price:8700  },
  { id:22, name:"Elite Touch 4 Switch 2 Fan",                   displayName:"4 Switch 2 Fan",                             size:6, price:9120  },
  { id:23, name:"Elite Touch 2 Switch 2 Socket (8M)",           displayName:"2 Switch 2 Socket",                          size:8, price:5448  },
  { id:24, name:"Elite Touch 2 (1-16A) Switch 3 Socket",        displayName:"2 Switch (16A) 3 Socket",                   size:8, price:5928  },
  { id:25, name:"Elite Touch 6 Switch 1 Fan (8M)",              displayName:"6 Switch 1 Fan",                             size:8, price:9288  },
  { id:26, name:"Elite Touch 8 Switch (8M)",                    displayName:"8 Switch",                                   size:8, price:8628  },
  { id:27, name:"Elite Touch 6 Switch 1 Fan 1 Socket (8M)",     displayName:"6 Switch 1 Fan 1 Socket",                   size:8, price:9648  },
  { id:28, name:"Elite Touch 6 Switch 1 Socket (8M)",           displayName:"6 Switch 1 Socket",                          size:8, price:7728  },
  { id:29, name:"Elite Touch 8 Switch 1 Socket",                displayName:"8 Switch 1 Socket",                          size:8, price:8988  },
  { id:30, name:"Elite Touch 4 Switch 2 Socket",                displayName:"4 Switch 2 Socket",                          size:8, price:6828  },
  { id:31, name:"Elite Touch 6 Switch 2 Socket (8M)",           displayName:"6 Switch 2 Socket",                          size:8, price:8088  },
  { id:32, name:"Elite Touch 10 Switch",                        displayName:"10 Switch",                                  size:8, price:9888  },
  { id:33, name:"Elite Touch 6 Switch 2 Fan",                   displayName:"6 Switch 2 Fan",                             size:8, price:10968 },
  { id:34, name:"Elite Touch 4 Switch 1 Fan 1 Socket (12M)",    displayName:"4 Switch 1 Fan 1 Socket",                   size:12,price:9180  },
  { id:35, name:"Elite Touch 4 Switch 1 Fan 2 Socket",          displayName:"4 Switch 1 Fan 2 Socket",                   size:12,price:9540  },
  { id:36, name:"Elite Touch 6 Switch 1 Fan 1 Socket (12M)",    displayName:"6 Switch 1 Fan 1 Socket",                   size:12,price:10560 },
  { id:37, name:"Elite Touch 6 Switch 1 Fan 2 Socket",          displayName:"6 Switch 1 Fan 2 Socket",                   size:12,price:10920 },
  { id:38, name:"Elite Touch 8 Switch 1 Fan 1 Socket",          displayName:"8 Switch 1 Fan 1 Socket",                   size:12,price:13200 },
  { id:39, name:"Elite Touch 8 Switch 1 Fan 2 Socket",          displayName:"8 Switch 1 Fan 2 Socket",                   size:12,price:13560 },
  { id:40, name:"Elite Touch 10 Switch 1 Fan 2 Socket",         displayName:"10 Switch 1 Fan 2 Socket",                  size:12,price:14820 },
  { id:41, name:"Elite Touch 8 Switch 2 Fan 2 Socket",          displayName:"8 Switch 2 Fan 2 Socket",                   size:12,price:15360 },
  { id:42, name:"Elite Touch 12 Switch 2 Fan",                  displayName:"12 Switch 2 Fan",                            size:12,price:17400 },
  { id:43, name:"Elite Touch 6 Switch 2 Socket (12M)",          displayName:"6 Switch 2 Socket",                          size:12,price:9000  },
  { id:44, name:"Elite Touch 12 Switch",                        displayName:"12 Switch",                                  size:12,price:13560 },
  { id:45, name:"Elite Touch 12 Switch 2 Socket",               displayName:"12 Switch 2 Socket",                         size:12,price:14280 },
  { id:46, name:"Elite Touch 8 Switch 1 Socket (12M)",          displayName:"8 Switch 1 Socket",                          size:12,price:9900  },
  { id:47, name:"Elite Touch 8 Switch 2 Socket (12M)",          displayName:"8 Switch 2 Socket",                          size:12,price:10260 },
  { id:48, name:"Elite Touch 10 Switch 2 Socket",               displayName:"10 Switch 2 Socket",                         size:12,price:12900 },
  { id:49, name:"Elite Touch 16 Switch",                        displayName:"16 Switch",                                  size:12,price:16080 },
  { id:50, name:"Elite Touch Curtain Switch",                   displayName:"Curtain Switch",                             size:2, price:3600,  noWifi:true },
  { id:51, name:"Elite Touch USB Charger A & C Type",           displayName:"USB Charger A & C",                          size:2, price:3000,  noWifi:true },
  { id:52, name:"Elite Socket 6 AMP",                           displayName:"Socket 6A",                                  size:2, price:1200,  noWifi:true },
  { id:53, name:"Elite 16A Socket",                             displayName:"Socket 16A",                                 size:2, price:1320,  noWifi:true },
  { id:54, name:"Elite Touch 4 Switch (Master)",                displayName:"4 Switch (Master)",                          size:4, price:5160  },
  { id:55, name:"Elite Touch 2 Dimmer 2 Switch",                displayName:"2 Dimmer 2 Switch",                          size:4, price:6960  },
  { id:56, name:"Elite Touch 2 Dimmer 6 Switch (Fan, AC)",      displayName:"2 Dimmer 6 Switch (Fan, AC)",               size:8, price:9288  },
  { id:57, name:"Elite Touch 6 Switch 1 Socket (Master)",       displayName:"6 Switch 1 Socket (Master)",                 size:6, price:7140  },
  { id:58, name:"Elite Touch 4 Switch 1 Socket USB",            displayName:"4 Switch 1 Socket USB",                      size:8, price:6828  },
  { id:59, name:"Elite Touch 2 Switch 2 Socket USB",            displayName:"2 Switch 2 Socket USB",                      size:8, price:5448  },
  { id:60, name:"Elite Touch 2 Dimmer 6 Switch (Fan, Master)",  displayName:"2 Dimmer 6 Switch (Fan, Master)",           size:8, price:9288  },
  { id:61, name:"Elite Touch 2 Dimmer 6 Switch (Master)",       displayName:"2 Dimmer 6 Switch (Master)",                 size:8, price:9288  },
  { id:62, name:"Elite Touch 6 Switch 2 Socket (Master)",       displayName:"6 Switch 2 Socket",                          size:8, price:8088  },
  { id:63, name:"Elite Touch 4 Switch 2 Socket (8M)",           displayName:"4 Switch 2 Socket",                          size:8, price:6828  },
  { id:64, name:"Elite Touch 4 Switch 1 Socket (8M)",           displayName:"4 Switch 1 Socket",                          size:8, price:6828  },
  { id:65, name:"Elite Touch 4 Switch 1 Fan (8M)",              displayName:"4 Switch 1 Fan",                             size:8, price:9288  },
];

export const TERMS = [
  "All taxes applicable as per government norms.",
  "Touch Switches carry 10-year warranty.",
  "Physical damage and voltage fluctuations are not covered under warranty.",
  "Installation and integration charges are extra.",
  "Quotation valid for 15 days from the date of issue.",
];

export const ROOM_PRESETS = [
  "Foyer",
  "Living & Dining",
  "Kitchen",
  "Guest Bedroom",
  "Office Room",
  "Master Bedroom",
  "Kids Bedroom",
  "Balcony",
  "Mandir",
  "Curtain Board",
  "Bathroom",
  "Utility Room"
];

// LazyNest logo - beautiful white vector SVG circuit/smart-living house design matching the official logo
export const LOGO_B64 = // LazyNest logo - beautiful white vector SVG circuit/smart-living house design matching the official logo
export const LOGO_B64 = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIiBmaWxsPSJub25lIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCI+PHBhdGggZD0iTSA1NiA3MyBMIDMyIDczIEwgMzIgNTUgTCA1MCAzNyBMIDY4IDU1IEwgNjggODUgTCAyMCA4NSBMIDIwIDQ1IEwgNTAgMTUgTCA8MCA0NSBMIDgwIDg1IiAvPjxjaXJjbGUgY3g9IjU2IiBjeT0iNzMiIHI9IjQuNSIgZmlsbD0id2hpdGUiIHN0cm9rZT0ibm9uZSIgLz48Y2lyY2xlIGN4PSI4MCIgY3k9Ijg1IiByPSI0LjUiIGZpbGw9IndoaXRlIiBzdHJva2U9Im5vbmUiIC8+PC9zdmc+";

export function calcCurtainCost(trackLengthFt: string | undefined): number {
  const ft = parseFloat(trackLengthFt || "0") || 0;
  return ft * CURTAIN_PER_FT + CURTAIN_TRACK_BASE + CURTAIN_MOTOR + CURTAIN_SWITCH;
}


