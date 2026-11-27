import React, { useState } from "react";
import {
  Wrench,
  Plus,
  Clock,
  CheckCircle2,
  Camera,
  Send,
  User,
  X,
} from "lucide-react";
import type { RepairTicket, Resident, RepairPriority } from "../../types";

interface UserRepairsViewProps {
  resident: Resident;
  repairs: RepairTicket[];
  onSubmitTicket: (ticket: Partial<RepairTicket>) => void;
}

export const UserRepairsView: React.FC<UserRepairsViewProps> = ({
  resident,
  repairs,
  onSubmitTicket,
}) => {
  const [showNewModal, setShowNewModal] = useState(false);
  const [category, setCategory] =
    useState<RepairTicket["category"]>("เครื่องปรับอากาศ");
  const [priority, setPriority] = useState<RepairPriority>("ปกติ");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [hasPhoto, setHasPhoto] = useState(false);

  const roomRepairs = repairs.filter(
    (r) => r.roomNumber === resident.roomNumber,
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSubmitTicket({
      roomNumber: resident.roomNumber,
      residentName: resident.name,
      category,
      priority,
      title,
      description,
      status: "pending",
      reportedAt: "เมื่อสักครู่",
    });

    setTitle("");
    setDescription("");
    setHasPhoto(false);
    setShowNewModal(false);
    alert(
      "ส่งเรื่องแจ้งซ่อมเรียบร้อยแล้ว! เจ้าหน้าที่จะจัดคิวช่างและอัปเดตสถานะในระบบ",
    );
  };

  return (
    <div className="user-repairs-container">
      {/* Header Row */}
      <div className="user-view-header-row">
        <div>
          <h3 className="section-heading">แจ้งซ่อมบำรุงห้องพัก</h3>
          <p className="section-subheading">
            ห้อง {resident.roomNumber} · ทีมช่างประจำอาคารให้บริการ 08:30 -
            17:30 น.
          </p>
        </div>
        <button
          className="btn-create-repair-user"
          onClick={() => setShowNewModal(true)}
        >
          <Plus size={16} />
          <span>แจ้งซ่อมใหม่</span>
        </button>
      </div>

      {/* REPAIRS LIST */}
      <div className="user-repairs-list">
        {roomRepairs.length === 0 ? (
          <div className="user-empty-state">
            <Wrench size={40} className="text-gray-300 mb-2" />
            <div className="font-semibold text-slate-700">
              ไม่มีรายการแจ้งซ่อมในห้องพักนี้
            </div>
            <div className="text-sm text-gray-500">
              หากมีอุปกรณ์ชำรุด สามารถกดปุ่ม "แจ้งซ่อมใหม่" ด้านบนได้เลย
            </div>
          </div>
        ) : (
          roomRepairs.map((ticket) => (
            <div
              key={ticket.id}
              className={`user-ticket-card status-${ticket.status}`}
            >
              <div className="user-ticket-top">
                <span className="user-ticket-cat">{ticket.category}</span>
                <span className={`user-ticket-status-pill ${ticket.status}`}>
                  {ticket.status === "pending" && (
                    <Clock size={12} className="inline mr-1" />
                  )}
                  {ticket.status === "in_progress" && (
                    <Wrench size={12} className="inline mr-1" />
                  )}
                  {ticket.status === "completed" && (
                    <CheckCircle2 size={12} className="inline mr-1" />
                  )}
                  {ticket.status === "pending" && "รอดำเนินการ"}
                  {ticket.status === "in_progress" && "กำลังเข้าซ่อม"}
                  {ticket.status === "completed" && "เสร็จสิ้น"}
                </span>
              </div>

              <div className="user-ticket-title">{ticket.title}</div>
              <div className="user-ticket-desc">{ticket.description}</div>

              {/* Step Tracking Line */}
              <div className="repair-timeline-stepper">
                <div className={`step-node ${ticket.status ? "active" : ""}`}>
                  <div className="node-dot">1</div>
                  <span className="node-label">แจ้งเรื่อง</span>
                </div>
                <div
                  className={`step-line ${ticket.status !== "pending" ? "active" : ""}`}
                ></div>
                <div
                  className={`step-node ${ticket.status === "in_progress" || ticket.status === "completed" ? "active" : ""}`}
                >
                  <div className="node-dot">2</div>
                  <span className="node-label">มอบหมายช่าง</span>
                </div>
                <div
                  className={`step-line ${ticket.status === "completed" ? "active" : ""}`}
                ></div>
                <div
                  className={`step-node ${ticket.status === "completed" ? "active" : ""}`}
                >
                  <div className="node-dot">3</div>
                  <span className="node-label">ซ่อมเสร็จสิ้น</span>
                </div>
              </div>

              <div className="user-ticket-footer">
                <span className="ticket-time">
                  แจ้งเมื่อ {ticket.reportedAt}
                </span>
                {ticket.technician && (
                  <span className="ticket-tech">
                    <User size={13} className="inline mr-1 text-blue-600" />
                    {ticket.technician}
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* NEW REPAIR MODAL */}
      {showNewModal && (
        <div className="modal-backdrop" onClick={() => setShowNewModal(false)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title-group">
                <div className="modal-icon-badge">
                  <Wrench size={22} />
                </div>
                <div>
                  <h3 className="modal-title">
                    เปิดใบแจ้งซ่อมห้อง {resident.roomNumber}
                  </h3>
                  <p className="modal-sub">ผู้แจ้ง: {resident.name}</p>
                </div>
              </div>
              <button
                className="modal-close-btn"
                onClick={() => setShowNewModal(false)}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group mb-3">
                  <label>หมวดหมู่งานซ่อม:</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="form-input"
                  >
                    <option value="เครื่องปรับอากาศ">
                      เครื่องปรับอากาศ (แอร์ไม่เย็น, น้ำหยด, มีเสียง)
                    </option>
                    <option value="ระบบประปา/ห้องน้ำ">
                      ระบบประปา/ห้องน้ำ (ก๊อกน้ำ, ชักโครก, ท่อน้ำทิ้ง)
                    </option>
                    <option value="ระบบไฟฟ้า/ไฟส่องสว่าง">
                      ระบบไฟฟ้า/ไฟส่องสว่าง (หลอดไฟ, ปลั๊กไฟ, สวิตช์)
                    </option>
                    <option value="เฟอร์นิเจอร์/ประตูหน้าต่าง">
                      เฟอร์นิเจอร์/ประตูหน้าต่าง (ตู้เสื้อผ้า, ลูกบิด, กลอน)
                    </option>
                    <option value="อินเทอร์เน็ต">
                      อินเทอร์เน็ต (Wi-Fi, สาย LAN)
                    </option>
                  </select>
                </div>

                <div className="form-group mb-3">
                  <label>ระดับความเร่งด่วน:</label>
                  <div className="priority-select-row">
                    {(
                      [
                        { value: "รอได้", tone: "low", hint: "ไม่เร่งด่วน" },
                        { value: "ปกติ", tone: "normal", hint: "1-3 วัน" },
                        {
                          value: "ด่วนมาก",
                          tone: "urgent",
                          hint: "กระทบการใช้ชีวิต",
                        },
                      ] as {
                        value: RepairPriority;
                        tone: string;
                        hint: string;
                      }[]
                    ).map((p) => (
                      <button
                        key={p.value}
                        type="button"
                        className={`priority-chip-btn ${p.tone} ${priority === p.value ? "active" : ""}`}
                        onClick={() => setPriority(p.value)}
                      >
                        <span className="priority-chip-title">{p.value}</span>
                        <span className="priority-chip-hint">{p.hint}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="form-group mb-3">
                  <label>หัวข้อปัญหาที่พบ:</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="เช่น แอร์มีน้ำหยด, หลอดไฟห้องน้ำดับ..."
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-group mb-3">
                  <label>รายละเอียดเพิ่มเติม:</label>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="อธิบายตำแหน่งและอาการ เพื่อให้ช่างเตรียมเครื่องมือได้ถูกต้อง..."
                    className="form-input textarea"
                    required
                  />
                </div>

                {/* Photo Simulation */}
                <div className="form-group">
                  <label>แนบรูปภาพจุดที่ชำรุด:</label>
                  <div
                    className="photo-upload-placeholder"
                    onClick={() => setHasPhoto(!hasPhoto)}
                  >
                    <Camera size={24} className="text-blue-500 mb-1" />
                    <span className="text-xs text-slate-600">
                      {hasPhoto
                        ? "✓ แนบรูปภาพตัวอย่างแล้ว (คลิกเพื่อยกเลิก)"
                        : "แตะเพื่อถ่ายรูป หรือเลือกรูปจากแกลเลอรี"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn-modal-cancel mr-2"
                  onClick={() => setShowNewModal(false)}
                >
                  ยกเลิก
                </button>
                <button type="submit" className="add-room-btn">
                  <Send size={15} />
                  <span>ส่งเรื่องแจ้งซ่อม</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
