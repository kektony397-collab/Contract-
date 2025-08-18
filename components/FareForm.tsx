import React, { useState } from 'react';
import { FareInput } from '../types';
import { Button } from './Button';
import { InputGroup } from './InputGroup';


interface FareFormProps {
  onCalculate: (data: FareInput) => Promise<boolean>;
}

export const FareForm: React.FC<FareFormProps> = ({ onCalculate }) => {
  const [inputs, setInputs] = useState({
    distance: '',
    duration: '',
    pickup: '',
    wait: '',
    isNight: 'No',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setInputs((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await onCalculate({
      distance: parseFloat(inputs.distance),
      duration: parseInt(inputs.duration, 10),
      pickup: parseFloat(inputs.pickup),
      wait: parseInt(inputs.wait, 10),
      isNight: inputs.isNight === 'Yes',
    });

    if (success) {
      setInputs({
        distance: '',
        duration: '',
        pickup: '',
        wait: '',
        isNight: 'No',
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 bg-[--surface-container] rounded-2xl shadow-[var(--elevation-1)]">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <InputGroup id="distance" label="Distance (km)" type="number" value={inputs.distance} onChange={handleChange} step="0.1" min="0" required />
            <InputGroup id="duration" label="Duration (min)" type="number" value={inputs.duration} onChange={handleChange} step="1" min="0" required />
            <InputGroup id="pickup" label="Pickup Distance (km)" type="number" value={inputs.pickup} onChange={handleChange} step="0.1" min="0" required />
            <InputGroup id="wait" label="Wait Time (min)" type="number" value={inputs.wait} onChange={handleChange} step="1" min="0" required />
            <div className="relative sm:col-span-2 group">
                 <select
                    id="isNight"
                    name="isNight"
                    value={inputs.isNight}
                    onChange={handleChange}
                    className="w-full h-14 px-4 pt-2 bg-black/5 dark:bg-white/5 rounded-t-lg border-b-2 border-[--outline] text-[--on-surface] focus:outline-none focus:border-[--primary] appearance-none"
                >
                    <option value="No">Night Fare: No</option>
                    <option value="Yes">Night Fare: Yes</option>
                </select>
                <label htmlFor="isNight" className="absolute left-4 top-2 text-xs text-[--on-surface-variant]">Night Fare</label>
                <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[--on-surface-variant]">arrow_drop_down</span>
            </div>
        </div>
        <div className="mt-8 flex justify-center">
            <Button type="submit" icon="calculate">Calculate</Button>
        </div>
    </form>
  );
};