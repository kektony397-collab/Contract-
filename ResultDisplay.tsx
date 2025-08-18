import React, { useEffect, useState } from 'react';

interface ResultDisplayProps {
  fare: number | null;
}

export const ResultDisplay: React.FC<ResultDisplayProps> = ({ fare }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (fare !== null) {
      setShow(true);
    } else {
      setShow(false);
    }
  }, [fare]);

  if (fare === null) return null;

  return (
    <div className={`my-8 p-6 text-center bg-[--primary-container] text-[--on-primary-container] rounded-2xl shadow-[var(--elevation-1)] transition-all duration-500 ease-[var(--md-sys-transition-easing)] ${show ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 -translate-y-4'}`}>
        <p className="text-lg">Total Estimated Fare</p>
        <p className="text-5xl font-bold mt-2">₹{fare.toFixed(2)}</p>
    </div>
  );
};