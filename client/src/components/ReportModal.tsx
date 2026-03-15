import React, { useState } from 'react';
import { Flag, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { reportService } from '../services/reportService';
import { ReportType, ReportReason } from '../types';
import { C } from '../design';
import toast from 'react-hot-toast';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetType: ReportType;
  targetId: string;
  targetName: string;
}

const reasonLabels: Record<ReportReason, string> = {
  [ReportReason.INAPPROPRIATE_CONTENT]: 'Inappropriate content',
  [ReportReason.SCAM_FRAUD]: 'Scam or fraud',
  [ReportReason.OFFENSIVE_BEHAVIOR]: 'Offensive behavior',
  [ReportReason.SPAM]: 'Spam',
  [ReportReason.OTHER]: 'Other',
};

const ReportModal: React.FC<ReportModalProps> = ({ isOpen, onClose, targetType, targetId, targetName }) => {
  const { currentUser, userProfile } = useAuth();
  const [reason, setReason] = useState<ReportReason | ''>('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!reason) { toast.error('Please select a reason'); return; }
    if (!description.trim()) { toast.error('Please describe the issue'); return; }
    if (!currentUser || !userProfile) { toast.error('You must be logged in'); return; }

    setSubmitting(true);
    try {
      await reportService.createReport({
        reporterId: currentUser.uid,
        reporterName: `${userProfile.firstName} ${userProfile.lastName}`,
        targetType,
        targetId,
        targetName,
        reason: reason as ReportReason,
        description: description.trim(),
      });
      toast.success('Report submitted. Thank you for helping keep DroidBRB safe.');
      setReason('');
      setDescription('');
      onClose();
    } catch {
      toast.error('Failed to submit report');
    } finally {
      setSubmitting(false);
    }
  };

  const typeLabel = targetType === ReportType.ROBOT ? 'robot' : targetType === ReportType.USER ? 'user' : 'message';

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 9999,
      display: "flex", alignItems: "center", justifyContent: "center",
      background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)",
    }} onClick={onClose}>
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: C.pureWhite, borderRadius: 16, padding: 32,
          width: "100%", maxWidth: 480, margin: 16,
          boxShadow: "0 24px 80px rgba(0,0,0,0.2)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#fef2f2", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Flag size={16} color="#ef4444" />
            </div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 600 }}>Report {typeLabel}</div>
              <div style={{ fontSize: 13, color: C.gray400 }}>{targetName}</div>
            </div>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", padding: 4, color: C.gray400 }}>
            <X size={20} />
          </button>
        </div>

        <div style={{ marginBottom: 20 }}>
          <label style={{ fontSize: 13, fontWeight: 500, color: C.gray500, display: "block", marginBottom: 8 }}>Reason</label>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {Object.entries(reasonLabels).map(([key, label]) => (
              <label key={key} style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "10px 14px", borderRadius: 8, cursor: "pointer",
                border: `1px solid ${reason === key ? C.blue : C.gray200}`,
                background: reason === key ? C.blueMuted : "transparent",
                transition: "all 0.15s",
              }}>
                <input
                  type="radio" name="reason" value={key}
                  checked={reason === key}
                  onChange={() => setReason(key as ReportReason)}
                  style={{ accentColor: C.blue }}
                />
                <span style={{ fontSize: 14, color: reason === key ? C.blue : C.gray700, fontWeight: reason === key ? 500 : 400 }}>{label}</span>
              </label>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: 24 }}>
          <label style={{ fontSize: 13, fontWeight: 500, color: C.gray500, display: "block", marginBottom: 8 }}>Description</label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Please describe the issue in detail..."
            rows={3}
            style={{
              width: "100%", padding: "10px 14px", borderRadius: 8,
              border: `1px solid ${C.gray200}`, fontSize: 14, fontFamily: "inherit",
              resize: "vertical", outline: "none", boxSizing: "border-box",
            }}
            onFocus={e => e.target.style.borderColor = C.blue}
            onBlur={e => e.target.style.borderColor = C.gray200}
          />
        </div>

        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <button onClick={onClose} style={{
            padding: "10px 20px", borderRadius: 100, fontSize: 14, fontWeight: 500,
            background: "transparent", color: C.gray500, border: `1px solid ${C.gray200}`,
            cursor: "pointer", fontFamily: "inherit",
          }}>Cancel</button>
          <button onClick={handleSubmit} disabled={submitting} style={{
            padding: "10px 20px", borderRadius: 100, fontSize: 14, fontWeight: 500,
            background: submitting ? C.gray300 : "#ef4444", color: C.pureWhite,
            border: "none", cursor: submitting ? "not-allowed" : "pointer", fontFamily: "inherit",
          }}>{submitting ? 'Submitting...' : 'Submit Report'}</button>
        </div>
      </div>
    </div>
  );
};

export default ReportModal;
