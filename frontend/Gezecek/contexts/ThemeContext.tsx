import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type ThemeType = 'light' | 'dark';
export type ResolvedThemeType = 'light' | 'dark';

interface ThemeContextType {
    theme: ThemeType;
    resolvedTheme: ResolvedThemeType;
    setTheme: (theme: ThemeType) => Promise<void>;
    isReady: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = 'app-theme';
const supportedThemes: ThemeType[] = ['light', 'dark'];

const isValidTheme = (theme: string): theme is ThemeType =>
    supportedThemes.includes(theme as ThemeType); export const useTheme = () => {
        const context = useContext(ThemeContext);
        if (context === undefined) {
            throw new Error('useTheme must be used within a ThemeProvider');
        }
        return context;
    };

interface ThemeProviderProps {
    children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
    const [theme, setThemeState] = useState<ThemeType>('light');
    const [isReady, setIsReady] = useState(false);

    // Resolve the actual theme (no system mode anymore)
    const resolvedTheme: ResolvedThemeType = theme;    // Load saved theme from storage
    useEffect(() => {
        const loadTheme = async () => {
            try {
                const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
                if (savedTheme && isValidTheme(savedTheme)) {
                    setThemeState(savedTheme);
                } else {
                    // Default to light if no saved theme or invalid theme
                    setThemeState('light');
                }
            } catch (error) {
                console.log('Theme loading error:', error);
                setThemeState('light');
            } finally {
                setIsReady(true);
            }
        };

        loadTheme();
    }, []);

    // Function to update theme and save to storage
    const setTheme = async (newTheme: ThemeType) => {
        if (!isValidTheme(newTheme)) return;

        try {
            await AsyncStorage.setItem(THEME_STORAGE_KEY, newTheme);
            setThemeState(newTheme);
        } catch (error) {
            console.log('Theme saving error:', error);
        }
    };

    const value: ThemeContextType = {
        theme,
        resolvedTheme,
        setTheme,
        isReady,
    };

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
};

export default ThemeContext;