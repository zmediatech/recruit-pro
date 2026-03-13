import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');

    useEffect(() => {
        // Initial sync from backend if possible
        const syncTheme = async () => {
            try {
                // Use the public info endpoint so it works for candidates too
                const res = await axios.get('http://localhost:5001/api/admin/system-info');
                if (res.data.success && res.data.theme) {
                    setTheme(res.data.theme);
                }
            } catch (err) {
                console.warn("Theme sync failed, using local value.");
            }
        };
        syncTheme();
    }, []);

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    const setThemeMode = async (newTheme) => {
        setTheme(newTheme);
        // If admin is logged in, we try to save to backend
        const token = localStorage.getItem('adminToken');
        if (token) {
            try {
                await axios.post('http://localhost:5001/api/admin/system-settings', { theme: newTheme }, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            } catch (err) {
                console.error("Failed to save theme to backend:", err);
            }
        }
    };

    return (
        <ThemeContext.Provider value={{ theme, setThemeMode }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);
