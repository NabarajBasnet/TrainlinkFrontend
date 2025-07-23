'use client'

import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, User, Dumbbell, Users } from 'lucide-react';

export default function TrainLinkAuth() {
    const [isLogin, setIsLogin] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [selectedRole, setSelectedRole] = useState('member');
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: ''
    });

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form submitted:', { ...formData, role: selectedRole });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white flex items-center justify-center p-4">
            <div className="w-full max-w-6xl mx-auto grid lg:grid-cols-2 gap-8 items-center">

                {/* Left Side - Illustration/Branding */}
                <div className="hidden lg:flex flex-col items-center justify-center text-center p-8">
                    <div className="mb-8">
                        <div className="flex items-center justify-center mb-6">
                            <Dumbbell className="h-12 w-12 text-orange-500 mr-3" />
                            <h1 className="text-4xl font-bold text-gray-900">TrainLink</h1>
                        </div>
                        <p className="text-xl text-gray-600 mb-8">
                            Connecting personal trainers and members for better fitness journeys
                        </p>
                    </div>

                    <div className="relative">
                        <div className="w-80 h-80 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center shadow-2xl">
                            <div className="text-white text-center">
                                <Dumbbell className="h-20 w-20 mx-auto mb-4" />
                                <Users className="h-16 w-16 mx-auto opacity-80" />
                            </div>
                        </div>
                        <div className="absolute -top-4 -right-4 w-16 h-16 bg-white rounded-full shadow-lg flex items-center justify-center">
                            <span className="text-orange-500 font-bold text-lg">💪</span>
                        </div>
                        <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-orange-100 rounded-full shadow-lg flex items-center justify-center">
                            <span className="text-orange-600 font-bold">⚡</span>
                        </div>
                    </div>
                </div>

                {/* Right Side - Auth Forms */}
                <div className="w-full max-w-md mx-auto">
                    <div className="bg-white rounded-2xl shadow-xl p-8">

                        {/* Mobile Logo */}
                        <div className="lg:hidden flex items-center justify-center mb-8">
                            <Dumbbell className="h-8 w-8 text-orange-500 mr-2" />
                            <h1 className="text-2xl font-bold text-gray-900">TrainLink</h1>
                        </div>

                        {/* Form Toggle */}
                        <div className="flex bg-gray-100 rounded-lg p-1 mb-8">
                            <button
                                onClick={() => setIsLogin(true)}
                                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${isLogin
                                    ? 'bg-white text-orange-600 shadow-sm'
                                    : 'text-gray-600 hover:text-gray-900'
                                    }`}
                            >
                                Log In
                            </button>
                            <button
                                onClick={() => setIsLogin(false)}
                                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${!isLogin
                                    ? 'bg-white text-orange-600 shadow-sm'
                                    : 'text-gray-600 hover:text-gray-900'
                                    }`}
                            >
                                Sign Up
                            </button>
                        </div>

                        {/* Form Header */}
                        <div className="text-center mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                {isLogin ? 'Welcome back!' : 'Create your account'}
                            </h2>
                            <p className="text-gray-600">
                                {isLogin
                                    ? 'Sign in to continue your fitness journey'
                                    : 'Join the TrainLink community today'
                                }
                            </p>
                        </div>

                        {/* Auth Form */}
                        <div className="space-y-6">

                            {/* Full Name - Registration Only */}
                            {!isLogin && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Full Name
                                    </label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                        <input
                                            type="text"
                                            name="fullName"
                                            value={formData.fullName}
                                            onChange={handleInputChange}
                                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                                            placeholder="Enter your full name"
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Email */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                                        placeholder="Enter your email"
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Password
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                                        placeholder="Enter your password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                    </button>
                                </div>
                                {!isLogin && (
                                    <p className="text-xs text-gray-500 mt-1">Minimum 8 characters required</p>
                                )}
                            </div>

                            {/* Role Selection - Registration Only */}
                            {!isLogin && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-3">
                                        I am a...
                                    </label>
                                    <div className="grid grid-cols-2 gap-3">
                                        <button
                                            type="button"
                                            onClick={() => setSelectedRole('member')}
                                            className={`p-4 border-2 rounded-lg transition-all duration-200 ${selectedRole === 'member'
                                                ? 'border-orange-500 bg-orange-50 text-orange-700'
                                                : 'border-gray-200 hover:border-gray-300'
                                                }`}
                                        >
                                            <Users className="h-6 w-6 mx-auto mb-2" />
                                            <span className="block text-sm font-medium">Member</span>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setSelectedRole('trainer')}
                                            className={`p-4 border-2 rounded-lg transition-all duration-200 ${selectedRole === 'trainer'
                                                ? 'border-orange-500 bg-orange-50 text-orange-700'
                                                : 'border-gray-200 hover:border-gray-300'
                                                }`}
                                        >
                                            <Dumbbell className="h-6 w-6 mx-auto mb-2" />
                                            <span className="block text-sm font-medium">Trainer</span>
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Forgot Password - Login Only */}
                            {isLogin && (
                                <div className="text-right">
                                    <button className="text-sm text-orange-600 hover:text-orange-700 font-medium">
                                        Forgot password?
                                    </button>
                                </div>
                            )}

                            {/* Submit Button */}
                            <button
                                type="button"
                                onClick={handleSubmit}
                                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
                            >
                                {isLogin ? 'Log In' : 'Create Account'}
                            </button>

                            {/* Switch Form Link */}
                            <div className="text-center">
                                <span className="text-gray-600">
                                    {isLogin ? "Don't have an account? " : "Already have an account? "}
                                </span>
                                <button
                                    type="button"
                                    onClick={() => setIsLogin(!isLogin)}
                                    className="text-orange-600 hover:text-orange-700 font-medium"
                                >
                                    {isLogin ? 'Sign up' : 'Log in'}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Terms & Privacy - Registration Only */}
                    {!isLogin && (
                        <p className="text-xs text-gray-500 text-center mt-4">
                            By creating an account, you agree to our{' '}
                            <button className="text-orange-600 hover:underline">Terms of Service</button>
                            {' '}and{' '}
                            <button className="text-orange-600 hover:underline">Privacy Policy</button>
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}