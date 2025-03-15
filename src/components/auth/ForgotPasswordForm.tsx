import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft, Loader2, Mail } from "lucide-react";
import AuthLayout from "./AuthLayout";

const ForgotPasswordForm = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [email, setEmail] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
      toast({
        title: "Reset link sent",
        description: `We've sent a password reset link to ${email}`,
      });
    }, 1500);
  };

  return (
    <AuthLayout
      title={isSubmitted ? "Check your email" : "Forgot password"}
      subtitle={
        isSubmitted
          ? `We've sent a password reset link to ${email}`
          : "Enter your email and we'll send you a link to reset your password"
      }
      image="https://images.unsplash.com/photo-1638202993928-7d113595e05b?w=800&q=80"
    >
      {isSubmitted ? (
        <div className="flex flex-col items-center justify-center py-6 space-y-6">
          <div className="h-16 w-16 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
            <Mail className="h-8 w-8 text-green-600 dark:text-green-300" />
          </div>
          <p className="text-center text-muted-foreground">
            If you don't see the email in your inbox, check your spam folder or
            request another link below.
          </p>
          <Button
            variant="outline"
            className="w-full h-11"
            onClick={() => setIsSubmitted(false)}
          >
            Resend email
          </Button>

          <Link
            to="/login"
            className="text-primary font-medium hover:underline flex items-center justify-center mt-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to login
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="h-11"
            />
          </div>

          <Button type="submit" className="w-full h-11" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending reset link...
              </>
            ) : (
              "Send reset link"
            )}
          </Button>

          <div className="text-center">
            <Link
              to="/login"
              className="text-primary font-medium hover:underline flex items-center justify-center"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to login
            </Link>
          </div>
        </form>
      )}
    </AuthLayout>
  );
};

export default ForgotPasswordForm;
