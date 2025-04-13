import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { PhoneInput } from "@/components/ui/phone-input";
import {
  Eye,
  EyeOff,
  Loader2,
  ArrowRight,
  ArrowLeft,
  Check,
  X,
} from "lucide-react";
import AuthLayoutWithSlider from "./AuthLayoutWithSlider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import ModuleSelection from "../modules/ModuleSelection";

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  password?: string;
}

const SignupForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [currentStep, setCurrentStep] = useState<"account" | "modules">(
    "account",
  );
  const [selectedModules, setSelectedModules] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Password validation states
  const [passwordValidation, setPasswordValidation] = useState({
    minLength: false,
    hasUppercase: false,
    hasLowercase: false,
    hasNumber: false,
    hasSpecial: false,
  });

  // Update password validation on password change
  useEffect(() => {
    const password = formData.password;
    setPasswordValidation({
      minLength: password.length >= 8,
      hasUppercase: /[A-Z]/.test(password),
      hasLowercase: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    });
  }, [formData.password]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  const handlePhoneChange = (value: string) => {
    setFormData((prev) => ({ ...prev, phone: value }));
    validateField("phone", value);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    validateField(name, formData[name as keyof typeof formData]);
  };

  const handlePhoneBlur = () => {
    setTouched((prev) => ({ ...prev, phone: true }));
    validateField("phone", formData.phone);
  };

  const validateField = (name: string, value: string) => {
    let newErrors = { ...errors };

    switch (name) {
      case "name":
        if (!value.trim()) {
          newErrors.name = "Full name is required";
        } else if (value.length < 3) {
          newErrors.name = "Name must be at least 3 characters";
        } else {
          delete newErrors.name;
        }
        break;

      case "email":
        if (!value.trim()) {
          newErrors.email = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          newErrors.email = "Please enter a valid email address";
        } else {
          delete newErrors.email;
        }
        break;

      case "phone":
        // Phone validation is now handled by the PhoneInput component
        if (!value.trim()) {
          newErrors.phone = "Phone number is required";
        } else {
          delete newErrors.phone;
        }
        break;

      case "password":
        if (!value) {
          newErrors.password = "Password is required";
        } else if (value.length < 8) {
          newErrors.password = "Password must be at least 8 characters";
        } else if (!/[A-Z]/.test(value)) {
          newErrors.password = "Password must contain an uppercase letter";
        } else if (!/[a-z]/.test(value)) {
          newErrors.password = "Password must contain a lowercase letter";
        } else if (!/[0-9]/.test(value)) {
          newErrors.password = "Password must contain a number";
        } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
          newErrors.password = "Password must contain a special character";
        } else {
          delete newErrors.password;
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateForm = () => {
    let isValid = true;
    let newErrors: FormErrors = {};
    let allTouched: Record<string, boolean> = {};

    // Mark all fields as touched
    Object.keys(formData).forEach((key) => {
      allTouched[key] = true;
      const value = formData[key as keyof typeof formData];
      if (!validateField(key, value)) {
        isValid = false;
      }
    });

    setTouched(allTouched);
    return isValid;
  };

  const handleModuleSelection = (modules: string[]) => {
    setSelectedModules(modules);
    // Move to next step or complete signup
    handleSubmit();
  };

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        // Navigate to the separate module selection page instead of changing step
        navigate("/module-selection");
      } catch (error) {
        console.error("Navigation error:", error);
        toast({
          title: "Navigation error",
          description:
            "There was a problem navigating to the module selection page",
          variant: "destructive",
        });
      }
    }
  };

  const handleBackToAccount = () => {
    setCurrentStep("account");
  };

  const sendVerificationEmail = async (email: string) => {
    // Simulate sending verification email
    console.log(`Sending verification email to ${email}`);
    // In a real implementation, this would call an API endpoint
    return true;
  };

  const handleSubmit = async () => {
    setIsLoading(true);

    try {
      // Simulate API call for registration
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Instead of verification email, redirect to dashboard directly
      toast({
        title: "Account created successfully",
        description: "Welcome to your healthcare dashboard",
      });

      try {
        navigate("/");
      } catch (error) {
        console.error("Navigation error:", error);
        toast({
          title: "Navigation error",
          description: "There was a problem navigating to the dashboard",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Signup error:", error);
      toast({
        title: "Error creating account",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getInputClassName = (fieldName: string) => {
    return `h-11 ${touched[fieldName] && errors[fieldName] ? "border-red-500 focus-visible:ring-red-500" : ""}`;
  };

  return (
    <AuthLayoutWithSlider
      title={
        currentStep === "account" ? "Create your account" : "Select modules"
      }
      subtitle={
        currentStep === "account"
          ? "Enter your information to create an account"
          : "Choose the modules you need for your healthcare facility"
      }
      className={currentStep === "modules" ? "w-full" : ""}
      currentStep={currentStep}
    >
      <div className={currentStep === "account" ? "block" : "hidden"}>
        <form onSubmit={handleNextStep} className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              name="name"
              placeholder="John Doe"
              value={formData.name}
              onChange={handleChange}
              onBlur={handleBlur}
              className={getInputClassName("name")}
            />
            {touched.name && errors.name && (
              <p className="text-sm text-red-500 mt-1">{errors.name}</p>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="text"
              placeholder="name@example.com"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              className={getInputClassName("email")}
            />
            {touched.email && errors.email && (
              <p className="text-sm text-red-500 mt-1">{errors.email}</p>
            )}
          </div>

          <PhoneInput
            id="phone"
            name="phone"
            label="Phone Number"
            value={formData.phone}
            onChange={handlePhoneChange}
            onBlur={handlePhoneBlur}
            error={touched.phone && errors.phone ? errors.phone : undefined}
            required
          />

          <div className="space-y-1">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                onBlur={handleBlur}
                className={getInputClassName("password")}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
                <span className="sr-only">
                  {showPassword ? "Hide password" : "Show password"}
                </span>
              </Button>
            </div>
            {touched.password && errors.password && (
              <p className="text-sm text-red-500 mt-1">{errors.password}</p>
            )}

            {/* Password strength indicators in popover */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="link"
                  className="h-auto p-0 text-xs text-gray-500 mt-1"
                >
                  Password requirements
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-4">
                <div className="space-y-2">
                  <h4 className="font-medium text-sm mb-2">
                    Password must have:
                  </h4>
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-4 h-4 rounded-full flex items-center justify-center ${passwordValidation.minLength ? "bg-green-500" : "bg-gray-300"}`}
                      >
                        {passwordValidation.minLength ? (
                          <Check className="h-3 w-3 text-white" />
                        ) : (
                          <X className="h-3 w-3 text-white" />
                        )}
                      </div>
                      <span className="text-xs text-gray-600">
                        At least 8 characters
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-4 h-4 rounded-full flex items-center justify-center ${passwordValidation.hasUppercase ? "bg-green-500" : "bg-gray-300"}`}
                      >
                        {passwordValidation.hasUppercase ? (
                          <Check className="h-3 w-3 text-white" />
                        ) : (
                          <X className="h-3 w-3 text-white" />
                        )}
                      </div>
                      <span className="text-xs text-gray-600">
                        At least one uppercase letter
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-4 h-4 rounded-full flex items-center justify-center ${passwordValidation.hasLowercase ? "bg-green-500" : "bg-gray-300"}`}
                      >
                        {passwordValidation.hasLowercase ? (
                          <Check className="h-3 w-3 text-white" />
                        ) : (
                          <X className="h-3 w-3 text-white" />
                        )}
                      </div>
                      <span className="text-xs text-gray-600">
                        At least one lowercase letter
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-4 h-4 rounded-full flex items-center justify-center ${passwordValidation.hasNumber ? "bg-green-500" : "bg-gray-300"}`}
                      >
                        {passwordValidation.hasNumber ? (
                          <Check className="h-3 w-3 text-white" />
                        ) : (
                          <X className="h-3 w-3 text-white" />
                        )}
                      </div>
                      <span className="text-xs text-gray-600">
                        At least one number
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-4 h-4 rounded-full flex items-center justify-center ${passwordValidation.hasSpecial ? "bg-green-500" : "bg-gray-300"}`}
                      >
                        {passwordValidation.hasSpecial ? (
                          <Check className="h-3 w-3 text-white" />
                        ) : (
                          <X className="h-3 w-3 text-white" />
                        )}
                      </div>
                      <span className="text-xs text-gray-600">
                        At least one special character
                      </span>
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>

          <Button
            type="submit"
            className="w-full h-11 mt-6"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                Continue to Module Selection
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>

          <div className="text-center text-sm">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-primary font-medium hover:underline"
            >
              Sign in
            </Link>
          </div>
        </form>
      </div>

      <div className={currentStep === "modules" ? "block w-full" : "hidden"}>
        <Button variant="ghost" className="mb-4" onClick={handleBackToAccount}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to account details
        </Button>
        <div className="w-full max-w-full mx-auto">
          <ModuleSelection onComplete={handleModuleSelection} />
        </div>
      </div>
    </AuthLayoutWithSlider>
  );
};

export default SignupForm;
