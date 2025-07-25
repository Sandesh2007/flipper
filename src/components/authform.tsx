'use client'

import { useState } from "react";
import { ArrowLeft, Eye, EyeOff, X } from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";
import toast from "react-hot-toast";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/utils/supabase/client"
import ForgotPassword from "./forgot-password";

export default function AuthForm() {
    const searchParams = useSearchParams();
    const mode = searchParams.get("mode");
    const [isLoading, setLoading] = useState(false);
    const [isLogin, setIsLogin] = useState(mode === "login");
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: ""
    });
    const [showPassword, setShowPassword] = useState(false);
    const [agreedToTerms, setAgreedToTerms] = useState(false);
    const supabase = createClient();
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        if (isLoading) return;
        setLoading(true);

        try {
            if (!isLogin && (!formData.email || !formData.password || !formData.username)) {
                toast.error("Please fill in all fields");
                return;
            }

            if (!isLogin && !agreedToTerms) {
                toast.error(`Please agree to the Terms & Conditions`);
                return;
            }

            const { email, password, username } = formData;

            if (isLogin) {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) {
                    toast.error(error.message);
                    return;
                }
                toast.success(`${isLogin ? 'Login' : 'Signup'} sucess`)
            }
            else {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: {
                            username: username,
                            email: formData.email as string,
                        }
                    }
                });
                if (error) {
                    toast.custom(
                        (t) => (
                            <div
                                className={`${t.visible ? "animate-enter" : "animate-leave"
                                    } max-w-sm w-full bg-red-500 text-white px-4 py-3 rounded shadow-lg flex flex-col gap-2`}
                            >
                                <div>
                                    <p className="text-sm whitespace-pre-line text-wrap break-words">{error.message}</p>
                                </div>
                                <div className="flex justify-end">
                                    <Button variant="outline" onClick={() => toast.dismiss(t.id)}>
                                        <X size={16} />
                                    </Button>
                                </div>
                            </div>
                        ),
                        { duration: 3000 }
                    );
                }
                else {
                    toast.success("Signup successful! Please check your email to verify.");
                }
            }
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "An error occurred");
        } finally {
            setLoading(false);
        }
    };

    const handleSocialLogin = async (provider: "google" | "apple") => {
        try {
            const { error, data } = await supabase.auth.signInWithOAuth({
                provider,
                options: {
                    queryParams: {
                        access_type: "offline",
                        prompt: "consent",
                    },
                    redirectTo: `${window.location.origin}/auth/callback`
                }
            });
            if (error) {
                toast.error(error.message);
                return;
            }
            if (data.url) {
                window.location.href = data.url;
            }
        } catch (err) {
            toast.error("An error occurred during social login");
            console.error(err);
        }
    };

    const switchMode = () => {
        setIsLogin(!isLogin);
        setFormData({ username: "", email: "", password: "" });
        setAgreedToTerms(false);
        setShowPassword(false);
    };

    return (
        <div className="h-fit bg-background flex items-center justify-center p-4 ">
            <div className="w-full max-w-6xl bg-card rounded-2xl lg:rounded-3xl shadow-2xl overflow-hidden flex flex-col lg:flex-row min-h-[600px]">
                {/* Left Panel - Image (Hidden on mobile, shown on lg+) */}
                <div className="hidden lg:flex lg:w-1/2 relative">
                    <div className="w-full h-full bg-muted flex flex-col justify-between p-6 xl:p-8 relative overflow-hidden">
                        {/* Mountain silhouette background */}
                        <div className="absolute inset-0 opacity-30">
                            <svg viewBox="0 0 400 600" className="w-full h-full">
                                <path
                                    d="M0,400 Q100,200 200,300 Q300,150 400,250 L400,600 L0,600 Z"
                                    fill="rgba(0,0,0,0.3)"
                                />
                                <path
                                    d="M0,450 Q150,250 250,350 Q350,200 400,300 L400,600 L0,600 Z"
                                    fill="rgba(0,0,0,0.2)"
                                />
                            </svg>
                        </div>

                        {/* Logo and back button */}
                        <div className="relative z-10">
                            <Link href="/">
                                <Button variant="ghost" className="text-muted-foreground transition-colors flex items-center gap-2 mb-6 xl:mb-8 text-sm xl:text-base hover:text-foreground cursor-pointer">
                                    <ArrowLeft size={18} />
                                    <span>Back to website</span>
                                </Button>
                            </Link>
                            <div className="text-foreground text-2xl xl:text-3xl font-bold">Neko Press</div>
                        </div>

                        {/* Main content */}
                        <div className="relative z-10 text-foreground">
                            <h2 className="text-3xl xl:text-4xl font-bold mb-4 leading-tight">
                                Create beautiful flipbooks,<br />
                                Creating Memories
                            </h2>
                        </div>
                    </div>
                </div>

                {/* Right Panel - Form */}
                <form className="w-full lg:w-1/2 p-6 sm:p-8 lg:p-10 xl:p-12 flex items-center dark:bg-neutral-900">
                    <div className="max-w-md mx-auto w-full">
                        {/* Mobile logo */}
                        <div className="lg:hidden text-foreground text-2xl font-bold mb-8 text-center">Neko Press</div>

                        {/* Form Header with Animation */}
                        <div className="relative overflow-hidden mb-8">
                            <div
                                className={`transition-all duration-500 ease-in-out transform ${isLogin ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0 absolute inset-0'
                                    }`}
                            >
                                <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">Welcome back</h1>
                                <p className="text-muted-foreground">
                                    Don&apos;t have an account?{" "}
                                    <button
                                        onClick={switchMode}
                                        className="text-accent-foreground hover:text-neutral-600 transition-colors underline"
                                    >
                                        Sign up
                                    </button>
                                </p>
                            </div>

                            <div
                                className={`transition-all duration-500 ease-in-out transform ${!isLogin ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0 absolute inset-0'
                                    }`}
                            >
                                <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">Create an account</h1>
                                <p className="text-muted-foreground">
                                    Already have an account?{" "}
                                    <button
                                        onClick={switchMode}
                                        className="text-accent-foreground hover:text-neutral-600 transition-colors underline"
                                    >
                                        Log in
                                    </button>
                                </p>
                            </div>
                        </div>

                        {/* Form with Animation */}
                        <div className="space-y-4 sm:space-y-6">
                            {/* Name fields - Only for signup */}
                            <div
                                className={`w-full transition-all duration-500 ease-in-out overflow-hidden ${!isLogin ? 'max-h-24 opacity-100' : 'max-h-0 opacity-0'
                                    }`}
                            >
                                <div>
                                    <input
                                        type="text"
                                        name="username"
                                        placeholder="Username"
                                        value={formData.username}
                                        onChange={handleInputChange}
                                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-muted border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:border-ring focus:ring-1 focus:ring-ring transition-colors text-sm sm:text-base"
                                    />
                                </div>
                            </div>

                            {/* Email field */}
                            <div>
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-muted border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:border-ring focus:ring-1 focus:ring-ring transition-colors text-sm sm:text-base"
                                    required
                                />
                            </div>

                            {/* Password field */}
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    placeholder={isLogin ? "Password" : "Enter your password"}
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 pr-12 bg-muted border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:border-ring focus:ring-1 focus:ring-ring transition-colors text-sm sm:text-base"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>

                            {/* Forgot password - Only for login */}
                            <div
                                className={`transition-all duration-500 ease-in-out overflow-hidden ${isLogin ? 'max-h-9 block' : 'max-h-0 hidden'
                                    }`}
                            >
                                <div className="text-right">
                                    <ForgotPassword />
                                </div>
                            </div>

                            {/* Terms checkbox - Only for signup */}
                            <div
                                className={`transition-all duration-500 ease-in-out overflow-hidden ${!isLogin ? 'max-h-16 opacity-100' : 'max-h-0 opacity-0'
                                    }`}
                            >
                                <div className="flex items-start gap-3">
                                    <input
                                        type="checkbox"
                                        id="terms"
                                        checked={agreedToTerms}
                                        onChange={(e) => setAgreedToTerms(e.target.checked)}
                                        className="mt-1 w-4 h-4 text-accent bg-muted border-border rounded focus:ring-ring focus:ring-2"
                                        required={!isLogin}
                                    />
                                    <label htmlFor="terms" className="text-xs sm:text-sm text-muted-foreground">
                                        I agree to the{" "}
                                        <button
                                            type="button"
                                            className="text-accent-foreground hover:text-neutral-600 transition-colors underline"
                                        >
                                            Terms & Conditions
                                        </button>
                                    </label>
                                </div>
                            </div>

                            {/* Submit button */}
                            <button
                                type="submit"
                                className="w-full py-2.5 sm:py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background transition-all duration-200 transform hover:scale-[1.02] text-sm sm:text-base"
                                onClick={handleSubmit}
                            >
                                {isLogin ? 'Sign in' : 'Create account'}
                            </button>

                            {/* Divider */}
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-border"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-2 bg-neutral-50 dark:bg-neutral-900 text-muted-foreground">
                                        Or {isLogin ? 'sign in' : 'register'} with
                                    </span>
                                </div>
                            </div>

                            {/* Social login buttons */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                <button
                                    type="button"
                                    onClick={() => handleSocialLogin("google")}
                                    className="flex items-center justify-center gap-2 py-2.5 sm:py-3 px-4 bg-muted border border-border rounded-lg text-foreground hover:bg-muted/80 focus:outline-none focus:ring-2 focus:ring-muted transition-colors text-sm sm:text-base"
                                >
                                    <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24">
                                        <path
                                            fill="currentColor"
                                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                        />
                                        <path
                                            fill="currentColor"
                                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                        />
                                        <path
                                            fill="currentColor"
                                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                        />
                                        <path
                                            fill="currentColor"
                                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                        />
                                    </svg>
                                    <span>Google</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleSocialLogin("apple")}
                                    className="flex items-center justify-center gap-2 py-2.5 sm:py-3 px-4 bg-muted border border-border rounded-lg text-foreground hover:bg-muted/80 focus:outline-none focus:ring-2 focus:ring-muted transition-colors text-sm sm:text-base"
                                >
                                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701" />
                                    </svg>
                                    <span>Apple</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}