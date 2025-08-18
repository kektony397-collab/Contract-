import React, { useState } from 'react';
import { ContractData, ProfileData } from '../types';
import { Button } from './Button';
import { InputGroup } from './InputGroup';
import { calculateFare } from '../services/fareCalculator';

interface ContractFormProps {
  riderProfile: ProfileData;
  onGenerate: (data: ContractData) => void;
  showToast: (message: string, type?: 'success' | 'error') => void;
}

export const ContractForm: React.FC<ContractFormProps> = ({ riderProfile, onGenerate, showToast }) => {
  const [inputs, setInputs] = useState({
    customerName: '',
    pickupLocation: '',
    dropLocation: '',
    dailyDistance: '',
    dailyDuration: '',
    startDate: '',
    endDate: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInputs((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!riderProfile.name) {
        showToast("Please save the Rider Profile first.", "error");
        return;
    }

    const startDate = new Date(inputs.startDate);
    const endDate = new Date(inputs.endDate);
    if (startDate >= endDate) {
        showToast("End date must be after the start date.", "error");
        return;
    }
    
    const timeDiff = endDate.getTime() - startDate.getTime();
    const numberOfDays = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1;

    const dailyDistanceNum = parseFloat(inputs.dailyDistance);
    const dailyDurationNum = parseInt(inputs.dailyDuration, 10);
    
    // Using simplified fare calculation for contract
    const dailyFare = calculateFare({
        distance: dailyDistanceNum,
        duration: dailyDurationNum,
        pickup: 0, // Assuming no extra pickup for daily contract
        wait: 0, // Assuming no extra wait for daily contract
        isNight: false, // Can be an option later
    });

    const totalFare = dailyFare * numberOfDays;

    onGenerate({
        ...inputs,
        dailyDistance: dailyDistanceNum,
        dailyDuration: dailyDurationNum,
        totalFare,
        riderProfile,
        numberOfDays,
    });
  };

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-medium text-[--on-surface-variant] mb-4">Create Ride Contract</h2>
      <form onSubmit={handleSubmit} className="p-6 bg-[--surface-container] rounded-2xl shadow-[var(--elevation-1)]">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <InputGroup id="customerName" name="customerName" label="Customer Name" type="text" value={inputs.customerName} onChange={handleChange} required />
          <InputGroup id="pickupLocation" name="pickupLocation" label="Pickup Location" type="text" value={inputs.pickupLocation} onChange={handleChange} required />
          <InputGroup id="dropLocation" name="dropLocation" label="Drop Location" type="text" value={inputs.dropLocation} onChange={handleChange} required />
          <InputGroup id="dailyDistance" name="dailyDistance" label="Daily Distance (km)" type="number" value={inputs.dailyDistance} onChange={handleChange} step="0.1" min="0" required />
          <InputGroup id="dailyDuration" name="dailyDuration" label="Daily Duration (min)" type="number" value={inputs.dailyDuration} onChange={handleChange} step="1" min="0" required />
          <div className="sm:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <InputGroup id="startDate" name="startDate" label="Start Date" type="date" value={inputs.startDate} onChange={handleChange} required />
            <InputGroup id="endDate" name="endDate" label="End Date" type="date" value={inputs.endDate} onChange={handleChange} required />
          </div>
        </div>
        <div className="mt-8 flex justify-center">
            <Button type="submit" icon="request_quote">Generate Contract</Button>
        </div>
      </form>
    </div>
  );
};
