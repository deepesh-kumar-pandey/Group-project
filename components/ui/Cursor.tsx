'use client';

import { useState, useEffect } from 'react';

const Cursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const onMouseOver = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest('a, button')) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', onMouseMove);
    document.body.addEventListener('mouseover', onMouseOver);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.body.removeEventListener('mouseover', onMouseOver);
    };
  }, []);

  return (
    <div
      className={`fixed z-[9999] pointer-events-none transition-transform duration-300 ease-out ${isHovering ? 'scale-150' : ''}`}
      style={{ left: `${position.x}px`, top: `${position.y}px` }}
    >
      <div className="w-4 h-4 rounded-full bg-cyan-400" />
    </div>
  );
};

export default Cursor;
