import React, { useRef, useState } from "react";
import api from "../utils/axios.js";
import { useNavigate } from "react-router-dom";

function Login() {
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [fieldErrors, setFieldErrors] = useState({
        email: "",
        password: ""
    });
    const navigate = useNavigate();

    const emailRef = useRef(null);
    const passwordRef = useRef(null);

    const togglePassword = () => {
        setShowPassword((prev) => !prev);
    };

    const navigateToHomePage = () => {
        navigate("/")
    }

    // Client-side validation function
    const validateForm = () => {
        const email = emailRef.current.value.trim();
        const password = passwordRef.current.value.trim();
        const errors = { email: "", password: "" };
        let isValid = true;

        // Email validation
        if (!email) {
            errors.email = "Email is required";
            isValid = false;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            errors.email = "Please enter a valid email address";
            isValid = false;
        }

        // Password validation
        if (!password) {
            errors.password = "Password is required";
            isValid = false;
        } else if (password.length < 6) {
            errors.password = "Password must be at least 6 characters long";
            isValid = false;
        }

        setFieldErrors(errors);
        return isValid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Clear previous errors
        setError("");
        setFieldErrors({ email: "", password: "" });

        // Validate form before submission
        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {
            const res = await api.post("/login", {
                email: emailRef.current.value.trim(),
                password: passwordRef.current.value.trim(),
            });

            console.log("Login response:", res);

            if (res.data.success) {
                console.log("Login successful");
                localStorage.setItem("loggedInUser", JSON.stringify(res.data.data.loggedInUser));
                navigate(`/dashboard`);
            } else {
                setError(res.data.message || "Login failed. Please try again.");
            }
        } catch (error) {
            console.error("Login error:", error);
            
            // Handle different types of errors
            if (error.response) {
                // Server responded with error status
                const errorMessage = error.response.data?.message || error.response.data?.error;
                
                if (error.response.status === 404 || errorMessage?.toLowerCase().includes("doesn't exist") || errorMessage?.toLowerCase().includes("not found")) {
                    setError("User doesn't exist. Please check your email or register first.");
                } else if (error.response.status === 401 || errorMessage?.toLowerCase().includes("password") || errorMessage?.toLowerCase().includes("incorrect")) {
                    setError("Incorrect password. Please try again.");
                } else if (error.response.status === 400) {
                    setError(errorMessage || "Invalid credentials. Please check your email and password.");
                } else if (error.response.status >= 500) {
                    setError("Server error. Please try again later.");
                } else {
                    setError(errorMessage || "Login failed. Please try again.");
                }
            } else if (error.request) {
                // Network error
                setError("Network error. Please check your internet connection and try again.");
            } else {
                // Other errors
                setError("An unexpected error occurred. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    // Clear errors when user starts typing
    const handleInputChange = (field) => {
        if (fieldErrors[field]) {
            setFieldErrors(prev => ({ ...prev, [field]: "" }));
        }
        if (error) {
            setError("");
        }
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
                        <div onClick={navigateToHomePage} className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl mb-4 cursor-pointer">
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
                        <h1 onClick={navigateToHomePage} className="text-2xl font-bold text-gray-900 font-inter cursor-pointer">
                            SprintSync
                        </h1>
                        <p className="text-gray-600 text-sm mt-1">
                            Welcome back to your workspace
                        </p>
                    </div>

                    {/* Global Error Message */}
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl">
                            <div className="flex items-center">
                                <svg className="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <p className="text-red-700 text-sm">{error}</p>
                            </div>
                        </div>
                    )}

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
                                    autoComplete="email"
                                    name="email"
                                    ref={emailRef}
                                    onChange={() => handleInputChange('email')}
                                    className={`w-full px-4 outline-none py-3 border rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 bg-gray-50 focus:bg-white ${
                                        fieldErrors.email ? 'border-red-300 bg-red-50' : 'border-gray-200'
                                    }`}
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
                            {fieldErrors.email && (
                                <p className="mt-1 text-sm text-red-600">{fieldErrors.email}</p>
                            )}
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
                                    autoComplete="current-password"
                                    ref={passwordRef}
                                    onChange={() => handleInputChange('password')}
                                    className={`w-full px-4 py-3 border outline-none rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 bg-gray-50 focus:bg-white pr-12 ${
                                        fieldErrors.password ? 'border-red-300 bg-red-50' : 'border-gray-200'
                                    }`}
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
                            {fieldErrors.password && (
                                <p className="mt-1 text-sm text-red-600">{fieldErrors.password}</p>
                            )}
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white py-3 px-4 rounded-2xl font-medium hover:from-purple-600 hover:to-indigo-700 focus:ring-4 focus:ring-purple-200 transition-all duration-300 transform hover:scale-101 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                            disabled={loading}
                        >
                            {loading ? (
                                <div className="flex items-center justify-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Signing in...
                                </div>
                            ) : (
                                "Sign In to SprintSync"
                            )}
                        </button>
                    </form>

                    {/* Register Link */}
                    <div className="mt-8 pt-6 border-t border-gray-100 text-center">
                        <p className="text-sm text-gray-600">
                            New here?
                            <a
                                href="/register"
                                className="text-purple-600 hover:text-purple-700 font-medium transition-colors duration-200"
                            >
                                {" "}
                                Register Now
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

export default Login;