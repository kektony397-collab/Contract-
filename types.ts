
export interface FareInput {
  distance: number;
  duration: number;
  pickup: number;
  wait: number;
  isNight: boolean;
}

export interface FareRecord extends FareInput {
  id?: number;
  total: number;
  timestamp: number;
}

export type Theme = 'light' | 'dark';

export type ToastType = 'success' | 'error';

export interface ToastState {
  message: string;
  type: ToastType;
  visible: boolean;
}

export interface ProfileData {
  name: string;
  licenseNumber: string;
  rapidoId: string;
  uberId: string;
  olaId: string;
}

export interface ContractData {
  customerName: string;
  pickupLocation: string;
  dropLocation: string;
  dailyDistance: number;
  dailyDuration: number;
  startDate: string;
  endDate: string;
  totalFare: number;
  riderProfile: ProfileData;
  numberOfDays: number;
}

export interface ContractRecord extends ContractData {
  id?: number;
  timestamp: number;
}
