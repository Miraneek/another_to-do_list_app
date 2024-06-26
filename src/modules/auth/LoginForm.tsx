"use client"
import React, {useState} from 'react';
import Link from "next/link";
import {useAuth} from "@/modules/auth/AuthContextProvider";

export function LoginForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({
        email: '',
        password: '',
        mainError: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {logIn, user} = useAuth();
    const validateEmail = (email: string) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    const validatePassword = (password: string) => {
        const regex = /^.{8,}$/;
        return regex.test(password);
    };

    const handleBlur = (field: string) => {
        let error = '';
        switch (field) {
            case 'email':
                if (!validateEmail(email)) error = 'Invalid email address';
                break;
            case 'password':
                if (!validatePassword(password)) error = 'Password must be at least 8 characters long';
                break;
            default:
                break;
        }
        setErrors({...errors, [field]: error});
    };

    const validateForm = () => {
        const emailError = validateEmail(email) ? '' : 'Invalid email address';
        const passwordError = validatePassword(password) ? '' : 'Password must be at least 8 characters long';

        setErrors({
            ...errors,
            email: emailError,
            password: passwordError,
        });

        return !emailError && !passwordError;
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setErrors({...errors, mainError: ''});
        setIsSubmitting(true);
        if (validateForm()) {
            try {
                await logIn(email, password);
            } catch (error: any) {
                setIsSubmitting(false)
                switch (error.code) {
                    case "auth/user-not-found":
                        setErrors({...errors, mainError: 'User not found'});
                        break;
                    case "auth/invalid-credential":
                        setErrors({...errors, mainError: 'Invalid credentials, please try again.'});
                        break;
                    case "auth/network-request-failed":
                        setErrors({...errors, mainError: 'Network request failed. Please try again.'});
                        break
                    case "auth/too-many-requests":
                        setErrors({...errors, mainError: 'Too many requests. Please try again after a bit.'});
                        break
                }
            }
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-96 text-black">
                <h2 className="text-2xl mb-4 text-center">Login</h2>
                <div className="mb-4">
                    <label htmlFor="email" className="block text-gray-700">Email</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onBlur={() => handleBlur('email')}
                        className={`w-full px-3 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded`}
                    />
                    {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                </div>
                <div className="mb-4">
                    <label htmlFor="password" className="block text-gray-700">Password</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onBlur={() => handleBlur('password')}
                        className={`w-full px-3 py-2 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded`}
                    />
                    {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
                </div>
                <button type={"submit"}
                        className={"disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-blue-500 w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"}
                        disabled={isSubmitting}>Login
                </button>
                {errors.mainError && <p className="text-red-500 text-lg">{errors.mainError}</p>}
            </form>
            <div className={"mt-4 text-center text-white font-semibold"}>
                <span>
                    Dont have an account?
                </span>
                <Link href={"/register"} className={"ml-2 text-blue-400"}>Register</Link>
            </div>
            {user.email && <div className={"text-center text-white font-semibold"}>Logged in as {user.displayName}. <Link href={"/"} className={"text-blue-400 focus:text-blue-400"}>Continue to Home.</Link></div>}
        </div>
    );
}
