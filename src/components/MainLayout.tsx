import React, { ReactNode } from 'react';

interface MainLayoutProps {
  children: ReactNode;
  header: ReactNode;
  footer?: ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children, header, footer }) => {
  return (
    <div className="flex flex-col h-screen bg-gray-50 overflow-hidden">
      <header className="flex-none border-b border-gray-200 bg-white shadow-sm z-10">
        {header}
      </header>
      
      <main className="flex-1 overflow-hidden relative">
        {children}
      </main>
      
      {footer && (
        <footer className="flex-none border-t border-gray-200 bg-gray-100 text-xs px-4 py-1">
          {footer}
        </footer>
      )}
    </div>
  );
};
