import React, { useRef, useState } from "react";
import api from "../utils/axios.js";
import { useNavigate } from "react-router-dom";

function Register() {
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [selectedAvatar, setSelectedAvatar] = useState("");
    const [errors, setErrors] = useState({
        name: "",
        email: "",
        password: "",
        avatar: "",
    });
    const navigate = useNavigate();

    const nameRef = useRef(null);
    const roleRef = useRef(null);
    const emailRef = useRef(null);
    const passwordRef = useRef(null);

   const avatarOptions = [
    // Male Avatars
    {
        url: "https://avatar.iran.liara.run/public/8",
        alt: "Male Avatar 1",
    },
    {
        url: "https://avatar.iran.liara.run/public/3",
        alt: "Male Avatar 2",
    },
    {
        url: "https://avatar.iran.liara.run/public/50",
        alt: "Male Avatar 3",
    },
    {
        url: "https://avatar.iran.liara.run/public/41",
        alt: "Male Avatar 4",
    },
    {
        url: "https://avatar.iran.liara.run/public/47",
        alt: "Male Avatar 5",
    },
    {
        url: "https://avatar.iran.liara.run/public/10",
        alt: "Male Avatar 6",
    },
    {
        url: "https://avatar.iran.liara.run/public/37",
        alt: "Male Avatar 7",
    },
    {
        url: "https://avatar.iran.liara.run/public/25",
        alt: "Male Avatar 8",
    },
    // Female Avatars
    {
        url: "https://avatar.iran.liara.run/public/99",
        alt: "Female Avatar 1",
    },
    {
        url: "https://avatar.iran.liara.run/public/64",
        alt: "Female Avatar 2",
    },
    {
        url: "https://avatar.iran.liara.run/public/79",
        alt: "Female Avatar 3",
    },
    {
        url: "https://avatar.iran.liara.run/public/60",
        alt: "Female Avatar 4",
    },
    {
        url: "https://avatar.iran.liara.run/public/81",
        alt: "Female Avatar 5",
    },
    {
        url: "https://avatar.iran.liara.run/public/56",
        alt: "Female Avatar 6",
    },
    {
        url: "https://avatar.iran.liara.run/public/71",
        alt: "Female Avatar 7",
    },
    {
        url: "https://avatar.iran.liara.run/public/91",
        alt: "Female Avatar 8",
    },
];

    const togglePassword = () => {
        setShowPassword((prev) => !prev);
    };

    const navigateToHomePage = () => {
        navigate("/");
    };

const handleAvatarChange = (avatarUrl) => {
    setSelectedAvatar(avatarUrl);
    setErrors((prev) => ({
        ...prev,
        avatar: "",
    }));
};


    const validateForm = () => {
        const newErrors = {
            name: "",
            email: "",
            role: "",
            password: "",
            avatar: "",
        };
        let isValid = true;

        // Name validation
        const name = nameRef.current.value;
        if (!name) {
            newErrors.name = "Name is required";
            isValid = false;
        }
        if (name.length < 6) {
            newErrors.name =
                "Length of name should be greater than 6 characters";
            isValid = false;
        }

        if (name.length > 254) {
            newErrors.name =
                "Length of name should be less than 254 characters";
            isValid = false;
        }

        // Role Validation
        const role = roleRef.current.value;
        if (!role) {
            newErrors.role = "Role is required";
            isValid = false;
        }

        // Email validation
        const email = emailRef.current.value;
        if (!email) {
            newErrors.email = "Email is required";
            isValid = false;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            newErrors.email = "Please enter a valid email address";
            isValid = false;
        }
        if (email.length < 6) {
            newErrors.email =
                "Length of email should be greater than 6 characters";
            isValid = false;
        }

        if (email.length > 254) {
            newErrors.email =
                "Length of email should be less than 254 characters";
            isValid = false;
        }

        // Avatar validation
        if (!selectedAvatar) {
            newErrors.avatar = "Please select an avatar";
            isValid = false;
        }

        // Password validation
        const password = passwordRef.current.value;
        if (!password) {
            newErrors.password = "Password is required";
            isValid = false;
        } else if (password.length < 8) {
            newErrors.password = "Password must be at least 8 characters long";
            isValid = false;
        } else if (!/[A-Z]/.test(password)) {
            newErrors.password =
                "Password must contain at least one uppercase letter";
            isValid = false;
        } else if (!/[a-z]/.test(password)) {
            newErrors.password =
                "Password must contain at least one lowercase letter";
            isValid = false;
        } else if (!/[0-9]/.test(password)) {
            newErrors.password = "Password must contain at least one number";
            isValid = false;
        } else if (!/[^A-Za-z0-9]/.test(password)) {
            newErrors.password =
                "Password must contain at least one special character";
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {
            console.log("Register form submitted");
            console.log("Name:", nameRef.current.value);
            console.log("Role: ", roleRef.current.value);
            console.log("Email:", emailRef.current.value);
            console.log("Password:", passwordRef.current.value);
            console.log("Avatar:", selectedAvatar);

            const res = await api.post("/register", {
                name: nameRef.current.value,
                role: roleRef.current.value,
                email: emailRef.current.value,
                password: passwordRef.current.value,
                avatar: selectedAvatar,
            });

            console.log(res);
            console.log(res.data.success);

            if (res.data.success) {
                const res2 = await api.get("/current-user");
                console.log(res2);
                navigate(`/dashboard/${res.data.data._id}`);
            }
        } catch (error) {
            console.error("Registration error:", error);
            // Handle API errors (like duplicate email)
            if (error.response && error.response.data) {
                setErrors((prev) => ({
                    ...prev,
                    email: error.response.data.message || "Registration failed",
                }));
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            id="root"
            className="relative flex min-h-screen items-center justify-center overflow-x-hidden bg-gradient-to-br from-purple-50 to-indigo-100 p-4"
        >
            <section id="login-form" className="relative w-full max-w-md">
                {/* Login Card */}
                <div className="relative z-10 rounded-3xl border border-purple-100 bg-white p-8 shadow-lg transition-all duration-500 hover:shadow-xl">
                    {/* Logo/Brand */}
                    <div className="mb-8 text-center">
                        <div
                            onClick={navigateToHomePage}
                            className="mb-4 inline-flex h-16 w-16 cursor-pointer items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600"
                        >
                            <svg
                                className="h-8 w-8 text-white"
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
                        <h1
                            onClick={navigateToHomePage}
                            className="font-inter cursor-pointer text-2xl font-bold text-gray-900"
                        >
                            SprintSync
                        </h1>
                        <p className="mt-1 text-sm text-gray-600">
                            Register for your workspace
                        </p>
                    </div>

                    {/* Login Form */}
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {/* Name Input */}
                        <div className="transition-transform duration-300">
                            <label
                                htmlFor="name"
                                className="mb-2 block text-sm font-medium text-gray-700"
                            >
                                Name
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    id="name"
                                    autoFocus
                                    autoComplete="off"
                                    name="name"
                                    ref={nameRef}
                                    className={`w-full border px-4 py-3 outline-none ${errors.name ? "border-red-500" : "border-gray-200"} rounded-2xl bg-gray-50 transition-all duration-300 focus:border-transparent focus:bg-white focus:ring-2 focus:ring-purple-500`}
                                    placeholder="Enter your name"
                                    onChange={() =>
                                        setErrors((prev) => ({
                                            ...prev,
                                            name: "",
                                        }))
                                    }
                                />
                            </div>
                            {errors.name && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.name}
                                </p>
                            )}
                        </div>

                        {/* Role Input */}
                        <div className="transition-transform duration-300">
                            <div className="relative">
                                <label
                                    htmlFor="role"
                                    className="mb-2 block text-sm font-medium text-gray-700"
                                >
                                    Role
                                </label>
                                <select
                                    ref={roleRef}
                                    name="role"
                                    id="role"
                                    className={`w-full border px-4 py-3 text-gray-500 outline-none ${errors.role ? "border-red-500" : "border-gray-200"} rounded-2xl bg-gray-50 transition-all duration-300 focus:border-transparent focus:bg-white focus:ring-2 focus:ring-purple-500`}
                                    onChange={() =>
                                        setErrors((prev) => ({
                                            ...prev,
                                            role: "",
                                        }))
                                    }
                                >
                                    <option value="">Enter your role</option>
                                    <option value="BA">BA</option>
                                    <option value="QA">QA</option>
                                    <option value="Developer">Developer</option>
                                    <option value="Manager">Manager</option>
                                </select>
                            </div>

                            {errors.role && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.role}
                                </p>
                            )}
                        </div>

                       {/* Avatar Selection */}
<div className="transition-transform duration-300">
    <label className="mb-3 block text-sm font-medium text-gray-700">
        Choose Your Avatar
    </label>
    <div className="grid grid-cols-4 gap-3">
        {avatarOptions.map((avatar) => (
            <div key={avatar.url} className="relative">
                <input
                    type="radio"
                    name="avatar"
                    value={avatar.url}
                    id={`avatar-${avatar.url}`}
                    checked={selectedAvatar === avatar.url}
                    onChange={() => handleAvatarChange(avatar.url)}
                    className="sr-only"
                />
                <label
                    htmlFor={`avatar-${avatar.url}`}
                    className="block cursor-pointer"
                >
                    <img
                        src={avatar.url}
                        alt={avatar.alt}
                        className={`h-12 w-12 rounded-full border-2 transition-colors ${
                            selectedAvatar === avatar.url
                                ? "border-purple-500"
                                : "border-gray-200 hover:border-purple-300"
                        }`}
                    />
                </label>
            </div>
        ))}
    </div>
    {errors.avatar && (
        <p className="mt-1 text-sm text-red-600">{errors.avatar}</p>
    )}
</div>

                        {/* Email Input */}
                        <div className="transition-transform duration-300">
                            <label
                                htmlFor="email"
                                className="mb-2 block text-sm font-medium text-gray-700"
                            >
                                Email Address
                            </label>
                            <div className="relative">
                                <input
                                    type="email"
                                    id="email"
                                    autoComplete="off"
                                    name="email"
                                    ref={emailRef}
                                    className={`w-full border px-4 py-3 outline-none ${errors.email ? "border-red-500" : "border-gray-200"} rounded-2xl bg-gray-50 transition-all duration-300 focus:border-transparent focus:bg-white focus:ring-2 focus:ring-purple-500`}
                                    placeholder="Enter your email"
                                    onChange={() =>
                                        setErrors((prev) => ({
                                            ...prev,
                                            email: "",
                                        }))
                                    }
                                />
                                <svg
                                    className="absolute top-3.5 right-3 h-5 w-5 text-gray-400"
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
                            {errors.email && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.email}
                                </p>
                            )}
                        </div>

                        {/* Password Input */}
                        <div className="transition-transform duration-300">
                            <label
                                htmlFor="password"
                                className="mb-2 block text-sm font-medium text-gray-700"
                            >
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    name="password"
                                    ref={passwordRef}
                                    className={`w-full border px-4 py-3 outline-none ${errors.password ? "border-red-500" : "border-gray-200"} rounded-2xl bg-gray-50 pr-12 transition-all duration-300 focus:border-transparent focus:bg-white focus:ring-2 focus:ring-purple-500`}
                                    placeholder="Enter your password"
                                    onChange={() =>
                                        setErrors((prev) => ({
                                            ...prev,
                                            password: "",
                                        }))
                                    }
                                />
                                <button
                                    type="button"
                                    className="absolute top-3.5 right-3 text-gray-400 hover:text-gray-600"
                                    onClick={togglePassword}
                                >
                                    {showPassword ? (
                                        <svg
                                            className="h-5 w-5"
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
                                            className="h-5 w-5"
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
                            {errors.password && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.password}
                                </p>
                            )}
                            <div className="mt-2 text-xs text-gray-500">
                                Password must contain:
                                <ul className="list-inside list-disc">
                                    <li
                                        className={
                                            passwordRef.current?.value
                                                ?.length >= 8
                                                ? "text-green-500"
                                                : ""
                                        }
                                    >
                                        At least 8 characters
                                    </li>
                                    <li
                                        className={
                                            /[A-Z]/.test(
                                                passwordRef.current?.value || ""
                                            )
                                                ? "text-green-500"
                                                : ""
                                        }
                                    >
                                        One uppercase letter
                                    </li>
                                    <li
                                        className={
                                            /[a-z]/.test(
                                                passwordRef.current?.value || ""
                                            )
                                                ? "text-green-500"
                                                : ""
                                        }
                                    >
                                        One lowercase letter
                                    </li>
                                    <li
                                        className={
                                            /[0-9]/.test(
                                                passwordRef.current?.value || ""
                                            )
                                                ? "text-green-500"
                                                : ""
                                        }
                                    >
                                        One number
                                    </li>
                                    <li
                                        className={
                                            /[^A-Za-z0-9]/.test(
                                                passwordRef.current?.value || ""
                                            )
                                                ? "text-green-500"
                                                : ""
                                        }
                                    >
                                        One special character
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="w-full transform rounded-2xl bg-gradient-to-r from-purple-500 to-indigo-600 px-4 py-3 font-medium text-white transition-all duration-300 hover:scale-101 hover:from-purple-600 hover:to-indigo-700 focus:ring-4 focus:ring-purple-200 active:scale-95"
                            disabled={loading}
                        >
                            {loading ? "Creating account..." : "Create Account"}
                        </button>
                    </form>

                    {/* Register Link */}
                    <div className="mt-8 border-t border-gray-100 pt-6 text-center">
                        <p className="text-sm text-gray-600">
                            Already Registered?
                            <a
                                href="/login"
                                className="font-medium text-purple-600 transition-colors duration-200 hover:text-purple-700"
                            >
                                {" "}
                                Login
                            </a>
                        </p>
                    </div>
                </div>

                {/* Floating elements */}
                <div className="absolute top-20 left-10 h-3 w-3 animate-bounce rounded-full bg-purple-300 opacity-60"></div>
                <div className="absolute right-16 bottom-32 h-2 w-2 animate-pulse rounded-full bg-indigo-300 opacity-40"></div>
                <div
                    className="absolute top-1/3 right-8 h-4 w-4 animate-bounce rounded-full bg-purple-200 opacity-30"
                    style={{ animationDelay: "1s" }}
                ></div>
            </section>
        </div>
    );
}

export default Register;
