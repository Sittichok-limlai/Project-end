import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, 
  Send, 
  Paperclip, 
  Phone, 
  ExternalLink, 
  CheckCheck, 
  Check, 
  Wrench, 
  Receipt, 
  Key, 
  MessageCircle, 
  AlertCircle,
  Image as ImageIcon,
  X,
  Filter,
  CheckCircle2,
  RefreshCw,
  Sparkles
} from 'lucide-react';
import type { ChatConversation, ChatMessage, Resident, UtilityBill, RepairTicket } from '../../types';

interface AdminChatViewProps {
  conversations: ChatConversation[];
  messages: ChatMessage[];
  onSendMessage: (roomNumber: string, text: string, imageUrl?: string) => void;
  onUpdateConversationStatus: (convId: string, status: 'open' | 'resolved') => void;
  residents: Resident[];
  bills: UtilityBill[];
  repairs: RepairTicket[];
  onNavigateToRoom?: (roomNumber: string) => void;
  onNavigateToBill?: (billId: string) => void;
  onNavigateToRepair?: (ticketId: string) => void;
}

export const AdminChatView: React.FC<AdminChatViewProps> = ({
  conversations,
  messages,
  onSendMessage,
  onUpdateConversationStatus,
  residents,
  bills,
  repairs,
  onNavigateToRoom,
  onNavigateToBill,
  onNavigateToRepair
}) => {
  const [selectedRoom, setSelectedRoom] = useState<string>(
    conversations.length > 0 ? conversations[0].roomNumber : '101'
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'unread' | 'repair' | 'parcel' | 'billing'>('all');
  const [inputText, setInputText] = useState('');
  const [attachedImage, setAttachedImage] = useState<string | null>(null);
  const [showRightDrawer, setShowRightDrawer] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of message list on new messages or room switch
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, selectedRoom]);

  // Current active conversation & resident
  const currentConv = conversations.find(c => c.roomNumber === selectedRoom) || conversations[0];
  const currentResident = residents.find(r => r.roomNumber === selectedRoom);
  const currentBill = bills.find(b => b.roomNumber === selectedRoom);
  const currentRepairs = repairs.filter(r => r.roomNumber === selectedRoom);

  // Messages for the active room
  const roomMessages = messages.filter(m => m.roomNumber === selectedRoom);

  // Filter conversations
  const filteredConversations = conversations.filter(c => {
    const matchesSearch = 
      c.roomNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.residentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.lastMessage.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (activeTab === 'unread') return c.unreadCountForAdmin > 0;
    if (activeTab === 'repair') return c.category === 'แจ้งซ่อม';
    if (activeTab === 'parcel') return c.category === 'พัสดุ';
    if (activeTab === 'billing') return c.category === 'การเงิน';
    return true;
  });

  const handleSend = () => {
    if (!inputText.trim() && !attachedImage) return;
    onSendMessage(selectedRoom, inputText.trim(), attachedImage || undefined);
    setInputText('');
    setAttachedImage(null);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const quickReplies = [
    'รับทราบครับ กำลังประสานงานช่างเข้าตรวจสอบช่วงบ่ายนี้ครับ',
    'พัสดุมาถึงห้องธุรการแล้วครับ สามารถนำ QR มารับได้ถึง 20:30 น. ครับ',
    'ยอดชำระได้รับการตรวจสอบและอนุมัติในระบบเรียบร้อยแล้วครับ',
    'ติดต่อรับกุญแจสำรองได้ที่เคาน์เตอร์ธุรการชั้น 1 ได้เลยครับ',
    'เจ้าหน้าที่ตรวจสอบแล้ว อยู่ระหว่างดำเนินการแก้ไขให้นะครับ'
  ];

  const handleQuickReply = (reply: string) => {
    onSendMessage(selectedRoom, reply);
  };

  const handleMockAttachPhoto = () => {
    // Sample mock attachment
    const samplePhotos = [
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=600&q=80'
    ];
    setAttachedImage(samplePhotos[Math.floor(Math.random() * samplePhotos.length)]);
  };

  const totalUnreadAdmin = conversations.reduce((acc, c) => acc + c.unreadCountForAdmin, 0);

  return (
    <div className="admin-chat-page-container">
      {/* 3-COLUMN LAYOUT: Conversation List | Active Chat | Resident Context Drawer */}
      <div className="admin-chat-grid-wrapper">
        
        {/* ================= COLUMN 1: CONVERSATIONS LIST ================= */}
        <aside className="chat-conversations-sidebar">
          {/* Header */}
          <div className="conv-sidebar-header">
            <div className="conv-title-row">
              <div className="conv-title-group">
                <h2 className="conv-main-title">แชทติดต่อผู้พัก</h2>
                <span className="conv-count-badge">{conversations.length} ห้อง</span>
              </div>
              {totalUnreadAdmin > 0 && (
                <span className="unread-total-badge">
                  {totalUnreadAdmin} ข้อความใหม่
                </span>
              )}
            </div>

            {/* Search Input */}
            <div className="conv-search-box">
              <Search size={16} className="conv-search-icon" />
              <input
                type="text"
                placeholder="ค้นหาห้องพัก, ชื่อ, หรือข้อความ..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="conv-search-input"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="search-clear-btn">
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Filter Tabs */}
            <div className="conv-filter-tabs">
              <button
                className={`conv-tab-btn ${activeTab === 'all' ? 'active' : ''}`}
                onClick={() => setActiveTab('all')}
              >
                ทั้งหมด
              </button>
              <button
                className={`conv-tab-btn ${activeTab === 'unread' ? 'active' : ''}`}
                onClick={() => setActiveTab('unread')}
              >
                ยังไม่อ่าน {totalUnreadAdmin > 0 && `(${totalUnreadAdmin})`}
              </button>
              <button
                className={`conv-tab-btn ${activeTab === 'repair' ? 'active' : ''}`}
                onClick={() => setActiveTab('repair')}
              >
                แจ้งซ่อม
              </button>
              <button
                className={`conv-tab-btn ${activeTab === 'parcel' ? 'active' : ''}`}
                onClick={() => setActiveTab('parcel')}
              >
                พัสดุ
              </button>
              <button
                className={`conv-tab-btn ${activeTab === 'billing' ? 'active' : ''}`}
                onClick={() => setActiveTab('billing')}
              >
                การเงิน
              </button>
            </div>
          </div>

          {/* Conversations Scroll Area */}
          <div className="conv-list-container">
            {filteredConversations.length === 0 ? (
              <div className="conv-empty-state">
                <AlertCircle size={32} className="text-slate-400 mb-2" />
                <p className="text-sm font-medium text-slate-600">ไม่พบรายการแชทที่ค้นหา</p>
                <p className="text-xs text-slate-400 mt-1">ลองเปลี่ยนคำค้นหาหรือตัวกรอง</p>
              </div>
            ) : (
              filteredConversations.map((conv) => {
                const isSelected = conv.roomNumber === selectedRoom;
                return (
                  <div
                    key={conv.id}
                    onClick={() => setSelectedRoom(conv.roomNumber)}
                    className={`conv-item-card ${isSelected ? 'selected' : ''} ${conv.unreadCountForAdmin > 0 ? 'has-unread' : ''}`}
                  >
                    <div className="conv-item-top">
                      <div className="conv-room-tag">
                        <span className="room-prefix">ห้อง</span>
                        <span className="room-number">{conv.roomNumber}</span>
                      </div>
                      <span className="conv-time-text">{conv.lastTime}</span>
                    </div>

                    <div className="conv-item-body">
                      <div className="conv-resident-name-row">
                        <span className="conv-resident-name">{conv.residentName}</span>
                        {conv.category && (
                          <span className={`conv-category-pill cat-${conv.category}`}>
                            {conv.category}
                          </span>
                        )}
                      </div>
                      <p className="conv-last-msg-preview">
                        {conv.lastMessage}
                      </p>
                    </div>

                    <div className="conv-item-footer">
                      <span className="conv-faculty-sub">{conv.faculty}</span>
                      {conv.unreadCountForAdmin > 0 && (
                        <span className="conv-unread-pill">
                          {conv.unreadCountForAdmin}
                        </span>
                      )}
                      {conv.status === 'resolved' && (
                        <span className="conv-resolved-pill">
                          <CheckCheck size={12} className="inline mr-1" />
                          เสร็จสิ้น
                        </span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </aside>

        {/* ================= COLUMN 2: ACTIVE CHAT ROOM ================= */}
        <main className="chat-main-conversation-area">
          {/* Chat Header */}
          <header className="chat-room-header">
            <div className="chat-header-left">
              <div className="room-badge-avatar">
                <span className="room-badge-num">{currentConv.roomNumber}</span>
              </div>
              <div className="chat-header-meta">
                <div className="chat-header-title-line">
                  <h3 className="chat-resident-heading">{currentConv.residentName}</h3>
                  <span className="chat-online-indicator">
                    <span className="online-green-dot"></span>
                    ออนไลน์
                  </span>
                </div>
                <div className="chat-header-sub-details">
                  <span>ห้องพัก {currentConv.roomNumber} • อาคาร A</span>
                  <span className="dot-sep">•</span>
                  <span>{currentConv.faculty}</span>
                  <span className="dot-sep">•</span>
                  <a href={`tel:${currentConv.phone}`} className="phone-link">
                    <Phone size={12} className="inline mr-1" />
                    {currentConv.phone}
                  </a>
                </div>
              </div>
            </div>

            <div className="chat-header-right">
              {currentConv.status === 'open' ? (
                <button
                  onClick={() => onUpdateConversationStatus(currentConv.id, 'resolved')}
                  className="chat-status-action-btn resolve"
                  title="คลิกเพื่อจบการสนทนานี้"
                >
                  <CheckCircle2 size={15} />
                  <span>จบการสนทนา</span>
                </button>
              ) : (
                <button
                  onClick={() => onUpdateConversationStatus(currentConv.id, 'open')}
                  className="chat-status-action-btn reopen"
                  title="คลิกเพื่อเปิดเรื่องต่อ"
                >
                  <RefreshCw size={15} />
                  <span>เปิดเรื่องต่อ</span>
                </button>
              )}

              <button
                onClick={() => setShowRightDrawer(!showRightDrawer)}
                className={`drawer-toggle-btn ${showRightDrawer ? 'active' : ''}`}
                title="เปิด/ปิด ข้อมูลสรุปผู้พักอาศัย"
              >
                <Filter size={16} />
                <span>ข้อมูลห้องพัก</span>
              </button>
            </div>
          </header>

          {/* Quick Notice Banner */}
          <div className="chat-context-alert-strip">
            <div className="strip-left">
              <MessageCircle size={15} className="text-blue-600 flex-shrink-0" />
              <span className="strip-text">
                กำลังสนทนากับ <strong>{currentConv.residentName}</strong> (ห้อง {currentConv.roomNumber}) ข้อความที่ส่งจะแสดงบนหน้าพอร์ทัลของนักศึกษาแบบเรียลไทม์
              </span>
            </div>
            {currentBill && currentBill.status !== 'paid' && (
              <span className="strip-bill-warn">
                ⚠️ ค้างชำระบิล ฿{currentBill.grandTotal.toLocaleString()}
              </span>
            )}
          </div>

          {/* Messages Scroll Area */}
          <div className="chat-messages-scroll-area">
            <div className="chat-date-separator">
              <span>วันนี้ • 27 กุมภาพันธ์ 2569</span>
            </div>

            {roomMessages.map((msg) => {
              const isAdmin = msg.sender === 'admin';
              return (
                <div key={msg.id} className={`chat-message-row ${isAdmin ? 'admin-side' : 'resident-side'}`}>
                  {!isAdmin && (
                    <div className="msg-avatar-col">
                      <div className="resident-bubble-avatar">
                        {currentConv.roomNumber}
                      </div>
                    </div>
                  )}

                  <div className="msg-bubble-wrapper">
                    <div className="msg-meta-top">
                      <span className="msg-sender-name">
                        {isAdmin ? 'นิติบุคคล Rmutt Residence (เจ้าหน้าที่)' : msg.senderName}
                      </span>
                      <span className="msg-time-stamp">{msg.timeFormatted}</span>
                    </div>

                    <div className={`msg-content-box ${isAdmin ? 'admin-box' : 'resident-box'}`}>
                      <p className="msg-text-body">{msg.text}</p>
                      {msg.imageUrl && (
                        <div className="msg-attachment-box">
                          <img 
                            src={msg.imageUrl} 
                            alt="รูปภาพแนบ" 
                            className="msg-attached-img"
                            onClick={() => window.open(msg.imageUrl, '_blank')} 
                          />
                        </div>
                      )}
                    </div>

                    <div className="msg-status-line">
                      {isAdmin && (
                        <span className="msg-read-status">
                          {msg.isRead ? (
                            <>
                              <CheckCheck size={14} className="text-blue-500 inline mr-0.5" />
                              <span className="text-slate-400">นักศึกษาอ่านแล้ว</span>
                            </>
                          ) : (
                            <>
                              <Check size={14} className="text-slate-400 inline mr-0.5" />
                              <span className="text-slate-400">ส่งแล้ว</span>
                            </>
                          )}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Replies Bar */}
          <div className="chat-quick-replies-bar">
            <div className="quick-reply-label">
              <Sparkles size={13} className="text-amber-500 inline mr-1" />
              <span>ตอบกลับด่วน:</span>
            </div>
            <div className="quick-reply-scroll">
              {quickReplies.map((reply, idx) => (
                <button
                  key={idx}
                  onClick={() => handleQuickReply(reply)}
                  className="quick-reply-pill"
                >
                  {reply}
                </button>
              ))}
            </div>
          </div>

          {/* Attached Image Preview */}
          {attachedImage && (
            <div className="attached-preview-strip">
              <div className="preview-thumb-box">
                <img src={attachedImage} alt="แนบรูปภาพ" />
                <button 
                  onClick={() => setAttachedImage(null)} 
                  className="remove-attach-btn"
                  title="ลบรูปภาพนี้"
                >
                  <X size={12} />
                </button>
              </div>
              <span className="preview-label">แนบรูปภาพสำเร็จ (คลิกปุ่มส่งเพื่อโพสต์)</span>
            </div>
          )}

          {/* Chat Input Bar */}
          <div className="chat-input-bar">
            <button
              onClick={handleMockAttachPhoto}
              className="chat-action-tool-btn"
              title="แนบรูปภาพตัวอย่าง"
            >
              <ImageIcon size={19} />
            </button>

            <button
              onClick={handleMockAttachPhoto}
              className="chat-action-tool-btn"
              title="แนบเอกสาร / ไฟล์"
            >
              <Paperclip size={19} />
            </button>

            <input
              type="text"
              placeholder={`พิมพ์ข้อความตอบกลับไปยังห้อง ${currentConv.roomNumber} (กด Enter เพื่อส่ง)...`}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyPress}
              className="chat-text-input"
            />

            <button
              onClick={handleSend}
              disabled={!inputText.trim() && !attachedImage}
              className="chat-send-btn"
            >
              <span>ส่งข้อความ</span>
              <Send size={15} />
            </button>
          </div>
        </main>

        {/* ================= COLUMN 3: RESIDENT QUICK CONTEXT DRAWER ================= */}
        {showRightDrawer && (
          <aside className="chat-resident-context-drawer">
            <div className="drawer-header">
              <h4 className="drawer-title">ข้อมูลห้อง {currentConv.roomNumber}</h4>
              <button onClick={() => setShowRightDrawer(false)} className="drawer-close-btn">
                <X size={16} />
              </button>
            </div>

            <div className="drawer-content-scroll">
              {/* Resident Profile Card */}
              <div className="drawer-section-card">
                <div className="drawer-avatar-center">
                  <div className="drawer-big-avatar">
                    {currentConv.roomNumber}
                  </div>
                  <h5 className="drawer-name">{currentConv.residentName}</h5>
                  <span className="drawer-sub">{currentConv.faculty}</span>
                  {currentResident && (
                    <span className="drawer-student-id font-mono">
                      รหัสนักศึกษา: {currentResident.studentId}
                    </span>
                  )}
                </div>

                <div className="drawer-info-grid">
                  <div className="drawer-info-row">
                    <span className="info-lbl">เบอร์โทรศัพท์:</span>
                    <a href={`tel:${currentConv.phone}`} className="info-val font-semibold text-blue-600">
                      {currentConv.phone}
                    </a>
                  </div>
                  {currentResident && (
                    <>
                      <div className="drawer-info-row">
                        <span className="info-lbl">อีเมล:</span>
                        <span className="info-val">{currentResident.email}</span>
                      </div>
                      <div className="drawer-info-row">
                        <span className="info-lbl">ผู้ติดต่อฉุกเฉิน:</span>
                        <span className="info-val">{currentResident.emergencyContact}</span>
                      </div>
                      <div className="drawer-info-row">
                        <span className="info-lbl">สัญญาเช่า:</span>
                        <span className="info-val">สิ้นสุด {currentResident.contractEndDate}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Quick Actions to Other Admin Modules */}
              <div className="drawer-section-card">
                <h6 className="section-small-title">การเชื่อมโยงกับระบบหอพัก</h6>
                <div className="drawer-action-links">
                  {onNavigateToRoom && (
                    <button
                      onClick={() => onNavigateToRoom(currentConv.roomNumber)}
                      className="drawer-action-item"
                    >
                      <Key size={15} className="text-blue-600 mr-2" />
                      <span>เปิดดูผังห้องพัก {currentConv.roomNumber}</span>
                      <ExternalLink size={13} className="ml-auto text-slate-400" />
                    </button>
                  )}

                  {currentBill && onNavigateToBill && (
                    <button
                      onClick={() => onNavigateToBill(currentBill.id)}
                      className="drawer-action-item"
                    >
                      <Receipt size={15} className="text-amber-600 mr-2" />
                      <span>ดูบิลค่าเช่า & น้ำไฟ (฿{currentBill.grandTotal.toLocaleString()})</span>
                      <ExternalLink size={13} className="ml-auto text-slate-400" />
                    </button>
                  )}

                  {currentRepairs.length > 0 && onNavigateToRepair && (
                    <button
                      onClick={() => onNavigateToRepair(currentRepairs[0].id)}
                      className="drawer-action-item"
                    >
                      <Wrench size={15} className="text-rose-600 mr-2" />
                      <span>ดูรายการแจ้งซ่อม ({currentRepairs.length} รายการ)</span>
                      <ExternalLink size={13} className="ml-auto text-slate-400" />
                    </button>
                  )}
                </div>
              </div>

              {/* Status Snapshot */}
              <div className="drawer-section-card">
                <h6 className="section-small-title">สถานะปัจจุบันของห้อง {currentConv.roomNumber}</h6>
                <div className="snapshot-box">
                  <div className="snap-item">
                    <span className="snap-lbl">บิลเดือนนี้:</span>
                    {currentBill ? (
                      <span className={`snap-pill ${currentBill.status}`}>
                        {currentBill.status === 'paid' ? 'ชำระแล้ว' : 'รอชำระ'}
                      </span>
                    ) : (
                      <span className="snap-pill">-</span>
                    )}
                  </div>

                  <div className="snap-item">
                    <span className="snap-lbl">งานซ่อมคงค้าง:</span>
                    <span className="snap-val font-semibold">
                      {currentRepairs.filter(r => r.status !== 'completed').length} รายการ
                    </span>
                  </div>

                  <div className="snap-item">
                    <span className="snap-lbl">สถานะสัญญา:</span>
                    <span className="snap-val text-blue-600 font-semibold">
                      ปกติ (กำลังพักอาศัย)
                    </span>
                  </div>
                </div>
              </div>

            </div>
          </aside>
        )}

      </div>
    </div>
  );
};
