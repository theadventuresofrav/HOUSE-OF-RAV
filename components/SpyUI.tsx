import React from 'react';

// --- Types ---
interface CardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  delay?: number; // for staggered animation
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
}

// --- Components ---

export const SpyCard: React.FC<CardProps> = ({ title, subtitle, children, onClick, className = "", delay = 0 }) => {
  return (
    <div 
      onClick={onClick}
      className={`
        relative group cursor-pointer 
        bg-[#0C0C0F]/90 border border-[#D4AF37]/30 
        p-6 overflow-hidden transition-all duration-500
        hover:border-[#D4AF37] hover:scale-[1.02] gold-glow-hover
        flex flex-col
        ${className}
      `}
      style={{
        animation: `fadeInUp 0.6s ease-out ${delay}s backwards`
      }}
    >
      {/* Corner Accents */}
      <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[#D4AF37] opacity-50 group-hover:opacity-100 transition-opacity" />
      <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-[#D4AF37] opacity-50 group-hover:opacity-100 transition-opacity" />
      <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-[#D4AF37] opacity-50 group-hover:opacity-100 transition-opacity" />
      <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-[#D4AF37] opacity-50 group-hover:opacity-100 transition-opacity" />

      {/* Header */}
      <div className="mb-4 border-b border-[#D4AF37]/20 pb-2">
        <h3 className="text-sm font-mono tracking-widest text-[#D4AF37] uppercase opacity-80">{title}</h3>
        {subtitle && <p className="text-xs text-gray-400 mt-1 font-mono">{subtitle}</p>}
      </div>

      {/* Content */}
      <div className="flex-grow">
        {children}
      </div>
      
      {/* Scan line effect on hover */}
      <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-10 bg-gradient-to-b from-transparent via-[#D4AF37]/5 to-transparent -translate-y-full group-hover:translate-y-full transition-transform duration-1000 ease-in-out" />
    </div>
  );
};

export const SpyModal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl bg-[#0F0F12] border border-[#D4AF37] p-8 shadow-[0_0_50px_rgba(212,175,55,0.15)] animate-in fade-in zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto custom-scrollbar">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-[#D4AF37] hover:text-white font-mono text-xl"
        >
          [X]
        </button>
        <h2 className="text-2xl font-serif text-[#D4AF37] mb-6 tracking-wide border-b border-[#D4AF37]/30 pb-4">
          {title}
        </h2>
        <div className="text-gray-300 space-y-4 font-light leading-relaxed">
          {children}
        </div>
      </div>
    </div>
  );
};

export const SpyButton: React.FC<ButtonProps> = ({ children, variant = 'primary', className = '', ...props }) => {
  const baseStyles = "px-6 py-3 font-mono text-sm tracking-widest uppercase transition-all duration-300 relative overflow-hidden group";
  
  const variants = {
    primary: "bg-[#D4AF37]/10 border border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black",
    secondary: "border border-gray-600 text-gray-400 hover:border-gray-400 hover:text-gray-200",
    danger: "border border-red-900/50 text-red-500 hover:bg-red-900/20"
  };

  return (
    <button className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
      <span className="relative z-10">{children}</span>
    </button>
  );
};

// Global Animation Styles Injection
export const AnimationStyles = () => (
  <style>{`
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `}</style>
);
