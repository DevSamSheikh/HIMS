import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, Upload, User } from "lucide-react";

interface ProfileImageUploadProps {
  initialImage?: string;
  onImageChange: (imageUrl: string) => void;
  name?: string;
  size?: "small" | "medium" | "large";
}

const ProfileImageUpload: React.FC<ProfileImageUploadProps> = ({
  initialImage,
  onImageChange,
  name = "",
  size = "medium",
}) => {
  const [image, setImage] = useState<string | undefined>(initialImage);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("");
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImage(result);
        onImageChange(result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Size configurations
  const sizeClasses = {
    small: {
      avatar: "h-16 w-16",
      icon: "h-4 w-4",
      button: "text-xs",
      showButton: false,
    },
    medium: {
      avatar: "h-24 w-24",
      icon: "h-6 w-6",
      button: "text-sm",
      showButton: true,
    },
    large: {
      avatar: "h-32 w-32",
      icon: "h-10 w-10",
      button: "text-base",
      showButton: true,
    },
  };

  const classes = sizeClasses[size];

  return (
    <div
      className={`flex ${classes.showButton ? "flex-col" : ""} items-center gap-3`}
    >
      <div className="relative cursor-pointer group" onClick={handleImageClick}>
        <Avatar className={`${classes.avatar} border-2 border-primary/20`}>
          <AvatarImage src={image} alt={name} />
          <AvatarFallback className="text-lg bg-primary/10">
            {name ? (
              getInitials(name)
            ) : (
              <User className={classes.icon + " text-muted-foreground"} />
            )}
          </AvatarFallback>
        </Avatar>
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
          <Camera className={`${classes.icon} text-white`} />
        </div>
      </div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
      {classes.showButton && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          className={`flex items-center gap-2 ${classes.button}`}
          onClick={handleImageClick}
        >
          <Upload className="h-4 w-4" />
          Upload Photo
        </Button>
      )}
    </div>
  );
};

export default ProfileImageUpload;
