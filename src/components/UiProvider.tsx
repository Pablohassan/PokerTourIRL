import { FC, ReactNode, createContext, useState, useEffect } from 'react';
import { Button, NextUIProvider } from '@nextui-org/react';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate, useLocation } from "react-router-dom";
import Menu from './Menu';

interface UIContextProps {
  notify: (type: string, content: string, options?: {}, promiseOptions?: {}) => void;
}

interface UIProviderProps {
  children: ReactNode;
}

const UIContext = createContext<UIContextProps | undefined>(undefined);

const UIProvider: FC<UIProviderProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    // Fermer le menu automatiquement si l'utilisateur est sur la page StartGame
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

    if (type === 'success') {
      return toast.success(content, toastOptions);
    }

    if (type === 'error') {
      return toast.error(content, toastOptions);
    }

    if (type === 'loading') {
      return toast.loading(content, toastOptions);
    }

    return toast.custom(content, toastOptions);
  };

  const handleNavigate = (path: string) => {
    navigate(path);
    setIsMenuOpen(false); // Fermer le menu après navigation
  };

  return (
    <UIContext.Provider value={{ notify }}>
      <NextUIProvider>
        {isMenuOpen && location.pathname !== '/startGame' && (
          <>
            <div className="overlay" onClick={() => setIsMenuOpen(false)}></div>
            <Menu handleNavigate={handleNavigate} setIsMenuOpen={setIsMenuOpen} />
          </>
        )}
        <Button
          color='warning'
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          style={{
            position: 'fixed',
            top: '10px',
            right: '100px',
            zIndex: 1000
          }}
        >
          Menu
        </Button>
        <Toaster
          toastOptions={{
            duration: 4000,
            position: 'bottom-right',
            style: {
              padding: '20px 24px',
              background: 'black',
              color: 'white'
            }
          }}
        />
        {children}
      </NextUIProvider>
    </UIContext.Provider>
  );
};

export { UIContext, UIProvider };