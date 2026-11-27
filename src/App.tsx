import { useState } from 'react';
import type { 
  AdminPage, 
  UserPage, 
  PortalMode, 
  Room, 
  UtilityBill, 
  RepairTicket, 
  RoomStatus, 
  RepairStatus,
  UserParcel,
  ChatConversation,
  ChatMessage
} from './types';
import { 
  initialRooms, 
  initialBills, 
  initialResidents, 
  initialRepairs, 
  initialNotices, 
  initialParcels,
  initialConversations,
  initialMessages
} from './mockData';
import { AdminLogin } from './components/AdminLogin';
import { AdminLayout } from './components/AdminLayout';
import { DashboardView } from './components/views/DashboardView';
import { RoomsView } from './components/views/RoomsView';
import type { ResidentInput } from './components/views/RoomsView';
import { ResidentsView } from './components/views/ResidentsView';
import { BillingView } from './components/views/BillingView';
import type { NewBillInput } from './components/views/BillingView';
import { RepairsView } from './components/views/RepairsView';
import { AdminChatView } from './components/views/AdminChatView';
import { SettingsView } from './components/views/SettingsView';
import { QuickSwitcher } from './components/QuickSwitcher';

// User / Student Portal Components
import { UserLayout } from './components/user/UserLayout';
import { UserHomeView } from './components/user/UserHomeView';
import { UserBillingView } from './components/user/UserBillingView';
import { UserRepairsView } from './components/user/UserRepairsView';
import { UserParcelsView } from './components/user/UserParcelsView';
import { UserChatView } from './components/user/UserChatView';
import { UserNoticesView } from './components/user/UserNoticesView';
import { UserProfileView } from './components/user/UserProfileView';

export function App() {
  // Mode: 'admin' or 'user' (defaults to 'user' as requested by the user)
  const [portalMode, setPortalMode] = useState<PortalMode>('user');

  // Admin state
  const [adminPage, setAdminPage] = useState<AdminPage>('dashboard');
  
  // User state
  const [userPage, setUserPage] = useState<UserPage>('home');
  const [currentResidentId, setCurrentResidentId] = useState<string>('res-101');
  const [residents] = useState(initialResidents);
  const [rooms, setRooms] = useState<Room[]>(initialRooms);
  const [bills, setBills] = useState<UtilityBill[]>(initialBills);
  const [repairs, setRepairs] = useState<RepairTicket[]>(initialRepairs);
  const [notices] = useState(initialNotices);
  const [parcels, setParcels] = useState<UserParcel[]>(initialParcels);
  const [conversations, setConversations] = useState<ChatConversation[]>(initialConversations);
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);

  const [activeVerificationBill, setActiveVerificationBill] = useState<UtilityBill | null>(null);

  // Current active student profile
  const currentResident = residents.find(r => r.id === currentResidentId) || residents[0];
  const currentResidentBill = bills.find(b => b.roomNumber === currentResident.roomNumber);

  // Admin Actions
  const handleUpdateRoomStatus = (roomId: string, newStatus: RoomStatus) => {
    setRooms(prev => prev.map(r => r.id === roomId ? {
      ...r,
      status: newStatus,
      // เมื่อเปลี่ยนห้องเป็น "ว่าง" ให้ล้างข้อมูลผู้พักเดิมออก
      ...(newStatus === 'vacant'
        ? { residentName: undefined, phone: undefined, checkInDate: undefined }
        : {}),
    } : r));
  };

  // เพิ่มผู้พักอาศัยเข้าห้องว่าง → เปลี่ยนสถานะเป็น occupied พร้อมข้อมูลผู้พัก
  const handleAssignResident = (roomId: string, resident: ResidentInput) => {
    setRooms(prev => prev.map(r => r.id === roomId ? {
      ...r,
      status: 'occupied',
      residentName: resident.residentName,
      phone: resident.phone,
      checkInDate: resident.checkInDate,
    } : r));
  };

  // สร้างบิลใหม่ (สถานะเริ่มต้น unpaid มาจากฟอร์มใน BillingView)
  const handleCreateBill = (bill: NewBillInput) => {
    setBills(prev => [{ ...bill, id: `bill-${Date.now()}` }, ...prev]);
  };

  const handleApproveBill = (billId: string) => {
    setBills(prev => prev.map(b => b.id === billId ? { ...b, status: 'paid', paidAt: 'เพิ่งอนุมัติเมื่อสักครู่' } : b));
  };

  const handleRejectBill = (billId: string) => {
    setBills(prev => prev.map(b => b.id === billId ? { ...b, status: 'unpaid' } : b));
  };

  const handleSelectBillForVerification = (bill: UtilityBill) => {
    setActiveVerificationBill(bill);
    setPortalMode('admin');
    setAdminPage('billing');
  };

  const handleUpdateRepairStatus = (ticketId: string, newStatus: RepairStatus) => {
    setRepairs(prev => prev.map(r => r.id === ticketId ? { 
      ...r, 
      status: newStatus,
      completedAt: newStatus === 'completed' ? 'วันนี้' : r.completedAt
    } : r));
  };

  const handleAssignTechnician = (ticketId: string, techName: string) => {
    setRepairs(prev => prev.map(r => r.id === ticketId ? { 
      ...r, 
      technician: techName, 
      status: 'in_progress' 
    } : r));
  };

  // User / Student Actions
  const handleUserSubmitSlip = (billId: string, slipUrl: string) => {
    setBills(prev => prev.map(b => b.id === billId ? { 
      ...b, 
      status: 'pending_verification', 
      slipUrl, 
      paidAt: 'วันนี้เมื่อสักครู่' 
    } : b));
  };

  const handleUserSubmitRepair = (newTicketData: Partial<RepairTicket>) => {
    const newTicket: RepairTicket = {
      id: `rep-${Date.now()}`,
      ticketNo: `NV-2569-${Math.floor(100 + Math.random() * 900)}`,
      roomNumber: newTicketData.roomNumber || currentResident.roomNumber,
      residentName: newTicketData.residentName || currentResident.name,
      category: newTicketData.category || 'เครื่องปรับอากาศ',
      title: newTicketData.title || 'แจ้งซ่อมอุปกรณ์',
      description: newTicketData.description || '',
      priority: newTicketData.priority || 'ปกติ',
      status: 'pending',
      reportedAt: 'วันนี้ 09:41 น.',
    };
    setRepairs([newTicket, ...repairs]);
  };

  const handlePickupParcel = (parcelId: string) => {
    setParcels(prev => prev.map(p => p.id === parcelId ? { 
      ...p, 
      status: 'picked_up', 
      pickedUpAt: 'วันนี้' 
    } : p));
  };

  // Chat Actions
  const handleAdminSendMessage = (roomNumber: string, text: string, imageUrl?: string) => {
    const now = new Date();
    const timeFormatted = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')} น.`;
    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      roomNumber,
      sender: 'admin',
      senderName: 'นิติบุคคล Rmutt Residence',
      text,
      timestamp: now.toISOString(),
      timeFormatted,
      isRead: false,
      imageUrl,
    };
    setMessages(prev => [...prev, newMsg]);
    setConversations(prev => prev.map(c => c.roomNumber === roomNumber ? {
      ...c,
      lastMessage: text || '[รูปภาพ]',
      lastTime: timeFormatted,
      unreadCountForResident: c.unreadCountForResident + 1
    } : c));
  };

  const handleUserSendMessage = (text: string, imageUrl?: string) => {
    const now = new Date();
    const timeFormatted = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')} น.`;
    const roomNumber = currentResident.roomNumber;
    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      roomNumber,
      sender: 'resident',
      senderName: currentResident.name,
      text,
      timestamp: now.toISOString(),
      timeFormatted,
      isRead: false,
      imageUrl,
    };
    setMessages(prev => [...prev, newMsg]);
    setConversations(prev => {
      const exists = prev.some(c => c.roomNumber === roomNumber);
      if (exists) {
        return prev.map(c => c.roomNumber === roomNumber ? {
          ...c,
          lastMessage: text || '[รูปภาพ]',
          lastTime: timeFormatted,
          unreadCountForAdmin: c.unreadCountForAdmin + 1
        } : c);
      } else {
        const newConv: ChatConversation = {
          id: `conv-${roomNumber}`,
          roomNumber,
          residentId: currentResident.id,
          residentName: currentResident.name,
          faculty: currentResident.faculty,
          phone: currentResident.phone,
          lastMessage: text || '[รูปภาพ]',
          lastTime: timeFormatted,
          unreadCountForAdmin: 1,
          unreadCountForResident: 0,
          category: 'ทั่วไป',
          status: 'open'
        };
        return [newConv, ...prev];
      }
    });

    // Simulated realistic staff auto-acknowledgment response
    setTimeout(() => {
      const replyNow = new Date();
      const replyTime = `${replyNow.getHours().toString().padStart(2, '0')}:${replyNow.getMinutes().toString().padStart(2, '0')} น.`;
      const autoReplyMsg: ChatMessage = {
        id: `msg-auto-${Date.now()}`,
        roomNumber,
        sender: 'admin',
        senderName: 'นิติบุคคล Rmutt Residence',
        text: `เจ้าหน้าที่ธุรการได้รับเรื่องของห้อง ${roomNumber} เรียบร้อยแล้วครับ กำลังประสานงานตรวจสอบให้นะครับ`,
        timestamp: replyNow.toISOString(),
        timeFormatted: replyTime,
        isRead: false,
      };
      setMessages(prev => [...prev, autoReplyMsg]);
      setConversations(prev => prev.map(c => c.roomNumber === roomNumber ? {
        ...c,
        lastMessage: autoReplyMsg.text,
        lastTime: replyTime,
        unreadCountForResident: c.unreadCountForResident + 1
      } : c));
    }, 2000);
  };

  const handleUpdateConversationStatus = (convId: string, status: 'open' | 'resolved') => {
    setConversations(prev => prev.map(c => c.id === convId ? { ...c, status } : c));
  };

  return (
    <>
      {portalMode === 'admin' ? (
        /* ======================== ADMIN PORTAL ======================== */
        adminPage === 'login' ? (
          <AdminLogin onLoginSuccess={() => setAdminPage('dashboard')} />
        ) : (
          <AdminLayout
            currentPage={adminPage}
            onNavigate={(page) => setAdminPage(page)}
            onLogout={() => setAdminPage('login')}
          >
            {adminPage === 'dashboard' && (
              <DashboardView
                rooms={rooms}
                bills={bills}
                repairs={repairs}
                onNavigate={(page) => setAdminPage(page)}
                onSelectBillForVerification={handleSelectBillForVerification}
              />
            )}

            {adminPage === 'rooms' && (
              <RoomsView
                rooms={rooms}
                onUpdateRoomStatus={handleUpdateRoomStatus}
                onAssignResident={handleAssignResident}
              />
            )}

            {adminPage === 'residents' && (
              <ResidentsView
                residents={residents}
              />
            )}

            {adminPage === 'billing' && (
              <BillingView
                bills={bills}
                onApproveBill={handleApproveBill}
                onRejectBill={handleRejectBill}
                onCreateBill={handleCreateBill}
                activeVerificationBill={activeVerificationBill}
                onCloseVerificationModal={() => setActiveVerificationBill(null)}
              />
            )}

            {adminPage === 'repairs' && (
              <RepairsView
                repairs={repairs}
                onUpdateRepairStatus={handleUpdateRepairStatus}
                onAssignTechnician={handleAssignTechnician}
              />
            )}

            {adminPage === 'chat' && (
              <AdminChatView
                conversations={conversations}
                messages={messages}
                onSendMessage={handleAdminSendMessage}
                onUpdateConversationStatus={handleUpdateConversationStatus}
                residents={residents}
                bills={bills}
                repairs={repairs}
                onNavigateToRoom={() => setAdminPage('rooms')}
                onNavigateToBill={() => setAdminPage('billing')}
                onNavigateToRepair={() => setAdminPage('repairs')}
              />
            )}

            {adminPage === 'settings' && (
              <SettingsView />
            )}
          </AdminLayout>
        )
      ) : (
        /* ======================== USER / STUDENT PORTAL ======================== */
        <UserLayout
          currentPage={userPage}
          onNavigate={(page) => setUserPage(page)}
          currentResident={currentResident}
          onSwitchResident={(id) => setCurrentResidentId(id)}
          allResidents={residents}
          currentBill={currentResidentBill}
          parcels={parcels}
          onSwitchToAdmin={() => {
            setPortalMode('admin');
            setAdminPage('dashboard');
          }}
        >
          {userPage === 'home' && (
            <UserHomeView
              resident={currentResident}
              bill={currentResidentBill}
              repairs={repairs}
              parcels={parcels}
              notices={notices}
              onNavigate={(page) => setUserPage(page)}
              onOpenDigitalPass={() => {
                const qrBtn = document.querySelector('.topbar-qr-pass-btn') as HTMLElement;
                if (qrBtn) qrBtn.click();
              }}
            />
          )}

          {userPage === 'billing' && (
            <UserBillingView
              resident={currentResident}
              bill={currentResidentBill}
              onSubmitSlip={handleUserSubmitSlip}
            />
          )}

          {userPage === 'repairs' && (
            <UserRepairsView
              resident={currentResident}
              repairs={repairs}
              onSubmitTicket={handleUserSubmitRepair}
            />
          )}

          {userPage === 'parcels' && (
            <UserParcelsView
              resident={currentResident}
              parcels={parcels}
              onPickupParcel={handlePickupParcel}
            />
          )}

          {userPage === 'chat' && (
            <UserChatView
              resident={currentResident}
              messages={messages}
              onSendMessage={handleUserSendMessage}
            />
          )}

          {userPage === 'notices' && (
            <UserNoticesView
              notices={notices}
            />
          )}

          {userPage === 'profile' && (
            <UserProfileView
              resident={currentResident}
              onSwitchToAdmin={() => {
                setPortalMode('admin');
                setAdminPage('dashboard');
              }}
            />
          )}
        </UserLayout>
      )}

      {/* FLOATING QUICK SWITCHER (BETWEEN ADMIN AND USER MODES) */}
      <QuickSwitcher
        portalMode={portalMode}
        onSelectPortalMode={(mode) => setPortalMode(mode)}
        adminPage={adminPage}
        onSelectAdminPage={(page) => {
          setPortalMode('admin');
          setAdminPage(page);
        }}
        userPage={userPage}
        onSelectUserPage={(page) => {
          setPortalMode('user');
          setUserPage(page);
        }}
      />
    </>
  );
}

export default App;