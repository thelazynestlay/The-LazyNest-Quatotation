export interface Product {
  id: number;
  name: string;
  displayName: string;
  size: number;
  price: number;
  noWifi?: boolean;
}

export interface Module {
  id: string;
  productId: number | null;
  qty: number;
}

export interface Board {
  id: string;
  sbNo: string;
  description: string;
  modules: Module[];
  qty: number;
  remarks: string;
  isCurtain?: boolean;
  trackLengthFt?: string;
  boardCost?: number;
  selected?: boolean;
}

export interface Room {
  id: string;
  name: string;
  boards: Board[];
  roomTotal?: number;
}

export interface Quote {
  id?: string;
  customerName: string;
  mobile: string;
  email: string;
  siteAddress: string;
  projectName: string;
  salesExecutive: string;
  quoteNumber: string;
  date: string;
  rooms: Room[];
  wifiEnabled: boolean;
  grandTotal?: number;
  productTotal?: number;
  installation?: number;
  gst?: number;
  savedAt?: string;
}