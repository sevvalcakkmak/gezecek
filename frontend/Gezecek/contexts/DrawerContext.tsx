import React from 'react';

type DrawerContextType = {
    activeKey: string | null;
    setActiveKey: (key: string) => void;
    isOpen: boolean;
    setIsOpen: (v: boolean) => void;
    toggle: () => void;
};

const DrawerContext = React.createContext<DrawerContextType | undefined>(undefined);

export const DrawerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [activeKey, setActiveKey] = React.useState<string | null>(null);
    const [isOpen, setIsOpen] = React.useState<boolean>(false);

    const toggle = React.useCallback(() => setIsOpen(v => !v), []);

    return (
        <DrawerContext.Provider value={{ activeKey, setActiveKey, isOpen, setIsOpen, toggle }}>
            {children}
        </DrawerContext.Provider>
    );
};

export function useDrawer() {
    const ctx = React.useContext(DrawerContext);
    if (!ctx) throw new Error('useDrawer must be used within DrawerProvider');
    return ctx;
}