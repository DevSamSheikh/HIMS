import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft, CreditCard, Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const BillingDetailsPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    cardName: "",
    cardNumber: "",
    expiryMonth: "",
    expiryYear: "",
    cvv: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "US",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      toast({
        title: "Payment successful",
        description: "Your subscription has been activated",
      });
      // Navigate to dashboard after successful payment
      navigate("/dashboard");
    }, 2000);
  };

  const handleBack = () => {
    navigate("/");
  };

  // Generate month options
  const months = Array.from({ length: 12 }, (_, i) => {
    const month = i + 1;
    return {
      value: month.toString().padStart(2, "0"),
      label: month.toString().padStart(2, "0"),
    };
  });

  // Generate year options (current year + 10 years)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => {
    const year = currentYear + i;
    return {
      value: year.toString(),
      label: year.toString(),
    };
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <Button variant="ghost" className="mb-6" onClick={handleBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to module selection
        </Button>

        <div className="mb-6">
          <h1 className="text-3xl font-bold">Billing Details</h1>
          <p className="text-muted-foreground mt-2">
            Enter your payment information to complete your subscription
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="bg-white p-6 rounded-lg border shadow-sm">
                <h2 className="text-xl font-semibold mb-4">
                  Payment Information
                </h2>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="cardName">Name on Card</Label>
                    <Input
                      id="cardName"
                      name="cardName"
                      value={formData.cardName}
                      onChange={handleChange}
                      placeholder="John Doe"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <Input
                      id="cardNumber"
                      name="cardNumber"
                      value={formData.cardNumber}
                      onChange={handleChange}
                      placeholder="4242 4242 4242 4242"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-1">
                      <Label htmlFor="expiryMonth">Expiry Month</Label>
                      <Select
                        value={formData.expiryMonth}
                        onValueChange={(value) =>
                          handleSelectChange("expiryMonth", value)
                        }
                      >
                        <SelectTrigger id="expiryMonth">
                          <SelectValue placeholder="MM" />
                        </SelectTrigger>
                        <SelectContent>
                          {months.map((month) => (
                            <SelectItem key={month.value} value={month.value}>
                              {month.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="col-span-1">
                      <Label htmlFor="expiryYear">Expiry Year</Label>
                      <Select
                        value={formData.expiryYear}
                        onValueChange={(value) =>
                          handleSelectChange("expiryYear", value)
                        }
                      >
                        <SelectTrigger id="expiryYear">
                          <SelectValue placeholder="YYYY" />
                        </SelectTrigger>
                        <SelectContent>
                          {years.map((year) => (
                            <SelectItem key={year.value} value={year.value}>
                              {year.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="col-span-1">
                      <Label htmlFor="cvv">CVV</Label>
                      <Input
                        id="cvv"
                        name="cvv"
                        value={formData.cvv}
                        onChange={handleChange}
                        placeholder="123"
                        required
                        maxLength={4}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg border shadow-sm">
                <h2 className="text-xl font-semibold mb-4">Billing Address</h2>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="123 Main St"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        placeholder="New York"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="state">State/Province</Label>
                      <Input
                        id="state"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        placeholder="NY"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="zipCode">ZIP/Postal Code</Label>
                      <Input
                        id="zipCode"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleChange}
                        placeholder="10001"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="country">Country</Label>
                      <Select
                        value={formData.country}
                        onValueChange={(value) =>
                          handleSelectChange("country", value)
                        }
                      >
                        <SelectTrigger id="country">
                          <SelectValue placeholder="Select country" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="US">United States</SelectItem>
                          <SelectItem value="CA">Canada</SelectItem>
                          <SelectItem value="UK">United Kingdom</SelectItem>
                          <SelectItem value="AU">Australia</SelectItem>
                          <SelectItem value="IN">India</SelectItem>
                          <SelectItem value="PK">Pakistan</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isProcessing}>
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing Payment...
                  </>
                ) : (
                  <>
                    <CreditCard className="mr-2 h-4 w-4" />
                    Complete Payment
                  </>
                )}
              </Button>
            </form>
          </div>

          <div>
            <div className="bg-white p-6 rounded-lg border shadow-sm sticky top-6">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>Subscription</span>
                  <span>$99.99</span>
                </div>
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>-$10.00</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>$89.99</span>
                </div>
                <div className="text-xs text-gray-500">
                  You will be charged monthly until you cancel your
                  subscription.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillingDetailsPage;
