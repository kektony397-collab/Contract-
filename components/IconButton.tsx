import React from 'react';

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

const createRipple = (event: React.MouseEvent<HTMLButtonElement>) => {
    const button = event.currentTarget;
    const circle = document.createElement("span");
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;

    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${event.clientX - button.offsetLeft - radius}px`;
    circle.style.top = `${event.clientY - button.offsetTop - radius}px`;
    circle.classList.add("ripple-icon");

    const ripple = button.getElementsByClassName("ripple-icon")[0];

    if (ripple) {
        ripple.remove();
    }

    button.appendChild(circle);
};

export const IconButton: React.FC<IconButtonProps> = ({ children, ...props }) => {
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
      className="relative overflow-hidden w-12 h-12 flex items-center justify-center rounded-full text-[--on-surface] hover:bg-[--surface-variant] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[--primary] transition-all duration-[var(--md-sys-transition-duration)] ease-[var(--md-sys-transition-easing)]"
    >
      {children}
    </button>
  );
};
