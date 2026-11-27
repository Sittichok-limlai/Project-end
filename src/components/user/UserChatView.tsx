import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  PhoneCall, 
  Clock, 
  ShieldCheck, 
  CheckCheck, 
  Check, 
  Wrench, 
  Package, 
  Receipt, 
  Key, 
  Image as ImageIcon,
  X,
  Sparkles,
  Info
} from 'lucide-react';
import type { ChatMessage, Resident } from '../../types';

interface UserChatViewProps {
  resident: Resident;
  messages: ChatMessage[];
  onSendMessage: (text: string, imageUrl?: string) => void;
}

export const UserChatView: React.FC<UserChatViewProps> = ({
  resident,
  messages,
  onSendMessage
}) => {
  const [inputText, setInputText] = useState('');
  const [attachedImage, setAttachedImage] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Filter messages for current resident's room
  const roomMessages = messages.filter(m => m.roomNumber === resident.roomNumber);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [roomMessages, isTyping]);

  const handleSend = () => {
    if (!inputText.trim() && !attachedImage) return;
    const textToSend = inputText.trim();
    const imageToSend = attachedImage || undefined;

    onSendMessage(textToSend, imageToSend);
    setInputText('');
    setAttachedImage(null);

    // Simulate realistic staff typing after resident sends message
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
    }, 1800);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const quickTopicPrompts = [
    {
      icon: Wrench,
      title: 'แจ้งอุปกรณ์ชำรุด',
      prompt: 'สวัสดีครับพี่เจ้าหน้าที่ อุปกรณ์ในห้อง 101 มีปัญหาต้องการแจ้งช่างเข้ามาซ่อมครับ'
    },
    {
      icon: Package,
      title: 'สอบถามเรื่องพัสดุ',
      prompt: 'สวัสดีค่ะ ต้องการสอบถามเรื่องพัสดุที่มาส่งวันนี้ ไม่ทราบว่าไปรับที่ห้องธุรการได้ถึงกี่โมงคะ'
    },
    {
      icon: Receipt,
      title: 'สอบถามบิล / แจ้งโอน',
      prompt: 'สวัสดีครับ สอบถามเรื่องยอดชำระค่าน้ำค่าไฟเดือนนี้ครับ พอดีแนบสลิปไปแล้วอยากให้ช่วยตรวจสอบยอดครับ'
    },
    {
      icon: Key,
      title: 'ลืมกุญแจห้อง',
      prompt: 'พี่คะ ลืมกุญแจไว้ในห้องพักค่ะ รบกวนขอกุญแจสำรองเปิดห้องหน่อยได้ไหมคะ'
    }
  ];

  const handleQuickPromptClick = (promptText: string) => {
    setInputText(promptText);
  };

  const handleMockAttachPhoto = () => {
    const samplePhotos = [
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=600&q=80'
    ];
    setAttachedImage(samplePhotos[Math.floor(Math.random() * samplePhotos.length)]);
  };

  return (
    <div className="user-chat-page-container">
      {/* Chat Card Box */}
      <div className="user-chat-card-shell">
        
        {/* Chat Header */}
        <header className="user-chat-header">
          <div className="header-brand-info">
            <div className="admin-avatar-shield">
              <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6">
                <path d="M20 4L34 10V21C34 29 27.8 35.8 20 38C12.2 35.8 6 29 6 21V10L20 4Z" fill="#163B66" stroke="#38BDF8" strokeWidth="1.5" />
                <circle cx="20" cy="17" r="4.5" fill="#F59E0B" />
                <path d="M13 25C15.5 24 18 24.5 20 26C22 24.5 24.5 24 27 25V28.5C24.5 27.5 22 28 20 29.5C18 28 15.5 27.5 13 28.5V25Z" fill="#0EA5E9" />
              </svg>
            </div>
            <div>
              <div className="header-title-row">
                <h2 className="user-chat-admin-title">ฝ่ายธุรการและนิติบุคคล NIVA RESIDENCE</h2>
                <span className="user-chat-online-badge">
                  <span className="online-green-pulse"></span>
                  เจ้าหน้าที่ออนไลน์
                </span>
              </div>
              <p className="user-chat-admin-sub">
                ห้องธุรการ ชั้น 1 อาคาร A • ให้บริการ จันทร์ - อาทิตย์ เวลา 08:30 - 20:30 น.
              </p>
            </div>
          </div>

          <div className="header-hotline-actions">
            <a href="tel:021234567" className="hotline-btn">
              <PhoneCall size={14} className="mr-1.5" />
              <span>โทรธุรการ 02-123-4567</span>
            </a>
          </div>
        </header>

        {/* Sender Context Bar */}
        <div className="user-chat-sender-bar">
          <div className="sender-bar-left">
            <span className="text-slate-500 text-xs">คุณกำลังแชทในนาม:</span>
            <span className="resident-active-tag">
              ห้อง {resident.roomNumber} — {resident.name} ({resident.faculty})
            </span>
          </div>

          <div className="sender-bar-right">
            <span className="text-xs text-slate-500">
              <Clock size={12} className="inline mr-1" />
              เวลาตอบกลับโดยเฉลี่ย 3-5 นาที
            </span>
          </div>
        </div>

        {/* Quick Topic Shortcut Pills */}
        <div className="user-chat-topics-row">
          <span className="topics-label">
            <Sparkles size={13} className="text-amber-500 inline mr-1" />
            หัวข้อยอดนิยม:
          </span>
          <div className="topics-pills-list">
            {quickTopicPrompts.map((topic, i) => {
              const Icon = topic.icon;
              return (
                <button
                  key={i}
                  onClick={() => handleQuickPromptClick(topic.prompt)}
                  className="topic-pill-btn"
                >
                  <Icon size={13} className="text-blue-600 mr-1.5" />
                  <span>{topic.title}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Messages Container */}
        <div className="user-chat-messages-viewport">
          <div className="chat-date-separator">
            <span>วันนี้ • 27 กุมภาพันธ์ 2569</span>
          </div>

          {/* Welcome Card from Admin */}
          <div className="user-welcome-bubble-card">
            <div className="welcome-icon-box">
              <ShieldCheck size={22} className="text-blue-600" />
            </div>
            <div className="welcome-text-box">
              <div className="welcome-title">ยินดีต้อนรับสู่ศูนย์บริการแชทหอพัก Niva Residence</div>
              <p className="welcome-desc">
                น้อง <strong>{resident.name}</strong> สามารถพิมพ์สอบถามเรื่องห้องพัก <strong>{resident.roomNumber}</strong>, แจ้งซ่อมบำรุง, ติดตามพัสดุ หรือแจ้งปัญหาฉุกเฉินได้ทันที ข้อความนี้ส่งตรงถึงเคาน์เตอร์ธุรการหอพักครับ
              </p>
            </div>
          </div>

          {/* Messages */}
          {roomMessages.map((msg) => {
            const isResident = msg.sender === 'resident';
            return (
              <div 
                key={msg.id} 
                className={`user-chat-msg-row ${isResident ? 'from-me' : 'from-admin'}`}
              >
                {!isResident && (
                  <div className="admin-chat-avatar">
                    N
                  </div>
                )}

                <div className="user-msg-bubble-group">
                  <div className="user-msg-sender-info">
                    <span className="sender-label">
                      {isResident ? 'ฉัน (ห้อง ' + resident.roomNumber + ')' : 'นิติบุคคล Niva Residence'}
                    </span>
                    <span className="sender-time">{msg.timeFormatted}</span>
                  </div>

                  <div className={`user-msg-bubble ${isResident ? 'my-bubble' : 'admin-bubble'}`}>
                    <p className="bubble-text">{msg.text}</p>
                    {msg.imageUrl && (
                      <div className="bubble-attachment">
                        <img 
                          src={msg.imageUrl} 
                          alt="รูปภาพแนบ" 
                          className="attachment-img"
                          onClick={() => window.open(msg.imageUrl, '_blank')}
                        />
                      </div>
                    )}
                  </div>

                  {isResident && (
                    <div className="user-msg-read-tick">
                      {msg.isRead ? (
                        <>
                          <CheckCheck size={13} className="text-blue-500 inline mr-1" />
                          <span>เจ้าหน้าที่อ่านแล้ว</span>
                        </>
                      ) : (
                        <>
                          <Check size={13} className="text-slate-400 inline mr-1" />
                          <span>ส่งแล้ว</span>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Realistic Typing Indicator */}
          {isTyping && (
            <div className="user-chat-msg-row from-admin">
              <div className="admin-chat-avatar">N</div>
              <div className="typing-indicator-box">
                <span className="typing-dot"></span>
                <span className="typing-dot"></span>
                <span className="typing-dot"></span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Attachment preview if selected */}
        {attachedImage && (
          <div className="attached-preview-strip">
            <div className="preview-thumb-box">
              <img src={attachedImage} alt="รูปภาพแนบ" />
              <button 
                onClick={() => setAttachedImage(null)} 
                className="remove-attach-btn"
                title="ยกเลิกรูปนี้"
              >
                <X size={12} />
              </button>
            </div>
            <span className="preview-label">แนบรูปภาพแล้ว (กดปุ่มส่งเพื่อส่งรูปถึงเจ้าหน้าที่)</span>
          </div>
        )}

        {/* Input Bar */}
        <div className="user-chat-input-bar">
          <button
            onClick={handleMockAttachPhoto}
            className="user-chat-tool-btn"
            title="แนบรูปถ่ายอุปกรณ์หรือสลิป"
          >
            <ImageIcon size={20} />
          </button>

          <input
            type="text"
            placeholder="พิมพ์ข้อความสอบถามธุรการ... (กด Enter เพื่อส่ง)"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyPress}
            className="user-chat-input"
          />

          <button
            onClick={handleSend}
            disabled={!inputText.trim() && !attachedImage}
            className="user-chat-send-btn"
          >
            <span>ส่ง</span>
            <Send size={15} />
          </button>
        </div>

        {/* Footer Emergency Disclaimer */}
        <footer className="user-chat-footer-notice">
          <Info size={13} className="text-slate-400 inline mr-1" />
          <span>
            หากเกิดเหตุฉุกเฉินนอกเวลาทำการ (หลัง 20:30 น.) เช่น ไฟไหม้, กลิ่นไหม้, ท่อประปาแตกฉุกเฉิน กรุณาโทรติดต่อ รปภ. ประจำป้อมหน้า <strong>02-123-4569</strong> (ตลอด 24 ชั่วโมง)
          </span>
        </footer>

      </div>
    </div>
  );
};
