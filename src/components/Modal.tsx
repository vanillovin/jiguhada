import React, { useEffect, useRef } from 'react';

export default function Modal({
  className,
  children,
  isOpen,
  isClickFilterBtn,
}: {
  className: string;
  children: React.ReactNode;
  isOpen: boolean;
  isClickFilterBtn(): void;
}) {
  const modalRef = useRef() as React.RefObject<HTMLDivElement>;

  const handleClickOutside = (event: any) => {
    if (isOpen && !modalRef.current?.contains(event.target)) {
      isClickFilterBtn();
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return isOpen ? (
    <div className={className} ref={modalRef}>
      {children}
    </div>
  ) : null;
}
