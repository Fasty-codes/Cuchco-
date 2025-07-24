import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [showAvatarModal, setShowAvatarModal] = useState(false);
    const [pendingUser, setPendingUser] = useState(null);

    useEffect(() => {
        // Check for logged in user in localStorage on initial load
        const storedUser = localStorage.getItem('cubeCrazeUser');
        if (storedUser) {
            const userObj = JSON.parse(storedUser);
            setUser(userObj);
            if (!userObj.avatar) {
                setPendingUser(userObj);
                setShowAvatarModal(true);
            }
        }
    }, []);

    const login = (username, password) => {
        const users = JSON.parse(localStorage.getItem('cubeCrazeUsers')) || [];
        const foundUser = users.find(u => u.username === username && u.password === password);

        if (foundUser) {
            setUser(foundUser);
            localStorage.setItem('cubeCrazeUser', JSON.stringify(foundUser));
            if (!foundUser.avatar) {
                setPendingUser(foundUser);
                setShowAvatarModal(true);
            }
        } else {
            throw new Error('Invalid username or password');
        }
    };

    const signup = (username, password) => {
        const users = JSON.parse(localStorage.getItem('cubeCrazeUsers')) || [];
        if (users.some(u => u.username === username)) {
            throw new Error('Username already exists');
        }

        const newUser = { username, password, avatar: null, region: null };
        const newUsers = [...users, newUser];

        localStorage.setItem('cubeCrazeUsers', JSON.stringify(newUsers));
        setUser(newUser);
        localStorage.setItem('cubeCrazeUser', JSON.stringify(newUser));
        setPendingUser(newUser);
        setShowAvatarModal(true);
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('cubeCrazeUser');
    };

    const updateUserProfile = (profileData) => {
        if (!user) return;

        const updatedUser = { ...user, ...profileData };
        setUser(updatedUser);
        localStorage.setItem('cubeCrazeUser', JSON.stringify(updatedUser));

        // Also update the user in the main user list
        const users = JSON.parse(localStorage.getItem('cubeCrazeUsers')) || [];
        const userIndex = users.findIndex(u => u.username === user.username);
        if (userIndex !== -1) {
            users[userIndex] = updatedUser;
            localStorage.setItem('cubeCrazeUsers', JSON.stringify(users));
        }
    };

    const value = { user, login, signup, logout, updateUserProfile, showAvatarModal, setShowAvatarModal, pendingUser, setPendingUser };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}; 