import {createContext} from 'react';
import {NextUIProvider} from '@nextui-org/react';
import toast, {Toaster} from 'react-hot-toast';
// import { useMediaQuery } from "react-responsive";

export const UIContext = createContext();

const toastDefaultOptions = {duration: 4000, position: 'bottom-right'};

function UIProvider({children}) {
  // const isMobile = useMediaQuery({ maxWidth: 620 });
  const notify = (type, content, options = {}, promiseOptions = {}) => {
    const toastOptions = {...toastDefaultOptions, ...options};

    if (type === 'success') {
      return toast.success(content, toastOptions);
    }

    if (type === 'error') {
      return toast.error(content, toastOptions);
    }

    if (type === 'loading') {
      return toast.loading(content, toastOptions);
    }

    if (type === 'promise') {
      return toast.promise(content, promiseOptions, toastOptions);
    }

    return toast.custom(content, toastOptions);
  };

  const getContextValue = () => ({
    notify
    // isMobile,
  });

  return (
    <UIContext.Provider value={getContextValue()}>
      <NextUIProvider>
        <Toaster
          toastOptions={{
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
}

export default UIProvider;