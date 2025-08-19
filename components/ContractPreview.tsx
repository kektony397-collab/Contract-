
import React from 'react';
import { ContractRecord } from '../types';
import { Button } from './Button';
import { IconButton } from './IconButton';

interface ContractPreviewProps {
  contractData: ContractRecord;
  onDownload: () => void;
  onClose: () => void;
}

const DetailItem: React.FC<{ label: string; value?: string | number }> = ({ label, value }) => (
  value ? <p><strong className="font-medium">{label}:</strong> {value}</p> : null
);

export const ContractPreview: React.FC<ContractPreviewProps> = ({ contractData, onDownload, onClose }) => {
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
        
        <div className="p-8 overflow-y-auto" id="contract-content">
          <h1 className="text-4xl font-bold text-center mb-8 text-[--on-surface]">Private Hire Vehicle Agreement</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-[--on-surface]">
            <section>
              <h3 className="text-xl font-semibold border-b-2 border-[--primary] pb-2 mb-4">Rider Details</h3>
              <DetailItem label="Name" value={contractData.riderProfile.name} />
              <DetailItem label="License No." value={contractData.riderProfile.licenseNumber} />
              <DetailItem label="Rapido ID" value={contractData.riderProfile.rapidoId} />
              <DetailItem label="Uber ID" value={contractData.riderProfile.uberId} />
              <DetailItem label="Ola ID" value={contractData.riderProfile.olaId} />
            </section>
            <section>
              <h3 className="text-xl font-semibold border-b-2 border-[--primary] pb-2 mb-4">Customer Details</h3>
              <DetailItem label="Name" value={contractData.customerName} />
              <DetailItem label="Pickup Location" value={contractData.pickupLocation} />
              <DetailItem label="Drop Location" value={contractData.dropLocation} />
            </section>
          </div>

          <section className="mt-8">
            <h3 className="text-xl font-semibold border-b-2 border-[--primary] pb-2 mb-4">Contract Details</h3>
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
            <h3 className="text-xl font-semibold mb-2">Total Amount</h3>
            <p className="text-4xl font-bold">₹{contractData.totalFare.toFixed(2)}</p>
          </section>

          <section className="mt-8">
             <h3 className="text-xl font-semibold border-b-2 border-[--primary] pb-2 mb-4">Terms and Conditions</h3>
             <div className="space-y-4 text-sm text-[--on-surface-variant]">
                <div>
                    <p className="font-medium text-[--on-surface]">1. Service Availability: The ride may be cancelled if the Rider's vehicle is non-operational due to mechanical breakdown or scheduled maintenance. The Rider shall provide advance notice where possible.</p>
                </div>
                <div>
                    <p className="font-medium text-[--on-surface]">2. Professional Conduct: The Rider shall maintain a professional and respectful demeanor toward the Customer at all times.</p>
                </div>
                <div>
                    <p className="font-medium text-[--on-surface]">3. Termination Clause: The Customer may terminate this Agreement by providing a written notice of ten (10) days. Upon such termination, the Rider shall refund the pro-rated amount for the remainder of the contract term.</p>
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
