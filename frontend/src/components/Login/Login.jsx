import React, { useRef, useState } from 'react';

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  const togglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      console.log('Login form submitted');
      console.log('Email:', emailRef.current.value);
      console.log('Password:', passwordRef.current.value);
    }, 2000);
  };

  return (
    <div id="root" className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 flex items-center justify-center md:ml-64 p-4 overflow-x-hidden relative">
      <section id="login-form" className="w-full max-w-md relative">
        {/* Background decorative image */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <img
            src="https://images.unsplash.com/photo-1595079835020-30a7ac7c0b02?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w2MzQ2fDB8MXxzZWFyY2h8MXx8bG9naW4lMjUyMGludGVyZmFjZSUyNTIwZGVzaWduJTI1MjBtaW5pbWFsJTI1MjBwdXJwbGUlMjUyMGlsbHVzdHJhdGlvbnxlbnwxfHx8fDE3NDg3NjY5OTd8MA&ixlib=rb-4.1.0&q=80&w=1080"
            alt="Login interface design"
            className="absolute top-0 right-0 w-64 h-64 object-cover opacity-10 transform rotate-12 translate-x-32 -translate-y-16"
            loading="lazy"
          />
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-3xl shadow-lg border border-purple-100 p-8 relative z-10 transition-all duration-500 hover:shadow-xl">
          {/* Logo/Brand */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 font-inter">SprintSync</h1>
            <p className="text-gray-600 text-sm mt-1">Welcome back to your workspace</p>
          </div>

          {/* Login Form */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Email Input */}
            <div className="transition-transform duration-300">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  ref={emailRef}
                  className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 bg-gray-50 focus:bg-white"
                  placeholder="Enter your email"
                />
                <svg className="absolute right-3 top-3.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                </svg>
              </div>
            </div>

            {/* Password Input */}
            <div className="transition-transform duration-300">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  required
                  ref={passwordRef}
                  className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 bg-gray-50 focus:bg-white pr-12"
                  placeholder="Enter your password"
                />
                <button type="button" className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600" onClick={togglePassword}>
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white py-3 px-4 rounded-2xl font-medium hover:from-purple-600 hover:to-indigo-700 focus:ring-4 focus:ring-purple-200 transition-all duration-300 transform hover:scale-105 active:scale-95"
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign In to SprintSync'}
            </button>

            {/* Forgot Password */}
            <div className="text-center">
              <a href="#" className="text-sm text-purple-600 hover:text-purple-700 transition-colors duration-200">
                Forgot your password?
              </a>
            </div>
          </form>

          {/* Register Link */}
          <div className="mt-8 pt-6 border-t border-gray-100 text-center">
            <p className="text-sm text-gray-600">
              New here?
              <a href="/register" className="text-purple-600 hover:text-purple-700 font-medium transition-colors duration-200">
                {' '}Register Now
              </a>
            </p>
          </div>

          {/* Decorative element */}
          <div className="absolute -bottom-2 -right-2 w-24 h-24 opacity-5">
            <img
              src="https://images.unsplash.com/photo-1535451801241-b5395e1d4a1b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w2MzQ2fDB8MXxzZWFyY2h8Mnx8bG9naW4lMjUyMGludGVyZmFjZSUyNTIwZGVzaWduJTI1MjBtaW5pbWFsJTI1MjBwdXJwbGUlMjUyMGlsbHVzdHJhdGlvbnxlbnwxfHx8fDE3NDg3NjY5OTd8MA&ixlib=rb-4.1.0&q=80&w=1080"
              alt="Login design element"
              className="w-full h-full object-cover rounded-full"
              loading="lazy"
            />
          </div>
        </div>

        {/* Floating elements */}
        <div className="absolute top-20 left-10 w-3 h-3 bg-purple-300 rounded-full animate-bounce opacity-60"></div>
        <div className="absolute bottom-32 right-16 w-2 h-2 bg-indigo-300 rounded-full animate-pulse opacity-40"></div>
        <div className="absolute top-1/3 right-8 w-4 h-4 bg-purple-200 rounded-full animate-bounce opacity-30" style={{ animationDelay: '1s' }}></div>
      </section>
    </div>
  );
}

export default Login;
