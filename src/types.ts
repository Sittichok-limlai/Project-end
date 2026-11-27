export type PortalMode = 'admin' | 'user';

export type AdminPage = 
  | 'login' 
  | 'dashboard' 
  | 'rooms' 
  | 'residents' 
  | 'billing' 
  | 'repairs' 
  | 'chat'
  | 'settings';

export type UserPage = 
  | 'home' 
  | 'billing' 
  | 'repairs' 
  | 'parcels' 
  | 'notices' 
  | 'profile'
  | 'chat';

export type RoomStatus = 'occupied' | 'vacant' | 'maintenance' | 'cleaning';
export type RoomType = 'เตียงเดี่ยว (Standard)' | 'เตียงคู่ (Deluxe)' | 'ห้องสตูดิโอ (VIP)';

export interface Room {
  id: string;
  roomNumber: string;
  floor: number;
  building: string;
  type: RoomType;
  price: number;
  status: RoomStatus;
  residentName?: string;
  residentId?: string;
  phone?: string;
  checkInDate?: string;
  airConditioner: boolean;
}

export interface Resident {
  id: string;
  studentId: string;
  name: string;
  gender: 'ชาย' | 'หญิง';
  faculty: string;
  roomNumber: string;
  phone: string;
  email: string;
  checkInDate: string;
  contractEndDate: string;
  emergencyContact: string;
}

export type PaymentStatus = 'paid' | 'pending_verification' | 'unpaid' | 'overdue';

export interface UtilityBill {
  id: string;
  month: string;
  roomNumber: string;
  residentName: string;
  rentAmount: number;
  waterPrev: number;
  waterCurr: number;
  waterUnitRate: number;
  waterTotal: number;
  elecPrev: number;
  elecCurr: number;
  elecUnitRate: number;
  elecTotal: number;
  commonFee: number;
  grandTotal: number;
  status: PaymentStatus;
  slipUrl?: string;
  paidAt?: string;
}

export type RepairStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled';
export type RepairPriority = 'ด่วนมาก' | 'ปกติ' | 'รอได้';

export interface RepairTicket {
  id: string;
  ticketNo: string;
  roomNumber: string;
  residentName: string;
  category: 'ระบบประปา/ห้องน้ำ' | 'ระบบไฟฟ้า/ไฟส่องสว่าง' | 'เครื่องปรับอากาศ' | 'เฟอร์นิเจอร์/ประตูหน้าต่าง' | 'อินเทอร์เน็ต';
  title: string;
  description: string;
  priority: RepairPriority;
  status: RepairStatus;
  reportedAt: string;
  technician?: string;
  completedAt?: string;
}

export interface DormNotice {
  id: string;
  title: string;
  type: 'พัสดุมาถึง' | 'แจ้งเตือนบิล' | 'ประกาศซ่อมบำรุง' | 'ทั่วไป';
  target: 'ทั้งหมด' | 'เฉพาะห้อง' | 'ชั้น 1-4';
  sentAt: string;
  readCount: number;
  totalRecipients: number;
}

export type LineNotice = DormNotice;

export interface UserParcel {
  id: string;
  roomNumber: string;
  carrier: string;
  trackingNumber: string;
  arrivedAt: string;
  status: 'ready_for_pickup' | 'picked_up';
  pickedUpAt?: string;
}

export interface ChatMessage {
  id: string;
  roomNumber: string;
  sender: 'admin' | 'resident';
  senderName: string;
  text: string;
  timestamp: string;
  timeFormatted: string;
  isRead: boolean;
  imageUrl?: string;
  category?: 'repair' | 'parcel' | 'billing' | 'general' | 'key';
}

export interface ChatConversation {
  id: string;
  roomNumber: string;
  residentId: string;
  residentName: string;
  faculty: string;
  phone: string;
  lastMessage: string;
  lastTime: string;
  unreadCountForAdmin: number;
  unreadCountForResident: number;
  category: 'แจ้งซ่อม' | 'พัสดุ' | 'การเงิน' | 'กุญแจ/การเข้าห้อง' | 'ทั่วไป';
  status: 'open' | 'resolved';
}
