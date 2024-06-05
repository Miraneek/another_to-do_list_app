"use client"
import React, { createContext, useContext, useEffect, useState } from 'react';
import {
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signOut
} from 'firebase/auth';
import {authCorrect} from "@/lib/fireBase/firebase";
import {loginAction, logOutAction} from "@/actions/auth/authActions";
import {useRouter} from "next/navigation";
// User data type interface
interface UserType {
    email: string | null;
    uid: string | null;
    displayName: string | null;
}

// Create auth context
const AuthContext = createContext({});

// Make auth context available across the app by exporting it
export const useAuth = () => useContext<any>(AuthContext);

// Create the auth context provider
export const AuthContextProvider = ({
                                        children
                                    }: {
    children: React.ReactNode;
}) => {
    const router = useRouter()
    // Define the constants for the user and loading state
    const [user, setUser] = useState<UserType>({ email: null, uid: null, displayName: null });
    const [loading, setLoading] = useState<Boolean>(true);

    // Update the state depending on auth
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(authCorrect, (user) => {
            if (user) {
                setUser({
                    email: user.email,
                    uid: user.uid,
                    displayName: user.displayName
                });
            } else {
                setUser({ email: null, uid: null, displayName: null });
            }
        });

        setLoading(false);

        return () => unsubscribe();
    }, []);

    // Login the user
    const logIn = async (email: string, password: string) => {
        await loginAction({email, password})
        return signInWithEmailAndPassword(authCorrect, email, password).then(() => {
            router.push("/")
        });
    };

    // Logout the user
    const logOut = async () => {
        setUser({ email: null, uid: null, displayName: null });
        await logOutAction({})
        return await signOut(authCorrect);
    };

    // Wrap the children with the context provider
    return (
        <AuthContext.Provider value={{ user, logIn, logOut }}>
            {loading ? null : children}
        </AuthContext.Provider>
    );
};