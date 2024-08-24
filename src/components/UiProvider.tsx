import {FC, ReactNode, createContext} from 'react';
import {NextUIProvider} from '@nextui-org/react';
import toast, {Toaster} from 'react-hot-toast';

// import { useMediaQuery } from "react-responsive";
interface UIContextProps {
  notify: (type: string, content: string, options?: {}, promiseOptions?: {}) => void;
}

interface UIProviderProps {
  children: ReactNode;
}
interface UIContextProps {
  notify: (type: string, content: string, options?: {}, promiseOptions?: {}) => void;
  }


  const UIContext = createContext<UIContextProps | undefined>(undefined);

  const UIProvider: FC<UIProviderProps> = ({ children }) => {
  
    const notify = (type: string, content:string, options?: {}, promiseOptions?: {}) => {
      const toastOptions = {...options};
  
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
  
    return (
      <UIContext.Provider value={{ notify }}>
        <NextUIProvider>
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