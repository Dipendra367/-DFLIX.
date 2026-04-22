import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-[#0a0a0a] py-8 px-4 lg:px-10 border-t border-white/10">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Logo */}
        <div className="dflix-logo opacity-80 scale-50 -ml-6 md:ml-0 md:scale-75 origin-left">
          DFLIX
        </div>
        
        {/* Credits */}
        <p className="text-gray-400 font-medium text-sm text-center md:-ml-8">
          Made with ❤️ by <span className="text-white font-bold">Dipendra Thapa</span>
        </p>

        {/* Empty space to balance the logo flex-between layout */}
        <div className="hidden md:block"></div>
      </div>
    </footer>
  );
};

export default Footer;
