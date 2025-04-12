import React, { useState } from "react";
import ModuleSelection from "./ModuleSelection";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

interface ModuleSelectionPageProps {
  onComplete?: (selectedModules: string[]) => void;
  showBackButton?: boolean;
}

const ModuleSelectionPage = ({
  onComplete,
  showBackButton = true,
}: ModuleSelectionPageProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleBack = () => {
    navigate(-1);
  };

  const handleComplete = async (selectedModules: string[]) => {
    setIsLoading(true);

    try {
      // Simulate API call for module selection
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast({
        title: "Modules selected",
        description: `${selectedModules.length} modules have been selected`,
      });

      // The actual navigation happens in the PricingSummary component
      // This is just a callback for any additional processing
    } catch (error) {
      toast({
        title: "Error selecting modules",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-background"
      style={{ height: "100vh", overflowY: "auto" }}
    >
      <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {showBackButton && (
          <Button variant="ghost" className="mb-6" onClick={handleBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        )}

        <div className="mb-6">
          <h1 className="text-3xl font-bold">Module Selection</h1>
          <p className="text-muted-foreground mt-2">
            Choose the modules you need for your healthcare facility
          </p>
        </div>

        <ModuleSelection onComplete={handleComplete} />
      </div>
    </div>
  );
};

export default ModuleSelectionPage;
