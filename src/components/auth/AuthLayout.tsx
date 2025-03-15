import React from "react";
import { cn } from "@/lib/utils";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  image?: string;
  className?: string;
  currentStep?: "account" | "modules";
}

const AuthLayout = ({
  children,
  title,
  subtitle,
  image = "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&q=80",
  className,
  currentStep = "account",
}: AuthLayoutProps) => {
  return (
    <div className="min-h-screen w-full bg-background flex flex-col md:flex-row overflow-hidden">
      {/* Image Column - Hidden on small screens and when on modules step */}
      <div
        className={`hidden ${currentStep === "modules" ? "" : "md:block"} md:w-1/2 bg-primary/10 relative`}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5">
          <img
            src={image}
            alt="Healthcare professionals"
            className="w-full h-full object-cover mix-blend-overlay"
            loading="eager"
          />
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/60 to-transparent text-white">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-10 w-10 rounded-md bg-primary text-primary-foreground flex items-center justify-center font-bold text-xl">
              H
            </div>
            <span className="font-semibold text-xl">HIMS</span>
          </div>
          <h2 className="text-2xl font-bold mb-2">
            Healthcare Information Management System
          </h2>
          <p className="text-sm text-white/80">
            A comprehensive solution for healthcare facilities to manage patient
            data, appointments, billing, and administrative tasks efficiently.
          </p>
        </div>
      </div>

      {/* Form Column */}
      <div
        className={cn(
          "w-full md:w-1/2 p-4 sm:p-6 flex items-center justify-center overflow-y-auto max-h-screen",
          currentStep === "modules" ? "md:w-full" : "",
          className,
        )}
      >
        <div className="w-full max-w-md space-y-6">
          {/* Mobile Logo - Visible only on small screens */}
          <div className="md:hidden flex items-center gap-2 mb-6">
            <div className="h-10 w-10 rounded-md bg-primary text-primary-foreground flex items-center justify-center font-bold text-xl">
              H
            </div>
            <span className="font-semibold text-xl">HIMS</span>
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              {title}
            </h1>
            {subtitle && (
              <p className="text-sm sm:text-base text-muted-foreground">
                {subtitle}
              </p>
            )}
          </div>

          <div className="mt-6">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
