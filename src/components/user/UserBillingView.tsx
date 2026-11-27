import React, { useState } from 'react';
import { 
  Receipt, 
  QrCode, 
  Upload, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Download, 
  FileText,
  X
} from 'lucide-react';
import type { UtilityBill, Resident } from '../../types';

interface UserBillingViewProps {
  resident: Resident;
  bill?: UtilityBill;
  onSubmitSlip: (billId: string, slipUrl: string) => void;
}

export const UserBillingView: React.FC<UserBillingViewProps> = ({
  resident,
  bill,
  onSubmitSlip
}) => {
  const [selectedTab, setSelectedTab] = useState<'current' | 'history'>('current');
  const [uploadedSlipPreview, setUploadedSlipPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);

  if (!bill) {
    return (
      <div className="user-empty-state">
        <Receipt size={48} className="text-gray-300 mb-3" />
        <div className="font-semibold text-slate-700">ไม่พบบิลค่าใช้จ่ายของห้อง {resident.roomNumber}</div>
        <div className="text-sm text-gray-500">เจ้าหน้าที่ยังไม่ได้ออกรอบบิลประจำเดือนนี้</div>
      </div>
    );
  }

  const handleSimulateSlipUpload = () => {
    // Mock upload SCB bank slip
    setUploadedSlipPreview('https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400&q=80');
  };

  const handleConfirmSubmitSlip = () => {
    if (!uploadedSlipPreview) return;
    setIsSubmitting(true);
    setTimeout(() => {
      onSubmitSlip(bill.id, uploadedSlipPreview);
      setIsSubmitting(false);
      setUploadedSlipPreview(null);
      alert('ส่งสลิปโอนเงินเรียบร้อยแล้ว! เจ้าหน้าที่จะตรวจสอบและออกใบเสร็จให้ภายใน 24 ชม.');
    }, 600);
  };

  return (
    <div className="user-billing-container">
      {/* TABS */}
      <div className="user-subnav-tabs">
        <button
          className={`subnav-tab ${selectedTab === 'current' ? 'active' : ''}`}
          onClick={() => setSelectedTab('current')}
        >
          บิลเดือนปัจจุบัน ({bill.month})
        </button>
        <button
          className={`subnav-tab ${selectedTab === 'history' ? 'active' : ''}`}
          onClick={() => setSelectedTab('history')}
        >
          ประวัติการชำระย้อนหลัง
        </button>
      </div>

      {selectedTab === 'current' ? (
        <div className="current-bill-content">
          {/* Status banner */}
          <div className={`bill-user-status-strip ${bill.status}`}>
            {bill.status === 'paid' && (
              <>
                <CheckCircle2 size={18} className="text-emerald-700" />
                <div className="status-text-block">
                  <span className="title">ชำระเงินเรียบร้อยแล้ว</span>
                  <span className="desc">ออกใบเสร็จรับเงินเมื่อ {bill.paidAt || '15 ก.พ. 2569'}</span>
                </div>
                <button 
                  className="view-receipt-mini-btn"
                  onClick={() => setShowReceiptModal(true)}
                >
                  <FileText size={14} />
                  <span>ใบเสร็จ</span>
                </button>
              </>
            )}

            {bill.status === 'pending_verification' && (
              <>
                <Clock size={18} className="text-amber-700" />
                <div className="status-text-block">
                  <span className="title">ส่งสลิปแล้ว · รอเจ้าหน้าที่ตรวจสอบ</span>
                  <span className="desc">ระบบจะอัปเดตสถานะและออกใบเสร็จให้ในระบบทันทีที่อนุมัติ</span>
                </div>
              </>
            )}

            {(bill.status === 'unpaid' || bill.status === 'overdue') && (
              <>
                <AlertCircle size={18} className="text-rose-700" />
                <div className="status-text-block">
                  <span className="title">รอการชำระเงิน</span>
                  <span className="desc">กรุณาชำระเงินและแนบสลิปภายในวันที่ 25 ก.พ. 2569</span>
                </div>
              </>
            )}
          </div>

          {/* Detailed Itemized Receipt Card */}
          <div className="bill-itemized-card">
            <div className="itemized-header">
              <span className="dorm-name">หอพัก Niva Residence · ห้อง {bill.roomNumber}</span>
              <span className="bill-month-badge">{bill.month}</span>
            </div>

            <div className="itemized-rows-list">
              <div className="itemized-row">
                <div className="row-left">
                  <div className="item-title">ค่าเช่าห้องพักรายเดือน</div>
                  <div className="item-sub">ห้องปรับอากาศ (เตียงเดี่ยว Standard)</div>
                </div>
                <div className="row-val">฿{bill.rentAmount.toLocaleString()}</div>
              </div>

              <div className="itemized-row">
                <div className="row-left">
                  <div className="item-title">ค่าน้ำประปา</div>
                  <div className="item-sub">
                    เลขมิเตอร์ {bill.waterPrev} → {bill.waterCurr} ({bill.waterCurr - bill.waterPrev} หน่วย @ ฿{bill.waterUnitRate})
                  </div>
                </div>
                <div className="row-val">฿{bill.waterTotal.toLocaleString()}</div>
              </div>

              <div className="itemized-row">
                <div className="row-left">
                  <div className="item-title">ค่าไฟฟ้า</div>
                  <div className="item-sub">
                    เลขมิเตอร์ {bill.elecPrev} → {bill.elecCurr} ({bill.elecCurr - bill.elecPrev} หน่วย @ ฿{bill.elecUnitRate})
                  </div>
                </div>
                <div className="row-val">฿{bill.elecTotal.toLocaleString()}</div>
              </div>

              <div className="itemized-row">
                <div className="row-left">
                  <div className="item-title">ค่าบำรุงรักษาส่วนกลาง</div>
                  <div className="item-sub">ลิฟต์, แม่บ้านทำความสะอาดทางเดิน, Wi-Fi</div>
                </div>
                <div className="row-val">฿{bill.commonFee.toLocaleString()}</div>
              </div>

              <div className="itemized-total-row">
                <span className="total-label">ยอดรวมที่ต้องชำระทั้งสิ้น</span>
                <span className="total-amount-highlight">฿{bill.grandTotal.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* PAYMENT SECTION: QR & SLIP UPLOAD */}
          {bill.status !== 'paid' && (
            <div className="payment-action-box">
              <div className="pay-method-header">
                <QrCode size={18} className="text-blue-600" />
                <span className="font-semibold text-slate-800">ชำระผ่าน PromptPay QR Code</span>
              </div>

              {/* QR Mockup */}
              <div className="promptpay-qr-wrapper">
                <div className="promptpay-top-badge">
                  <span className="pp-brand">พร้อมเพย์ PromptPay</span>
                </div>
                <div className="qr-code-image-box">
                  <QrCode size={190} className="text-slate-900" />
                </div>
                <div className="qr-pay-info">
                  <div className="biller-name">มหาวิทยาลัยนิวา (หอพักนักศึกษา)</div>
                  <div className="biller-id">Biller ID: 0105556098765</div>
                  <div className="pay-amount-badge">฿{bill.grandTotal.toLocaleString()} บาท</div>
                  <div className="ref-code">Ref: NV-{bill.roomNumber}-256902</div>
                </div>
              </div>

              {/* Slip Upload Area */}
              <div className="slip-upload-section">
                <div className="section-title-sm">
                  <Upload size={16} className="text-blue-600 mr-1 inline" />
                  แนบหลักฐานการโอนเงิน (สลิปธนาคาร)
                </div>

                {!uploadedSlipPreview ? (
                  <div className="upload-dropzone" onClick={handleSimulateSlipUpload}>
                    <Upload size={32} className="text-blue-500 mb-2" />
                    <div className="upload-cta">คลิกเพื่ออัปโหลด หรือแนบสลิปทดสอบ (Demo Slip)</div>
                    <div className="upload-hint">รองรับไฟล์ JPG, PNG จาก Mobile Banking ทุกธนาคาร</div>
                  </div>
                ) : (
                  <div className="slip-uploaded-preview-box">
                    <div className="preview-top">
                      <span className="font-medium text-emerald-800">✓ เลือกสลิปโอนเงินแล้ว</span>
                      <button 
                        className="text-xs text-rose-600 font-semibold"
                        onClick={() => setUploadedSlipPreview(null)}
                      >
                        เปลี่ยนรูป
                      </button>
                    </div>
                    <div className="mock-slip-card-thumb">
                      <div className="text-xs text-gray-500 font-mono">SCB EASY SLIP · ฿{bill.grandTotal.toLocaleString()} บาท</div>
                      <div className="text-xs text-blue-800 font-semibold">โอนสำเร็จเรียบร้อย</div>
                    </div>
                    <button
                      className="confirm-slip-btn"
                      onClick={handleConfirmSubmitSlip}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'กำลังส่งข้อมูลไปยังระบบนิติ...' : 'ยืนยันและส่งสลิปให้อนุมัติ'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* IF PAID: SHOW RECEIPT BUTTON */}
          {bill.status === 'paid' && (
            <div className="paid-e-receipt-card">
              <div className="receipt-card-left">
                <CheckCircle2 size={24} className="text-emerald-600" />
                <div>
                  <div className="font-semibold text-slate-800">ใบเสร็จรับเงินอิเล็กทรอนิกส์ (E-Receipt)</div>
                  <div className="text-xs text-slate-500">เลขที่: REC-{bill.roomNumber}-256902 · ชำระผ่าน PromptPay</div>
                </div>
              </div>
              <button 
                className="btn-open-receipt"
                onClick={() => setShowReceiptModal(true)}
              >
                <FileText size={16} />
                <span>เปิดดูใบเสร็จ</span>
              </button>
            </div>
          )}
        </div>
      ) : (
        /* HISTORY TAB */
        <div className="billing-history-list">
          <div className="history-item-card">
            <div className="history-top">
              <span className="history-month">มกราคม 2569</span>
              <span className="history-status paid">ชำระแล้ว</span>
            </div>
            <div className="history-details">
              <span>ค่าเช่า ฿4,500 + ค่าน้ำไฟ ฿1,240 + ส่วนกลาง ฿300</span>
              <span className="history-amount">฿6,040</span>
            </div>
            <div className="history-date">ชำระเมื่อ 15 ม.ค. 2569 · เลขที่ใบเสร็จ REC-{bill.roomNumber}-256901</div>
          </div>

          <div className="history-item-card">
            <div className="history-top">
              <span className="history-month">ธันวาคม 2568</span>
              <span className="history-status paid">ชำระแล้ว</span>
            </div>
            <div className="history-details">
              <span>ค่าเช่า ฿4,500 + ค่าน้ำไฟ ฿980 + ส่วนกลาง ฿300</span>
              <span className="history-amount">฿5,780</span>
            </div>
            <div className="history-date">ชำระเมื่อ 14 ธ.ค. 2568 · เลขที่ใบเสร็จ REC-{bill.roomNumber}-256812</div>
          </div>
        </div>
      )}

      {/* E-RECEIPT MODAL */}
      {showReceiptModal && (
        <div className="modal-backdrop" onClick={() => setShowReceiptModal(false)}>
          <div className="modal-container receipt-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title-group">
                <div className="modal-icon-badge">
                  <Receipt size={22} />
                </div>
                <div>
                  <h3 className="modal-title">ใบเสร็จรับเงิน / Receipt</h3>
                  <p className="modal-sub">มหาวิทยาลัยนิวา · หอพักนักศึกษา Niva Residence</p>
                </div>
              </div>
              <button className="modal-close-btn" onClick={() => setShowReceiptModal(false)}>
                <X size={20} />
              </button>
            </div>

            <div className="modal-body receipt-printable">
              <div className="receipt-watermark-box">
                <div className="receipt-head-row">
                  <div>
                    <div className="receipt-org">มหาวิทยาลัยนิวา (Niva University)</div>
                    <div className="receipt-org-sub">สำนักงานบริหารทรัพย์สินและหอพักนักศึกษา</div>
                    <div className="receipt-tax">เลขประจำตัวผู้เสียภาษี: 0105556098765</div>
                  </div>
                  <div className="receipt-meta-right">
                    <div className="rec-no">เลขที่: REC-{bill.roomNumber}-256902</div>
                    <div className="rec-date">วันที่: {bill.paidAt || '15 ก.พ. 2569'}</div>
                  </div>
                </div>

                <div className="receipt-divider"></div>

                <div className="receipt-customer-info">
                  <div><strong>ได้รับเงินจาก:</strong> {resident.name} (รหัสนักศึกษา {resident.studentId})</div>
                  <div><strong>ห้องพัก:</strong> ห้อง {bill.roomNumber} อาคาร A (คณะ{resident.faculty})</div>
                </div>

                <table className="receipt-table">
                  <thead>
                    <tr>
                      <th>ลำดับ</th>
                      <th>รายการค่าใช้จ่าย</th>
                      <th style={{ textAlign: 'right' }}>จำนวนเงิน (บาท)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>1</td>
                      <td>ค่าเช่าห้องพักรายเดือน ประจำเดือน {bill.month}</td>
                      <td style={{ textAlign: 'right' }}>{bill.rentAmount.toLocaleString()}.00</td>
                    </tr>
                    <tr>
                      <td>2</td>
                      <td>ค่าน้ำประปา ({bill.waterCurr - bill.waterPrev} หน่วย)</td>
                      <td style={{ textAlign: 'right' }}>{bill.waterTotal.toLocaleString()}.00</td>
                    </tr>
                    <tr>
                      <td>3</td>
                      <td>ค่าไฟฟ้า ({bill.elecCurr - bill.elecPrev} หน่วย)</td>
                      <td style={{ textAlign: 'right' }}>{bill.elecTotal.toLocaleString()}.00</td>
                    </tr>
                    <tr>
                      <td>4</td>
                      <td>ค่าบำรุงรักษาส่วนกลางและอินเทอร์เน็ต</td>
                      <td style={{ textAlign: 'right' }}>{bill.commonFee.toLocaleString()}.00</td>
                    </tr>
                  </tbody>
                  <tfoot>
                    <tr>
                      <th colSpan={2} style={{ textAlign: 'right' }}>จำนวนเงินรวมทั้งสิ้น:</th>
                      <th style={{ textAlign: 'right', color: '#1d6fd6', fontSize: '16px' }}>
                        ฿{bill.grandTotal.toLocaleString()}.00
                      </th>
                    </tr>
                  </tfoot>
                </table>

                <div className="receipt-stamp-row">
                  <div className="stamp-box">
                    <span className="stamp-circle">ชำระแล้ว<br />PAID</span>
                  </div>
                  <div className="sig-box">
                    <div className="sig-line"></div>
                    <div className="sig-label">(นายสมบัติ บริหารทรัพย์)</div>
                    <div className="sig-role">เจ้าหน้าที่การเงิน หอพักนักศึกษา Niva</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button 
                className="btn-modal-cancel mr-2"
                onClick={() => alert('ดาวน์โหลดใบเสร็จรับเงิน PDF สำเร็จ')}
              >
                <Download size={15} className="inline mr-1" />
                ดาวน์โหลด PDF
              </button>
              <button className="btn-modal-cancel" onClick={() => setShowReceiptModal(false)}>
                ปิด
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
