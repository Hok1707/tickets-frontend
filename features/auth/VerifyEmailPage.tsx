import { useState, useEffect, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { authService } from "@/services/authService";
import toast from "react-hot-toast";
import { CheckCircleIcon, XCircleIcon, EnvelopeIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";

export default function VerifyEmailPage() {
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token") || searchParams.get("verifyToken");
    const navigate = useNavigate();
    const verifyCalled = useRef(false);

    const [status, setStatus] = useState<"idle" | "verifying" | "success" | "error">("idle");
    const [message, setMessage] = useState("");

    useEffect(() => {
        if (!token) {
            setStatus("error");
            setMessage("Invalid or missing verification token.");
            return;
        }

        const verify = async () => {
            if (verifyCalled.current) return;
            verifyCalled.current = true;

            setStatus("verifying");
            try {
                await authService.verifyEmail(token);
                setStatus("success");
                toast.success("Email verified successfully!");
                setTimeout(() => navigate("/login"), 3000);
            } catch (error: any) {
                setStatus("error");
                setMessage(error.response?.data?.message || "Failed to verify email.");
                toast.error(error.response?.data?.message || "Failed to verify email.");
            }
        };

        verify();
    }, [token, navigate]);

    const handleGoToLogin = () => {
        navigate("/login");
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-[url('https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center relative overflow-hidden">
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900/90 via-gray-900/80 to-primary-900/40 backdrop-blur-sm" />

            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 90, 0],
                        opacity: [0.3, 0.5, 0.3]
                    }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute -top-1/2 -left-1/2 w-full h-full bg-primary-500/20 rounded-full blur-[100px]"
                />
                <motion.div
                    animate={{
                        scale: [1, 1.5, 1],
                        rotate: [0, -90, 0],
                        opacity: [0.2, 0.4, 0.2]
                    }}
                    transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                    className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-purple-500/20 rounded-full blur-[100px]"
                />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md z-10 px-4"
            >
                <div className="bg-white/10 dark:bg-gray-900/50 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 text-center">

                    {status === "verifying" && (
                        <div className="flex flex-col items-center">
                            <div className="bg-blue-500/20 text-blue-400 rounded-full p-4 mb-6 animate-pulse ring-1 ring-blue-500/50">
                                <EnvelopeIcon className="w-10 h-10" />
                            </div>
                            <h1 className="text-3xl font-bold text-white mb-3">
                                Verifying Email
                            </h1>
                            <p className="text-gray-300 mb-8 text-lg">
                                Please wait while we verify your email address...
                            </p>
                            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    )}

                    {status === "success" && (
                        <div className="flex flex-col items-center">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="bg-green-500/20 text-green-400 rounded-full p-4 mb-6 ring-1 ring-green-500/50"
                            >
                                <CheckCircleIcon className="w-10 h-10" />
                            </motion.div>
                            <h1 className="text-3xl font-bold text-white mb-3">
                                Email Verified!
                            </h1>
                            <p className="text-gray-300 mb-8 text-lg">
                                Your email has been successfully verified. Redirecting to login...
                            </p>
                            <button
                                onClick={handleGoToLogin}
                                className="w-full bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white font-semibold py-3 px-6 rounded-xl transition-all shadow-lg shadow-green-500/25"
                            >
                                Go to Login Now
                            </button>
                        </div>
                    )}

                    {status === "error" && (
                        <div className="flex flex-col items-center">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="bg-red-500/20 text-red-400 rounded-full p-4 mb-6 ring-1 ring-red-500/50"
                            >
                                <XCircleIcon className="w-10 h-10" />
                            </motion.div>
                            <h1 className="text-3xl font-bold text-white mb-3">
                                Verification Failed
                            </h1>
                            <p className="text-gray-300 mb-8 text-lg">
                                {message}
                            </p>
                            <button
                                onClick={handleGoToLogin}
                                className="w-full bg-white/10 hover:bg-white/20 text-white font-semibold py-3 px-6 rounded-xl transition-all border border-white/10"
                            >
                                Back to Login
                            </button>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
}
