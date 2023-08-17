import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { createContext } from 'react';
import { NextUIProvider } from '@nextui-org/react';
import toast, { Toaster } from 'react-hot-toast';
const UIContext = createContext(undefined);
const UIProvider = ({ children }) => {
    const notify = (type, content, options, promiseOptions) => {
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
    return (_jsx(UIContext.Provider, { value: { notify }, children: _jsxs(NextUIProvider, { children: [_jsx(Toaster, { toastOptions: {
                        duration: 4000,
                        position: 'bottom-right',
                        style: {
                            padding: '20px 24px',
                            background: 'black',
                            color: 'white'
                        }
                    } }), children] }) }));
};
export { UIContext, UIProvider };
//# sourceMappingURL=UiProvider.js.map