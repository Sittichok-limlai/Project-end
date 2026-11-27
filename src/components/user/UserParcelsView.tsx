import React, { useState } from 'react';
import { 
  Package, 
  CheckCircle2, 
  QrCode, 
  MapPin, 
  X,
  Check
} from 'lucide-react';
import type { UserParcel, Resident } from '../../types';

interface UserParcelsViewProps {
  resident: Resident;
  parcels: UserParcel[];
  onPickupParcel: (parcelId: string) => void;
}

export const UserParcelsView: React.FC<UserParcelsViewProps> = ({
  resident,
  parcels,
  onPickupParcel
}) => {
  const [selectedParcelForQr, setSelectedParcelForQr] = useState<UserParcel | null>(null);

  const roomParcels = parcels.filter(p => p.roomNumber === resident.roomNumber);
  const readyParcels = roomParcels.filter(p => p.status === 'ready_for_pickup');
  const pickedUpParcels = roomParcels.filter(p => p.status === 'picked_up');

  return (
    <div className="user-parcels-container">
      {/* Pick-up location guide */}
      <div className="parcel-location-card">
        <MapPin size={20} className="text-blue-600 flex-shrink-0" />
        <div className="location-text">
          <div className="loc-title">จุดรับพัสดุ: สำนักงานนิติบุคคล ชั้น 1 อาคาร A</div>
          <div className="loc-sub">เวลาทำการรับพัสดุ: ทุกวัน 09:00 - 21:00 น. (แสดง QR หรือบัตรนักศึกษา)</div>
        </div>
      </div>

      {/* READY FOR PICKUP */}
      <div className="parcels-group-section">
        <div className="group-title-row">
          <span className="font-bold text-slate-800 text-sm">พัสดุรอรับ ({readyParcels.length} ชิ้น)</span>
          {readyParcels.length > 0 && (
            <span className="badge-ready">พร้อมให้รับแล้ว</span>
          )}
        </div>

        {readyParcels.length === 0 ? (
          <div className="user-empty-state-card">
            <CheckCircle2 size={32} className="text-emerald-500 mb-1" />
            <div className="font-medium text-slate-700 text-sm">ไม่มีพัสดุตกค้าง</div>
            <div className="text-xs text-slate-500">หากมีพัสดุมาถึง ระบบจะอัปเดตและแจ้งเตือนในระบบทันที</div>
          </div>
        ) : (
          <div className="parcels-cards-list">
            {readyParcels.map(p => (
              <div key={p.id} className="user-parcel-item-card">
                <div className="parcel-left-icon">
                  <Package size={22} className="text-blue-600" />
                </div>
                <div className="parcel-main-info">
                  <div className="parcel-carrier-name">
                    <span className="w-2 h-2 rounded-full bg-blue-600 inline-block mr-1"></span>
                    พัสดุถึงหอพักแล้ว (รอรับที่ห้องธุรการ)
                  </div>
                  <div className="parcel-track-code">รหัสพัสดุ: {p.trackingNumber}</div>
                  <div className="parcel-arrived-time">ส่งถึงหอพักเมื่อ: {p.arrivedAt}</div>
                </div>
                <div className="parcel-actions">
                  
                  <button
                    className="btn-mark-pickup"
                    onClick={() => {
                      onPickupParcel(p.id);
                      alert(`บันทึกรับพัสดุ ${p.trackingNumber} เรียบร้อยแล้ว`);
                    }}
                    title="จำลองรับพัสดุแล้ว"
                  >
                    <Check size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* PICKED UP HISTORY */}
      {pickedUpParcels.length > 0 && (
        <div className="parcels-group-section mt-4">
          <div className="group-title-row">
            <span className="font-bold text-slate-600 text-sm">ประวัติการรับพัสดุที่ผ่านมา</span>
          </div>
          <div className="parcels-cards-list">
            {pickedUpParcels.map(p => (
              <div key={p.id} className="user-parcel-item-card picked-up">
                <div className="parcel-left-icon">
                  <CheckCircle2 size={20} className="text-gray-400" />
                </div>
                <div className="parcel-main-info">
                  <div className="parcel-carrier-name text-gray-600">พัสดุถึงหอพักและรับเรียบร้อยแล้ว</div>
                  <div className="parcel-track-code text-gray-500">รหัสพัสดุ: {p.trackingNumber}</div>
                  <div className="parcel-arrived-time">รับแล้วเมื่อ: {p.pickedUpAt || 'เร็วๆ นี้'}</div>
                </div>
                <span className="picked-up-pill">รับแล้ว</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* QR MODAL FOR PICKUP */}
      {selectedParcelForQr && (
        <div className="modal-backdrop" onClick={() => setSelectedParcelForQr(null)}>
          <div className="modal-container text-center" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title-group">
                <div className="modal-icon-badge">
                  <Package size={22} />
                </div>
                <div>
                  <h3 className="modal-title">รหัสรับพัสดุ (ถึงหอพักแล้ว)</h3>
                  <p className="modal-sub">ห้อง {resident.roomNumber} ({resident.name}) · จุดรับ: สำนักงานธุรการ ชั้น 1</p>
                </div>
              </div>
              <button className="modal-close-btn" onClick={() => setSelectedParcelForQr(null)}>
                <X size={20} />
              </button>
            </div>

            <div className="modal-body">
              <div className="parcel-qr-display-box">
                <div className="qr-large-center">
                  <QrCode size={190} className="text-slate-900" />
                </div>
                <div className="barcode-mock-line">||| | |||| | ||| |||| | ||| ||</div>
                <div className="pickup-code-big font-mono">{selectedParcelForQr.trackingNumber}</div>
                <div className="text-xs text-slate-500 mt-2">
                  แสดง QR หรือ Barcode นี้ให้แก่เจ้าหน้าที่นิติบุคคลเพื่อสแกนจ่ายพัสดุ
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button
                className="add-room-btn mr-2"
                onClick={() => {
                  onPickupParcel(selectedParcelForQr.id);
                  setSelectedParcelForQr(null);
                }}
              >
                <Check size={16} />
                <span>ยืนยันรับพัสดุนี้แล้ว</span>
              </button>
              <button className="btn-modal-cancel" onClick={() => setSelectedParcelForQr(null)}>
                ปิด
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
