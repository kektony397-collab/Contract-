import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  icon?: string;
}

const createRipple = (event: React.MouseEvent<HTMLButtonElement>) => {
    const button = event.currentTarget;
    const circle = document.createElement("span");
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;

    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${event.clientX - button.offsetLeft - radius}px`;
    circle.style.top = `${event.clientY - button.offsetTop - radius}px`;
    circle.classList.add("ripple");

    const ripple = button.getElementsByClassName("ripple")[0];

    if (ripple) {
        ripple.remove();
    }

    button.appendChild(circle);
};

export const Button: React.FC<ButtonProps> = ({ children, icon, ...props }) => {
  const handleMouseDown = (event: React.MouseEvent<HTMLButtonElement>) => {
    createRipple(event);
    if (props.onMouseDown) {
      props.onMouseDown(event);
    }
  };

  return (
    <button
      {...props}
      onMouseDown={handleMouseDown}
      className="relative overflow-hidden flex items-center justify-center gap-2 h-12 px-6 rounded-full bg-[--primary] text-[--on-primary] font-medium text-lg shadow-[var(--elevation-1)] hover:shadow-[var(--elevation-2)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[--primary] transition-all duration-[var(--md-sys-transition-duration)] ease-[var(--md-sys-transition-easing)]"
    >
      {icon && <span className="material-symbols-outlined">{icon}</span>}
      {children}
    </button>
  );
};
