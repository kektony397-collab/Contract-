import React from 'react';

interface InputGroupProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
}

export const InputGroup: React.FC<InputGroupProps> = ({ id, label, ...props }) => (
    <div className="relative group">
        <input
            id={id}
            name={id}
            className="peer w-full h-14 px-4 pt-6 bg-black/5 dark:bg-white/5 rounded-t-lg border-b-2 border-[--outline] text-[--on-surface] focus:outline-none focus:border-[--primary] transition-colors placeholder-transparent"
            placeholder={label}
            {...props}
        />
        <label
            htmlFor={id}
            className="absolute left-4 top-4 text-[--on-surface-variant] transition-all duration-200 group-focus-within:top-2 group-focus-within:text-xs group-focus-within:text-[--primary] peer-focus:top-2 peer-focus:text-xs peer-focus:text-[--primary] peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:text-xs peer-valid:top-2 peer-valid:text-xs"
        >
            {label}
        </label>
    </div>
);
