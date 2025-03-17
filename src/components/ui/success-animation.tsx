import React, { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import LottiePlayer from "./lottie-player";

interface SuccessAnimationProps {
  isOpen: boolean;
  onClose: () => void;
  animationType?: "confetti" | "goal" | "checkmark";
  message?: string;
}

const SuccessAnimation = ({
  isOpen,
  onClose,
  animationType = "confetti",
  message = "Success!",
}: SuccessAnimationProps) => {
  const [open, setOpen] = useState(isOpen);

  useEffect(() => {
    setOpen(isOpen);
    if (isOpen) {
      // Auto close after animation completes
      const timer = setTimeout(() => {
        setOpen(false);
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  const getAnimationSrc = () => {
    switch (animationType) {
      case "goal":
        return "https://assets5.lottiefiles.com/packages/lf20_qm8eqzse.json";
      case "confetti":
        return "https://assets2.lottiefiles.com/packages/lf20_touohxv0.json";
      case "checkmark":
      default:
        return "https://assets1.lottiefiles.com/packages/lf20_s2lryxtd.json";
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md bg-transparent border-none shadow-none">
        <div className="flex flex-col items-center justify-center">
          <div className="w-64 h-64">
            <LottiePlayer
              src={getAnimationSrc()}
              background="transparent"
              speed={1}
              style={{ width: "100%", height: "100%" }}
              autoplay={true}
              loop={false}
            />
          </div>
          <p className="text-xl font-bold text-white mt-4">{message}</p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SuccessAnimation;
