import React, { useRef, useState } from "react";
import api from "../utils/axios.js";
import { useNavigate } from "react-router-dom";

function Register() {
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const emailRef = useRef(null);
    const passwordRef = useRef(null);

    const togglePassword = () => {
        setShowPassword((prev) => !prev);
    };

    const navigateToHomePage = () => {
        navigate("/")
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);

        setTimeout(async () => {
            setLoading(false);
            console.log("Login form submitted");
            console.log("Email:", emailRef.current.value);
            console.log("Password:", passwordRef.current.value);
            const res = await api.post("/register", {
                email: emailRef.current.value,
                password: passwordRef.current.value,
            });
            console.log(res);
            console.log(res.data.success)
            const res2 = await api.get("/current-user")
            console.log(res2)
            if(res.data.success){
                navigate(`/dashboard/${res.data.data._id}`)
            }
            
        }, 2000);

    };

    return (
        <div
            id="root"
            className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 flex items-center justify-center p-4 overflow-x-hidden relative"
        >
            <section id="login-form" className="w-full max-w-md relative">
                {/* Login Card */}
                <div className="bg-white rounded-3xl shadow-lg border border-purple-100 p-8 relative z-10 transition-all duration-500 hover:shadow-xl">
                    {/* Logo/Brand */}
                    <div className="text-center mb-8">
                        <div onClick={navigateToHomePage} className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl mb-4">
                            <svg
                                className="w-8 h-8 text-white"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M13 10V3L4 14h7v7l9-11h-7z"
                                />
                            </svg>
                        </div>
                        <h1 onClick={navigateToHomePage} className="text-2xl font-bold text-gray-900 font-inter">
                            SprintSync
                        </h1>
                        <p className="text-gray-600 text-sm mt-1">
                            Register for your workspace
                        </p>
                    </div>

                    {/* Login Form */}
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {/* Email Input */}
                        <div className="transition-transform duration-300">
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium text-gray-700 mb-2"
                            >
                                Email Address
                            </label>
                            <div className="relative">
                                <input
                                    type="email"
                                    id="email"
                                    autoFocus
                                    autoComplete="off"
                                    name="email"
                                    ref={emailRef}
                                    className="w-full px-4 outline-none py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 bg-gray-50 focus:bg-white"
                                    placeholder="Enter your email"
                                />
                                <svg
                                    className="absolute right-3 top-3.5 w-5 h-5 text-gray-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                                    />
                                </svg>
                            </div>
                        </div>

                        {/* Password Input */}
                        <div className="transition-transform duration-300">
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium text-gray-700 mb-2"
                            >
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    name="password"
                                    ref={passwordRef}
                                    className="w-full px-4 py-3 border outline-none border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 bg-gray-50 focus:bg-white pr-12"
                                    placeholder="Enter your password"
                                />
                                <button
                                    type="button"
                                    className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
                                    onClick={togglePassword}
                                >
                                    {showPassword ? (
                                        <svg
                                            className="w-5 h-5"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                                            />
                                        </svg>
                                    ) : (
                                        <svg
                                            className="w-5 h-5"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                            />
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                            />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white py-3 px-4 rounded-2xl font-medium hover:from-purple-600 hover:to-indigo-700 focus:ring-4 focus:ring-purple-200 transition-all duration-300 transform hover:scale-101 active:scale-95"
                            disabled={loading}
                        >
                            {loading
                                ? "Signing in..."
                                : "Sign In to SprintSync"}
                        </button>

                        {/* Forgot Password */}
                        {/* <div className="text-center">
                            <a
                                href="#"
                                className="text-sm text-purple-600 hover:text-purple-700 transition-colors duration-200"
                            >
                                Forgot your password?
                            </a>
                        </div> */}
                    </form>

                    {/* Register Link */}
                    <div className="mt-8 pt-6 border-t border-gray-100 text-center">
                        <p className="text-sm text-gray-600">
                            Already Registered?
                            <a
                                href="/login"
                                className="text-purple-600 hover:text-purple-700 font-medium transition-colors duration-200"
                            >
                                {" "}
                                Login
                            </a>
                        </p>
                    </div>
                </div>

                {/* Floating elements */}
                <div className="absolute top-20 left-10 w-3 h-3 bg-purple-300 rounded-full animate-bounce opacity-60"></div>
                <div className="absolute bottom-32 right-16 w-2 h-2 bg-indigo-300 rounded-full animate-pulse opacity-40"></div>
                <div
                    className="absolute top-1/3 right-8 w-4 h-4 bg-purple-200 rounded-full animate-bounce opacity-30"
                    style={{ animationDelay: "1s" }}
                ></div>
            </section>
        </div>
    );
}

export default Register;
