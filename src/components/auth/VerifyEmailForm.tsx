import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft, Loader2, Mail, CheckCircle } from "lucide-react";
import AuthLayout from "./AuthLayout";

const VerifyEmailForm = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  // Simulate verification check
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");

    if (token) {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        setIsVerified(true);
        toast({
          title: "Email verified",
          description: "Your email has been successfully verified",
        });
      }, 1500);
    }
  }, []);

  // Countdown for resend button
  useEffect(() => {
    if (countdown > 0 && !canResend) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0 && !canResend) {
      setCanResend(true);
    }
  }, [countdown, canResend]);

  const handleResendVerification = () => {
    setIsLoading(true);
    setCanResend(false);
    setCountdown(60);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Verification email resent",
        description: "Please check your inbox for the verification link",
      });
    }, 1500);
  };

  return (
    <AuthLayout
      title={isVerified ? "Email Verified" : "Verify your email"}
      subtitle={
        isVerified
          ? "Your email has been successfully verified"
          : "We've sent a verification link to your email address"
      }
      image="https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=800&q=80"
    >
      <div className="flex flex-col items-center justify-center py-6 space-y-6">
        {isLoading ? (
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="h-16 w-16 animate-spin text-primary" />
            <p className="text-center text-muted-foreground">
              Verifying your email...
            </p>
          </div>
        ) : isVerified ? (
          <div className="flex flex-col items-center space-y-6">
            <div className="h-16 w-16 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-300" />
            </div>
            <p className="text-center text-muted-foreground">
              Your account is now active. You can now log in to access your
              dashboard.
            </p>
            <Button className="w-full h-11" asChild>
              <Link to="/login">Go to Login</Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="h-16 w-16 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
              <Mail className="h-8 w-8 text-blue-600 dark:text-blue-300" />
            </div>
            <p className="text-center text-muted-foreground">
              Please check your email inbox and click on the verification link
              to complete your registration. If you don't see the email, check
              your spam folder.
            </p>
            <Button
              variant="outline"
              className="w-full h-11"
              onClick={handleResendVerification}
              disabled={isLoading || !canResend}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : !canResend ? (
                `Resend email (${countdown}s)`
              ) : (
                "Resend verification email"
              )}
            </Button>

            <Link
              to="/login"
              className="text-primary font-medium hover:underline flex items-center justify-center mt-4"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to login
            </Link>
          </>
        )}
      </div>
    </AuthLayout>
  );
};

export default VerifyEmailForm;
