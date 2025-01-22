import { FC, ReactNode, createContext, useState, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate, useLocation } from "react-router-dom";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "./ui/sheet";
import { Button } from "./ui/button";
import { cn } from "../lib/utils";

// Add CSS styles


// Add CSS classes for hover effects
const cssStyles = `
  .button-warning:hover {
    background-color: #D97706 !important;
  }
`;

interface UIContextProps {
  notify: (type: string, content: string, options?: {}, promiseOptions?: {}) => void;
}

interface UIProviderProps {
  children: ReactNode;
}

const menuItems = [
  { label: "Start Game", path: "/startGame" },
  { label: "Rankings", path: "/ranking" },
  { label: "Results", path: "/results" },
  { label: "Add Player", path: "/addplayer" },
  { label: "Party Page", path: "/partypage" },
];

const UIContext = createContext<UIContextProps | undefined>(undefined);

const UIProvider: FC<UIProviderProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (location.pathname === '/startGame') {
      setIsMenuOpen(false);
    }
  }, [location]);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.classList.add('no-scroll');
    } else {
      document.body.classList.remove('no-scroll');
    }

    return () => {
      document.body.classList.remove('no-scroll');
    };
  }, [isMenuOpen]);

  const notify = (type: string, content: string, options?: {}) => {
    const toastOptions = { ...options };
    if (type === 'success') return toast.success(content, toastOptions);
    if (type === 'error') return toast.error(content, toastOptions);
    if (type === 'loading') return toast.loading(content, toastOptions);
    return toast.custom(content, toastOptions);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsMenuOpen(false);
  };

  return (
    <UIContext.Provider value={{ notify }}>
      <style>{cssStyles}</style>
      <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
        <Button
          onClick={() => setIsMenuOpen(true)}
          className={cn(
            "fixed top-4 right-4 z-50",
            "bg-slate-900/90 hover:bg-slate-800/90",
            "text-amber-400 hover:text-amber-300",
            "font-['DS-DIGI'] text-xl",
            "h-12 px-6",
            "rounded-lg",
            "backdrop-blur-sm border border-amber-400/20",
            "shadow-[0_0_15px_-3px_rgba(245,158,11,0.1)]",
            "transition-all duration-300"
          )}
        >
          Menu
        </Button>
        <SheetContent
          side="top"
          className={cn(
            "w-screen h-screen",
            "bg-slate-950/95",
            "backdrop-blur-md",
            "border-b border-amber-400/10",
            "shadow-[0_10px_40px_-15px_rgba(245,158,11,0.2)]",
            "flex flex-col items-center justify-center"
          )}
        >
          <SheetHeader className="p-4 text-center mb-6">
            <SheetTitle className={cn(
              "font-['DS-DIGI'] text-6xl",
              "tracking-[0.2em]",
              "text-amber-400",
              "drop-shadow-[0_0_10px_rgba(245,158,11,0.3)]"
            )}>
              MENU
            </SheetTitle>
          </SheetHeader>
          <div className="flex flex-col items-center w-full max-w-3xl px-4 py-2 space-y-3">
            {menuItems.map((item) => (
              <Button
                key={item.path}
                variant="ghost"
                className={cn(
                  "w-full font-['DS-DIGI']",
                  "text-3xl text-amber-400/90",
                  "py-6",
                  "bg-gradient-to-r from-slate-900/90 via-slate-800/90 to-slate-900/90",
                  "hover:bg-gradient-to-r hover:from-amber-500/10 hover:via-amber-500/5 hover:to-amber-500/10",
                  "border-y border-amber-400/10",
                  "transition-all duration-500",
                  "rounded-lg",
                  "relative group overflow-hidden",
                  "shadow-[0_4px_12px_-2px_rgba(0,0,0,0.3)]",
                  "hover:shadow-[0_8px_20px_-4px_rgba(245,158,11,0.15)]",
                  "hover:scale-[1.02]"
                )}
                onClick={() => handleNavigation(item.path)}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-amber-400/0 via-amber-400/5 to-amber-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <span className="relative z-10 group-hover:translate-x-1 transition-transform duration-500 flex items-center justify-center gap-2">
                  {item.label}
                </span>
              </Button>
            ))}
          </div>
          <div className="absolute bottom-8 left-0 right-0 text-center">
            <span className="text-amber-400/40 font-['DS-DIGI'] text-sm tracking-widest">
              Poker Tour IRL
            </span>
          </div>
        </SheetContent>
      </Sheet>
      <Toaster
        toastOptions={{
          duration: 4000,
          position: 'bottom-right',
          style: {
            background: '#0f172a',
            color: '#fbbf24',
            border: '1px solid rgba(245,158,11,0.1)',
            boxShadow: '0 4px 12px -2px rgba(0,0,0,0.3)',
            fontFamily: 'DS-DIGI'
          }
        }}
      />
      {children}
    </UIContext.Provider>
  );
};

export { UIContext, UIProvider };