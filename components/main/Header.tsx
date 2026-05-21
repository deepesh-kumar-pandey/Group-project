'use client';

import React from 'react';
import Button from '../ui/Button';

const Header = () => {
  return (
    <header className="fixed top-0 left-0 w-full p-4 flex justify-between items-center z-50">
      <div>
        <h1 className="text-2xl font-bold">Trustpulse</h1>
      </div>
      <nav className="hidden md:flex gap-8">
        <a href="#" className="hover:text-cyan-400 transition-colors">Features</a>
        <a href="#" className="hover:text-cyan-400 transition-colors">Analytics</a>
        <a href="#" className="hover:text-cyan-400 transition-colors">Dashboard</a>
      </nav>
      <div>
        <Button>Sign In</Button>
      </div>
    </header>
  );
};

export default Header;
