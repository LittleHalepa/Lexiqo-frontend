import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import OTPInput from "./UI/Input-opt";
import { useUser } from "../contexts/userContext";
import  MailAnimatedIcon  from "./UI/MailAnimationIcon";
import { useRef } from "react";
import type { MailAnimatedIconRef } from "./UI/MailAnimationIcon";

export default function VerifyEmail() {

    const { publicId } = useParams<{ publicId: string }>();
    const [value, setValue] = useState<string>("");
    const [error, setError] = useState<string | null>(null);
    const [isSending, setIsSending] = useState<number>(0);

    const nav = useNavigate();
    const { user, setUser } = useUser();

    const iconRef = useRef<MailAnimatedIconRef>(null);

    useEffect(() => {
        let interval: NodeJS.Timeout | null = null;
        if (isSending > 0) {
            interval = setInterval(() => {
                setIsSending(prev => {
                    if (prev <= 1) {
                        clearInterval(interval!);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isSending]);

    useEffect(() => {
        iconRef.current?.playAnimation(500);
    }, []);

    async function handelSendCode() {

        if (isSending) return;
        setIsSending(30);

        try {

            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/send-verification-code`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: user?.email
                }),
            });

            if (!response.ok) {
                setError('Error occurred when sending code.');
            } 

        } catch (error) {
            console.error('Error occurred when sending code: ', error);
            setError('Something went wrong. Server error.');
        }

    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-white relative max-w-6xl mx-auto p-3 sm:p-5 pt-15">
            <div className="rounded-2xl bg-white shadow-lg p-3 sm:p-10 w-full max-w-md flex flex-col items-center">
                <div className="flex justify-center items-center rounded-full bg-[#E9D4FF] mb-10 p-2">
                    <MailAnimatedIcon ref={iconRef} size={60}/>
                </div>
                <h1 className="text-2xl font-bold text-center mb-4 text-brand">Verify Your Email</h1>
                <p className="text-xs text-gray-500 text-center leading-5 mb-8">We've sent a 6-digit verification code to <span className="font-semibold text-black">{user?.email}</span></p>
                <OTPInput
                  length={6}
                  value={value}
                  onChange={setValue}
                  onComplete={ async (code) => {
                    try {
                        console.log("Verifying code:", code, "for email:", user?.email);

                        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/verify-code`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            credentials: 'include',
                            body: JSON.stringify({ 
                            email: user?.email, 
                            code 
                            })
                        });
                        const data = await res.json();

                        if (!data.error) {
                            console.log('Email verified!');

                            if (user) {
                                setUser({
                                    ...user,
                                    is_verified: true
                                });
                            }

                            nav(`/user/${publicId}/dashboard/home`);
                        } else {
                            if (data.message === 'Invalid verification code') {
                                setError('The code you entered is incorrect. Please try again.');
                            } else {
                                setError('Something went wrong. Please try again later.');
                                console.log('Verification error:', data.message);
                            }
                        }
                        } catch (err) {
                        console.error('Failed to verify code', err);
                        alert('Failed to verify code. Try again.');
                        }
                  }}
                />
                {error && <p className="text-red-500 text-xs mt-4">{error}</p>}
                <p className="text-xs text-gray-500 text-center mt-8">Didn't receive the code? </p>
                <button
                    className={`text-brand text-xs font-semibold p-3 mt-4 bg-white active:bg-gray-100 rounded-lg hover:bg-gray-100 hover:opacity-80 cursor-pointer transition-all duration-200 ${isSending ? "bg-gray-300 text-gray-500 active:translate-x-1" : "bg-white text-brand"}`}
                    onClick={handelSendCode}
                    disabled={isSending !== 0}
                    >
                    {isSending !== 0
                        ? `Resend Code (${isSending}s)`
                        : 'Resend Code'
                    }
                </button>
                <p className="text-center text-xs text-gray-500 mt-8">Check your spam folder if you don't see the email.</p>
                <p className="text-center text-xs text-gray-500 mt-1">The code expires in 5 minutes.</p>
            </div>
        </div>
    );

}