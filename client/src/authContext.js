import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
}

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    const signUp = async (username, email, password, role) => {
        try {
            const response = await axios.post('http://localhost:3001/signup', { username, email, password, role });
            setUser(response.data);
            return response.data;
        } catch (error) {
            console.error('Failed to sign up:', error);
            return null;
        }
    };

    const signIn = async (username, password) => {
        try {
            const response = await axios.post('http://localhost:3001/signin', { username, password });
            setUser(response.data);
            return response.data;
        } catch (error) {
            console.error('Failed to sign in:', error);
            return null;
        }
    };

    const signOut = async () => {
        await axios.post('http://localhost:3001/signout');
        setUser(null);
    };

    const value = {
        user,
        signUp,
        signIn,
        signOut
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}
