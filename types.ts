
export enum UserRole {
  SUPER_ADMIN = 'Super Admin',
  COMPANY_OWNER = 'Company Owner',
  COMPANY_REPRESENTATIVE = 'Company Representative',
  DISPATCHER = 'Dispatcher',
  VIEWER = 'Viewer'
}

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  BLOCKED = 'BLOCKED'
}

export enum ClientTier {
  SILVER = 'Silver',
  GOLD = 'Gold',
  DIAMOND = 'Diamond'
}

export enum ShipmentStatus {
  BOOKED = 'Booked',
  ASSIGNED = 'Assigned',
  DISPATCHED = 'Dispatched',
  IN_TRANSIT = 'In Transit',
  PARTIALLY_DELIVERED = 'Partially Delivered',
  DELIVERED = 'Delivered',
  INVOICED = 'Invoiced',
  DECLINED = 'Declined'
}

export enum StopStatus {
  PENDING = 'Pending',
  OUT_FOR_DELIVERY = 'Out for Delivery',
  DELIVERED = 'Delivered'
}

export enum VehicleStatus {
  AVAILABLE = 'Available',
  IN_TRANSIT = 'In Transit',
  MAINTENANCE = 'Maintenance',
  OFF_DUTY = 'Off Duty'
}

export interface DeliveryStop {
  id: string;
  sequence: number;
  address: string;
  landmark?: string;
  contactName: string;
  contactPhone: string;
  payloadDescription: string;
  weight: number; // in Tons
  instructions?: string;
  callBeforeDelivery: boolean;
  status: StopStatus;
  podUrl?: string;
  timestamp?: string;
}

export interface AppUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  blockedReason?: string;
  blockedAt?: string;
}

export interface Client {
  id: string;
  companyName: string;
  contactPerson: string;
  phone: string;
  email: string;
  gstin?: string;
  address: string;
  tier: ClientTier;
  status: 'Active' | 'Inactive' | 'Pending';
  joinedDate: string;
  notes?: string;
}

export interface Vehicle {
  id: string;
  registrationNumber: string;
  type: string;
  capacity: string; // e.g. "7 Tons"
  status: VehicleStatus;
  lastMaintenance: string;
  features: string[];
  notes?: string;
}

export interface ShipmentEvent {
  status: ShipmentStatus;
  timestamp: string;
  location: string;
  note?: string;
}

export interface Shipment {
  id: string;
  origin: string;
  destination?: string;
  pickupLandmark?: string;
  pickupDate: string;
  pickupTimeWindow?: string;
  client: string;
  status: ShipmentStatus;
  date: string;
  vehicle: string;
  vehicleId?: string;
  driverId?: number;
  goodsType: string;
  weight?: string | number;
  totalWeight: number;
  stops: DeliveryStop[];
  isMultiStop: boolean;
  instructions?: string;
  timeline: ShipmentEvent[];
  isNonFragile: boolean;
  isNonPerishable: boolean;
}

export interface KpiData {
  label: string;
  value: string;
  change: string;
  positive: boolean;
}

export type ViewState = 'HOME' | 'SERVICES' | 'FLEET' | 'TRACK' | 'LOGIN' | 'DASHBOARD' | 'REGISTER';

export interface NavItem {
  label: string;
  view: ViewState;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: Date;
}

export interface PaymentRecord {
  id: string;
  date: string;
  month: string;
  amount: number;
  type: 'Salary' | 'Advance' | 'Bonus';
  status: 'Paid' | 'Pending';
  note?: string;
}

export interface FinancialData {
  baseSalary: number | string;
  bonus: number | string;
  deductions: number | string;
  status: 'Pending' | 'Paid';
}

export interface Invoice {
  id: string;
  client: string;
  amount: string;
  status: 'Paid' | 'Pending' | 'Processing';
  date: string;
}

export interface AttendanceData {
  [key: number]: string;
}

export interface Driver {
  id: number;
  name: string;
  role: string;
  license: string;
  licenseExpiry: string;
  joinDate?: string;
  phone: string;
  status: string;
  vehicle: string;
  financials: FinancialData;
  paymentHistory: PaymentRecord[];
  attendance?: AttendanceData;
}
