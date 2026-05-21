import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

const Button = ({ children, className, ...props }: ButtonProps) => {
  return (
    <button
      className={`px-8 py-3 rounded-full font-bold text-white bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 transition-all duration-300 ease-in-out ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
