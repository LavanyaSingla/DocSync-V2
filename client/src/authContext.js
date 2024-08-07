import React, { useContext, useState, createContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    const signIn = async (username, password) => {
        try {
            const response = await axios.post('/signin', { username, password });
            setUser(response.data);
            return response.data;
        }
        catch (err) {
            console.log('Failed to sign in', err);
            return null;
        }
    };

    const signOut = async () => {
        await axios.post('/signout');
        setUser(null);
    };

    const value = { user, signIn, signOut };

    return (<AuthContext.Provider value={value}>
        {children}
    </AuthContext.Provider>);
};

