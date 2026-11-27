import React, { useState } from 'react';
import { 
  Search, 
  Send, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Check, 
  X, 
  CreditCard, 
  FileText,
  Plus
} from 'lucide-react';
import type { UtilityBill, PaymentStatus } from '../../types';

export type NewBillInput = Omit<UtilityBill, 'id'>;

interface BillingViewProps {
  bills: UtilityBill[];
  onApproveBill: (billId: string) => void;
  onRejectBill: (billId: string) => void;
  /** สร้างบิลใหม่ (parent ต้องสร้าง id และ push เข้า state) */
  onCreateBill: (bill: NewBillInput) => void;
  activeVerificationBill?: UtilityBill | null;
  onCloseVerificationModal: () => void;
}

const WATER_RATE = 18;
const ELEC_RATE = 8;
const MONTH_OPTIONS = ['กุมภาพันธ์ 2569', 'มกราคม 2569', 'ธันวาคม 2568'];

interface BillForm {
  roomNumber: string;
  residentName: string;
  month: string;
  rentAmount: string;
  waterPrev: string;
  waterCurr: string;
  elecPrev: string;
  elecCurr: string;
  commonFee: string;
}

const emptyForm = (month: string): BillForm => ({
  roomNumber: '',
  residentName: '',
  month,
  rentAmount: '',
  waterPrev: '',
  waterCurr: '',
  elecPrev: '',
  elecCurr: '',
  commonFee: '',
});

const num = (v: string) => (v.trim() === '' ? 0 : Number(v));

export const BillingView: React.FC<BillingViewProps> = ({
  bills,
  onApproveBill,
  onRejectBill,
  onCreateBill,
  activeVerificationBill,
  onCloseVerificationModal
}) => {
  const [selectedMonth, setSelectedMonth] = useState('กุมภาพันธ์ 2569');
  const [statusFilter, setStatusFilter] = useState<PaymentStatus | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [inspectBill, setInspectBill] = useState<UtilityBill | null>(activeVerificationBill || null);

  // สร้างบิลใหม่
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState<BillForm>(emptyForm('กุมภาพันธ์ 2569'));
  const [formError, setFormError] = useState('');

  React.useEffect(() => {
    if (activeVerificationBill) {
      setInspectBill(activeVerificationBill);
    }
  }, [activeVerificationBill]);

  const openCreate = () => {
    setForm(emptyForm(selectedMonth));
    setFormError('');
    setShowCreate(true);
  };

  const closeCreate = () => {
    setShowCreate(false);
    setFormError('');
  };

  const setField = (key: keyof BillForm, value: string) => {
    setForm((f) => ({ ...f, [key]: value }));
    if (formError) setFormError('');
  };

  // คำนวณยอดจากฟอร์ม
  const waterUnits = Math.max(0, num(form.waterCurr) - num(form.waterPrev));
  const elecUnits = Math.max(0, num(form.elecCurr) - num(form.elecPrev));
  const previewWater = waterUnits * WATER_RATE;
  const previewElec = elecUnits * ELEC_RATE;
  const previewTotal = num(form.rentAmount) + previewWater + previewElec + num(form.commonFee);

  const handleCreateBill = () => {
    const roomNumber = form.roomNumber.trim();
    const residentName = form.residentName.trim();

    if (!roomNumber) return setFormError('กรุณากรอกเลขห้อง');
    if (!residentName) return setFormError('กรุณากรอกชื่อผู้พักอาศัย');
    if (form.rentAmount.trim() === '') return setFormError('กรุณากรอกค่าเช่า');

    const numericFields: (keyof BillForm)[] = [
      'rentAmount', 'waterPrev', 'waterCurr', 'elecPrev', 'elecCurr', 'commonFee',
    ];
    for (const key of numericFields) {
      const n = num(form[key]);
      if (Number.isNaN(n) || n < 0) return setFormError('กรุณากรอกตัวเลขที่ไม่ติดลบ');
    }
    if (num(form.waterCurr) < num(form.waterPrev)) {
      return setFormError('เลขมิเตอร์น้ำครั้งนี้ต้องไม่น้อยกว่าครั้งก่อน');
    }
    if (num(form.elecCurr) < num(form.elecPrev)) {
      return setFormError('เลขมิเตอร์ไฟครั้งนี้ต้องไม่น้อยกว่าครั้งก่อน');
    }
    if (bills.some((b) => b.roomNumber === roomNumber && b.month === form.month)) {
      return setFormError(`ห้อง ${roomNumber} มีบิลรอบ ${form.month} อยู่แล้ว`);
    }

    const newBill: NewBillInput = {
      roomNumber,
      residentName,
      month: form.month,
      rentAmount: num(form.rentAmount),
      waterPrev: num(form.waterPrev),
      waterCurr: num(form.waterCurr),
      waterTotal: previewWater,
      elecPrev: num(form.elecPrev),
      elecCurr: num(form.elecCurr),
      elecTotal: previewElec,
      commonFee: num(form.commonFee),
      grandTotal: previewTotal,
      status: 'unpaid',
    } as NewBillInput;

    onCreateBill(newBill);
    closeCreate();
  };

  const filteredBills = bills.filter(b => {
    if (statusFilter !== 'all' && b.status !== statusFilter) return false;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const matchRoom = b.roomNumber.toLowerCase().includes(term);
      const matchName = b.residentName.toLowerCase().includes(term);
      if (!matchRoom && !matchName) return false;
    }
    return true;
  });

  const totalBilled = bills.reduce((acc, b) => acc + b.grandTotal, 0);
  const totalPaid = bills.filter(b => b.status === 'paid').reduce((acc, b) => acc + b.grandTotal, 0);
  const totalPending = bills.filter(b => b.status === 'pending_verification').reduce((acc, b) => acc + b.grandTotal, 0);
  const totalUnpaid = bills.filter(b => b.status === 'unpaid' || b.status === 'overdue').reduce((acc, b) => acc + b.grandTotal, 0);

  const getStatusBadge = (status: PaymentStatus) => {
    switch (status) {
      case 'paid':
        return <span className="status-pill-badge paid"><CheckCircle2 size={13} /> ชำระแล้ว</span>;
      case 'pending_verification':
        return <span className="status-pill-badge pending"><Clock size={13} /> รอตรวจสอบสลิป</span>;
      case 'unpaid':
        return <span className="status-pill-badge unpaid"><AlertCircle size={13} /> ยังไม่ชำระ</span>;
      case 'overdue':
        return <span className="status-pill-badge overdue"><AlertCircle size={13} /> เกินกำหนด</span>;
    }
  };

  return (
    <div className="billing-view-container">
      {/* View Header */}
      <div className="view-header-row">
        <div>
          <h2 className="view-title">ค่าเช่า & ค่าน้ำ-ค่าไฟ (Billing & Invoices)</h2>
          <p className="view-subtitle">คำนวณมิเตอร์น้ำ-ไฟ ตรวจสอบสลิปโอนเงิน และออกใบเสร็จรับเงิน</p>
        </div>
        <div className="view-header-actions">
          <select 
            value={selectedMonth} 
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="month-selector-dropdown"
          >
            {MONTH_OPTIONS.map((m) => (
              <option key={m} value={m}>รอบบิล: {m}</option>
            ))}
          </select>
          <button className="add-room-btn" onClick={openCreate}>
            <Plus size={16} />
            <span>สร้างบิลใหม่</span>
          </button>
        </div>
      </div>

      {/* SUMMARY METRICS */}
      <div className="billing-summary-grid">
        <div className="summary-box">
          <div className="summary-label">ยอดเรียกเก็บรวมทั้งสิ้น</div>
          <div className="summary-val">฿{totalBilled.toLocaleString()}</div>
          <div className="summary-sub">ค่าเช่า + ค่าน้ำ + ค่าไฟ 120 ห้อง</div>
        </div>
        <div className="summary-box good">
          <div className="summary-label">ชำระแล้วเรียบร้อย</div>
          <div className="summary-val text-emerald-600">฿{totalPaid.toLocaleString()}</div>
          <div className="summary-sub">ออกใบเสร็จอัตโนมัติแล้ว</div>
        </div>
        <div className="summary-box warning">
          <div className="summary-label">รอตรวจสอบสลิป</div>
          <div className="summary-val text-amber-600">฿{totalPending.toLocaleString()}</div>
          <div className="summary-sub">{bills.filter(b => b.status === 'pending_verification').length} รายการรอยืนยัน</div>
        </div>
        <div className="summary-box danger">
          <div className="summary-label">ยอดค้างชำระ / เกินกำหนด</div>
          <div className="summary-val text-rose-600">฿{totalUnpaid.toLocaleString()}</div>
          <div className="summary-sub">{bills.filter(b => b.status === 'unpaid' || b.status === 'overdue').length} ห้องยังไม่โอน</div>
        </div>
      </div>

      {/* FILTERS */}
      <div className="table-filter-bar">
        <div className="status-chips-group">
          <button
            className={`status-chip ${statusFilter === 'all' ? 'active' : ''}`}
            onClick={() => setStatusFilter('all')}
          >
            บิลทั้งหมด ({bills.length})
          </button>
          <button
            className={`status-chip pending ${statusFilter === 'pending_verification' ? 'active' : ''}`}
            onClick={() => setStatusFilter('pending_verification')}
          >
            <Clock size={14} className="inline mr-1" />
            รอตรวจสอบสลิป ({bills.filter(b => b.status === 'pending_verification').length})
          </button>
          <button
            className={`status-chip paid ${statusFilter === 'paid' ? 'active' : ''}`}
            onClick={() => setStatusFilter('paid')}
          >
            <Check size={14} className="inline mr-1" />
            ชำระแล้ว ({bills.filter(b => b.status === 'paid').length})
          </button>
          <button
            className={`status-chip unpaid ${statusFilter === 'unpaid' ? 'active' : ''}`}
            onClick={() => setStatusFilter('unpaid')}
          >
            ค้างชำระ ({bills.filter(b => b.status === 'unpaid').length})
          </button>
        </div>

        <div className="search-input-group">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            placeholder="ค้นหาเลขห้อง หรือชื่อผู้พัก..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="table-search-input"
          />
        </div>
      </div>

      {/* BILLING TABLE */}
      <div className="table-responsive-wrapper">
        <table className="styled-data-table">
          <thead>
            <tr>
              <th>ห้อง</th>
              <th>ผู้พักอาศัย</th>
              <th>ค่าเช่า</th>
              <th>ค่าน้ำ ({WATER_RATE} บ./หน่วย)</th>
              <th>ค่าไฟ ({ELEC_RATE} บ./หน่วย)</th>
              <th>ค่าส่วนกลาง</th>
              <th>ยอดสุทธิ</th>
              <th>สถานะ</th>
              <th style={{ textAlign: 'center' }}>การดำเนินการ</th>
            </tr>
          </thead>
          <tbody>
            {filteredBills.map((bill) => (
              <tr key={bill.id}>
                <td>
                  <span className="room-badge-table">ห้อง {bill.roomNumber}</span>
                </td>
                <td>
                  <span className="font-semibold text-slate-800">{bill.residentName}</span>
                </td>
                <td>฿{bill.rentAmount.toLocaleString()}</td>
                <td>
                  <div className="meter-detail">
                    <span>฿{bill.waterTotal.toLocaleString()}</span>
                    <span className="meter-units">({bill.waterCurr - bill.waterPrev} หน่วย)</span>
                  </div>
                </td>
                <td>
                  <div className="meter-detail">
                    <span>฿{bill.elecTotal.toLocaleString()}</span>
                    <span className="meter-units">({bill.elecCurr - bill.elecPrev} หน่วย)</span>
                  </div>
                </td>
                <td>฿{bill.commonFee.toLocaleString()}</td>
                <td>
                  <span className="font-bold text-blue-800 text-base">฿{bill.grandTotal.toLocaleString()}</span>
                </td>
                <td>{getStatusBadge(bill.status)}</td>
                <td style={{ textAlign: 'center' }}>
                  <div className="table-action-btns">
                    {bill.status === 'pending_verification' && (
                      <button
                        className="btn-action-verify"
                        onClick={() => setInspectBill(bill)}
                      >
                        ตรวจสลิป
                      </button>
                    )}
                    {bill.status === 'paid' && (
                      <button
                        className="btn-action-view"
                        title="ดูใบเสร็จรับเงิน"
                        onClick={() => alert(`ใบเสร็จเลขที่ REC-${bill.roomNumber}-256902 ชำระแล้วจำนวน ฿${bill.grandTotal.toLocaleString()}`)}
                      >
                        <FileText size={16} />
                      </button>
                    )}
                    {(bill.status === 'unpaid' || bill.status === 'overdue') && (
                      <button
                        className="btn-action-msg"
                        title="ส่งแจ้งเตือนยอดชำระผ่าน LINE OA"
                        onClick={() => alert(`ส่งการแจ้งเตือนชำระเงินไปยัง LINE OA ห้อง ${bill.roomNumber} เรียบร้อยแล้ว`)}
                      >
                        <Send size={15} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* CREATE BILL MODAL */}
      {showCreate && (
        <div className="modal-backdrop" onClick={closeCreate}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title-group">
                <div className="modal-icon-badge">
                  <FileText size={24} />
                </div>
                <div>
                  <h3 className="modal-title">สร้างรายการบิลใหม่</h3>
                  <p className="modal-sub">กรอกข้อมูลห้อง มิเตอร์น้ำ-ไฟ และค่าใช้จ่าย ระบบคำนวณยอดให้อัตโนมัติ</p>
                </div>
              </div>
              <button className="modal-close-btn" onClick={closeCreate}>
                <X size={20} />
              </button>
            </div>

            <div className="modal-body">
              <div className="detail-item-grid">
                <div className="detail-cell">
                  <label className="cell-label" htmlFor="bill-room">เลขห้อง *</label>
                  <input
                    id="bill-room"
                    type="text"
                    className="table-search-input"
                    placeholder="เช่น 101"
                    value={form.roomNumber}
                    onChange={(e) => setField('roomNumber', e.target.value)}
                  />
                </div>
                <div className="detail-cell">
                  <label className="cell-label" htmlFor="bill-name">ชื่อผู้พักอาศัย *</label>
                  <input
                    id="bill-name"
                    type="text"
                    className="table-search-input"
                    placeholder="เช่น สมชาย ใจดี"
                    value={form.residentName}
                    onChange={(e) => setField('residentName', e.target.value)}
                  />
                </div>
                <div className="detail-cell">
                  <label className="cell-label" htmlFor="bill-month">รอบบิล</label>
                  <select
                    id="bill-month"
                    className="month-selector-dropdown"
                    value={form.month}
                    onChange={(e) => setField('month', e.target.value)}
                  >
                    {MONTH_OPTIONS.map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>
                <div className="detail-cell">
                  <label className="cell-label" htmlFor="bill-rent">ค่าเช่า (บาท) *</label>
                  <input
                    id="bill-rent"
                    type="number"
                    min="0"
                    className="table-search-input"
                    value={form.rentAmount}
                    onChange={(e) => setField('rentAmount', e.target.value)}
                  />
                </div>
                <div className="detail-cell">
                  <label className="cell-label" htmlFor="bill-water-prev">มิเตอร์น้ำ ครั้งก่อน</label>
                  <input
                    id="bill-water-prev"
                    type="number"
                    min="0"
                    className="table-search-input"
                    value={form.waterPrev}
                    onChange={(e) => setField('waterPrev', e.target.value)}
                  />
                </div>
                <div className="detail-cell">
                  <label className="cell-label" htmlFor="bill-water-curr">มิเตอร์น้ำ ครั้งนี้</label>
                  <input
                    id="bill-water-curr"
                    type="number"
                    min="0"
                    className="table-search-input"
                    value={form.waterCurr}
                    onChange={(e) => setField('waterCurr', e.target.value)}
                  />
                </div>
                <div className="detail-cell">
                  <label className="cell-label" htmlFor="bill-elec-prev">มิเตอร์ไฟ ครั้งก่อน</label>
                  <input
                    id="bill-elec-prev"
                    type="number"
                    min="0"
                    className="table-search-input"
                    value={form.elecPrev}
                    onChange={(e) => setField('elecPrev', e.target.value)}
                  />
                </div>
                <div className="detail-cell">
                  <label className="cell-label" htmlFor="bill-elec-curr">มิเตอร์ไฟ ครั้งนี้</label>
                  <input
                    id="bill-elec-curr"
                    type="number"
                    min="0"
                    className="table-search-input"
                    value={form.elecCurr}
                    onChange={(e) => setField('elecCurr', e.target.value)}
                  />
                </div>
                <div className="detail-cell">
                  <label className="cell-label" htmlFor="bill-common">ค่าส่วนกลาง (บาท)</label>
                  <input
                    id="bill-common"
                    type="number"
                    min="0"
                    className="table-search-input"
                    value={form.commonFee}
                    onChange={(e) => setField('commonFee', e.target.value)}
                  />
                </div>
              </div>

              {/* Live calculation preview */}
              <div className="detail-breakdown-card" style={{ marginTop: 16 }}>
                <h4 className="breakdown-title">สรุปยอดที่คำนวณได้</h4>
                <div className="breakdown-line">
                  <span>ค่าเช่าห้องพักรายเดือน:</span>
                  <strong>฿{num(form.rentAmount).toLocaleString()}</strong>
                </div>
                <div className="breakdown-line">
                  <span>ค่าน้ำประปา ({waterUnits} หน่วย @ ฿{WATER_RATE}):</span>
                  <strong>฿{previewWater.toLocaleString()}</strong>
                </div>
                <div className="breakdown-line">
                  <span>ค่าไฟฟ้า ({elecUnits} หน่วย @ ฿{ELEC_RATE}):</span>
                  <strong>฿{previewElec.toLocaleString()}</strong>
                </div>
                <div className="breakdown-line">
                  <span>ค่าบำรุงรักษาส่วนกลาง:</span>
                  <strong>฿{num(form.commonFee).toLocaleString()}</strong>
                </div>
                <hr className="breakdown-divider" />
                <div className="breakdown-total">
                  <span>ยอดรวมที่ต้องชำระ:</span>
                  <span className="total-number">฿{previewTotal.toLocaleString()}</span>
                </div>
              </div>

              {formError && (
                <div style={{ color: '#dc2626', fontSize: 13, marginTop: 12 }}>{formError}</div>
              )}
            </div>

            <div className="modal-footer">
              <button className="btn-modal-cancel" onClick={closeCreate}>
                ยกเลิก
              </button>
              <button className="btn-approve" onClick={handleCreateBill}>
                <Check size={18} />
                <span>สร้างบิล</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SLIP VERIFICATION MODAL */}
      {inspectBill && (
        <div className="modal-backdrop" onClick={() => { setInspectBill(null); onCloseVerificationModal(); }}>
          <div className="modal-container slip-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title-group">
                <div className="modal-icon-badge">
                  <CreditCard size={24} />
                </div>
                <div>
                  <h3 className="modal-title">ตรวจสอบสลิปโอนเงิน · ห้อง {inspectBill.roomNumber}</h3>
                  <p className="modal-sub">{inspectBill.residentName} · รอบบิล {inspectBill.month}</p>
                </div>
              </div>
              <button 
                className="modal-close-btn"
                onClick={() => { setInspectBill(null); onCloseVerificationModal(); }}
              >
                <X size={20} />
              </button>
            </div>

            <div className="modal-body slip-modal-split">
              {/* Left: Slip Mockup */}
              <div className="slip-preview-container">
                <div className="bank-slip-card">
                  <div className="slip-bank-header">
                    <div className="bank-logo-tag">ธนาคารไทยพาณิชย์ (SCB)</div>
                    <div className="slip-success-badge">โอนเงินสำเร็จ</div>
                  </div>
                  <div className="slip-amount-big">
                    ฿{inspectBill.grandTotal.toLocaleString()}.00
                  </div>
                  <div className="slip-date-time">
                    {inspectBill.paidAt || '20 ก.พ. 2569 - 18:05 น.'}
                  </div>

                  <div className="slip-transfer-parties">
                    <div className="transfer-party">
                      <span className="party-role">จาก:</span>
                      <span className="party-name">{inspectBill.residentName}</span>
                      <span className="party-acc">xxx-xxx891-2</span>
                    </div>
                    <div className="transfer-arrow">↓</div>
                    <div className="transfer-party">
                      <span className="party-role">ไปยัง:</span>
                      <span className="party-name">มหาวิทยาลัยนิวา (หอพัก Niva Residence)</span>
                      <span className="party-acc">พร้อมเพย์ 0105556098765</span>
                    </div>
                  </div>

                  <div className="slip-qr-box">
                    <div className="slip-qr-mock">
                      [ QR Code ยืนยันข้อมูลสลิป PromptPay Biller ID ]
                    </div>
                    <div className="slip-ref">Ref: 25690220{inspectBill.roomNumber}8841</div>
                  </div>
                </div>
              </div>

              {/* Right: Bill Breakdown */}
              <div className="bill-details-column">
                <div className="detail-breakdown-card">
                  <h4 className="breakdown-title">รายละเอียดค่าใช้จ่ายห้อง {inspectBill.roomNumber}</h4>
                  
                  <div className="breakdown-line">
                    <span>ค่าเช่าห้องพักรายเดือน:</span>
                    <strong>฿{inspectBill.rentAmount.toLocaleString()}</strong>
                  </div>
                  <div className="breakdown-line">
                    <span>ค่าน้ำประปา ({inspectBill.waterCurr - inspectBill.waterPrev} หน่วย @ ฿{WATER_RATE}):</span>
                    <strong>฿{inspectBill.waterTotal.toLocaleString()}</strong>
                  </div>
                  <div className="breakdown-line">
                    <span>ค่าไฟฟ้า ({inspectBill.elecCurr - inspectBill.elecPrev} หน่วย @ ฿{ELEC_RATE}):</span>
                    <strong>฿{inspectBill.elecTotal.toLocaleString()}</strong>
                  </div>
                  <div className="breakdown-line">
                    <span>ค่าบำรุงรักษาส่วนกลาง:</span>
                    <strong>฿{inspectBill.commonFee.toLocaleString()}</strong>
                  </div>
                  <hr className="breakdown-divider" />
                  <div className="breakdown-total">
                    <span>ยอดรวมที่ต้องชำระ:</span>
                    <span className="total-number">฿{inspectBill.grandTotal.toLocaleString()}</span>
                  </div>
                </div>

                <div className="slip-approval-actions">
                  <button 
                    className="btn-approve"
                    onClick={() => {
                      onApproveBill(inspectBill.id);
                      setInspectBill(null);
                      onCloseVerificationModal();
                    }}
                  >
                    <Check size={18} />
                    <span>อนุมัติสลิปและส่งใบเสร็จรับเงินทาง LINE OA</span>
                  </button>

                  <button 
                    className="btn-reject"
                    onClick={() => {
                      onRejectBill(inspectBill.id);
                      setInspectBill(null);
                      onCloseVerificationModal();
                    }}
                  >
                    <X size={18} />
                    <span>แจ้งสลิปไม่ถูกต้อง / แนบใหม่</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};