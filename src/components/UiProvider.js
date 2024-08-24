import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { createContext, useState, useEffect } from 'react';
import { Button, NextUIProvider } from '@nextui-org/react';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from "react-router-dom";
import Menu from './Menu';
const UIContext = createContext(undefined);
const UIProvider = ({ children }) => {
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(true);
    useEffect(() => {
        // Fermer le menu automatiquement si l'utilisateur est sur la page StartGame
        if (location.pathname === '/startGame') {
            setIsMenuOpen(false);
        }
    }, [location]);
    useEffect(() => {
        if (isMenuOpen) {
            document.body.classList.add('no-scroll');
        }
        else {
            document.body.classList.remove('no-scroll');
        }
        // Nettoyage lors du démontage du composant
        return () => {
            document.body.classList.remove('no-scroll');
        };
    }, [isMenuOpen]);
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
    const handleNavigate = (path) => {
        navigate(path);
        setIsMenuOpen(false);
    };
    return (_jsx(UIContext.Provider, { value: { notify }, children: _jsxs(NextUIProvider, { children: [isMenuOpen && (_jsxs(_Fragment, { children: [_jsx("div", { className: "overlay", onClick: () => setIsMenuOpen(false) }), " ", _jsx(Menu, { handleNavigate: handleNavigate, setIsMenuOpen: setIsMenuOpen })] })), _jsx(Button, { color: 'warning', onClick: () => setIsMenuOpen(!isMenuOpen), style: {
                        position: 'fixed',
                        top: '10px',
                        right: '100px',
                        zIndex: 1000
                    }, children: "Menu" }), _jsx(Toaster, { toastOptions: {
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