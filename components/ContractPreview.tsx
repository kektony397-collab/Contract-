import React from 'react';
import { ContractData } from '../types';
import { Button } from './Button';
import { IconButton } from './IconButton';

interface ContractPreviewProps {
  contractData: ContractData;
  onDownload: () => void;
  onClose: () => void;
  contractRef: React.RefObject<HTMLDivElement>;
}

const DetailItem: React.FC<{ label: string; value?: string | number }> = ({ label, value }) => (
  value ? <p><strong className="font-medium">{label}:</strong> {value}</p> : null
);

export const ContractPreview: React.FC<ContractPreviewProps> = ({ contractData, onDownload, onClose, contractRef }) => {
  if (!contractData) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center p-4 z-50 overflow-y-auto">
      <div className="relative bg-[--surface] w-full max-w-4xl max-h-[90vh] rounded-2xl shadow-lg flex flex-col">
        <div className="p-6 border-b border-[--outline]">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-[--primary]">Ride Contract Preview</h2>
            <IconButton onClick={onClose} aria-label="Close preview">
                <span className="material-symbols-outlined">close</span>
            </IconButton>
          </div>
        </div>
        
        <div className="p-8 overflow-y-auto" id="contract-content" ref={contractRef}>
          <h1 className="text-4xl font-bold text-center mb-2 text-[--on-surface]">Ride Contract</h1>
          <p className="text-center text-sm text-[--on-surface-variant] mb-8">अनुबंध की सवारी</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-[--on-surface]">
            <section>
              <h3 className="text-xl font-semibold border-b-2 border-[--primary] pb-2 mb-4">Rider Details (राइडर विवरण)</h3>
              <DetailItem label="Name" value={contractData.riderProfile.name} />
              <DetailItem label="License No." value={contractData.riderProfile.licenseNumber} />
              <DetailItem label="Rapido ID" value={contractData.riderProfile.rapidoId} />
              <DetailItem label="Uber ID" value={contractData.riderProfile.uberId} />
              <DetailItem label="Ola ID" value={contractData.riderProfile.olaId} />
            </section>
            <section>
              <h3 className="text-xl font-semibold border-b-2 border-[--primary] pb-2 mb-4">Customer Details (ग्राहक विवरण)</h3>
              <DetailItem label="Name" value={contractData.customerName} />
              <DetailItem label="Pickup Location" value={contractData.pickupLocation} />
              <DetailItem label="Drop Location" value={contractData.dropLocation} />
            </section>
          </div>

          <section className="mt-8">
            <h3 className="text-xl font-semibold border-b-2 border-[--primary] pb-2 mb-4">Contract Details (अनुबंध विवरण)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-[--on-surface]">
              <div>
                <DetailItem label="Start Date" value={new Date(contractData.startDate).toLocaleDateString()} />
                <DetailItem label="End Date" value={new Date(contractData.endDate).toLocaleDateString()} />
                <DetailItem label="Contract Duration" value={`${contractData.numberOfDays} days`} />
              </div>
              <div>
                <DetailItem label="Daily Distance" value={`${contractData.dailyDistance} km`} />
                <DetailItem label="Daily Duration" value={`${contractData.dailyDuration} min`} />
              </div>
            </div>
          </section>

          <section className="mt-8 bg-[--primary-container] text-[--on-primary-container] p-6 rounded-lg text-center">
            <h3 className="text-xl font-semibold mb-2">Total Amount (कुल राशि)</h3>
            <p className="text-4xl font-bold">₹{contractData.totalFare.toFixed(2)}</p>
          </section>

          <section className="mt-8">
             <h3 className="text-xl font-semibold border-b-2 border-[--primary] pb-2 mb-4">Terms and Conditions (नियम और शर्तें)</h3>
             <div className="space-y-4 text-sm text-[--on-surface-variant]">
                <div>
                    <p className="font-medium text-[--on-surface]">1. If the rider's bike breaks down, the ride can be cancelled.</p>
                    <p>१. यदि राइडर की बाइक खराब हो जाती है, तो राइड रद्द की जा सकती है।</p>
                </div>
                <div>
                    <p className="font-medium text-[--on-surface]">2. If the bike has gone for maintenance then also the ride can be cancelled.</p>
                    <p>२. यदि बाइक रखरखाव के लिए गई है, तो भी राइड रद्द की जा सकती है।</p>
                </div>
                <div>
                    <p className="font-medium text-[--on-surface]">3. The rider cannot behave badly with the customer.</p>
                    <p>३. राइडर ग्राहक के साथ बुरा व्यवहार नहीं कर सकता।</p>
                </div>
                <div>
                    <p className="font-medium text-[--on-surface]">4. If the customer wants, they can cancel the contract after 10 days, the rider will have to return the payment accordingly.</p>
                    <p>४. यदि ग्राहक चाहे, तो वह 10 दिनों के बाद अनुबंध रद्द कर सकता है, राइडर को तदनुसार भुगतान वापस करना होगा।</p>
                </div>
             </div>
          </section>

        </div>
        
        <div className="p-6 border-t border-[--outline] flex justify-center">
            <Button onClick={onDownload} icon="download">Download as PDF</Button>
        </div>
      </div>
    </div>
  );
};
