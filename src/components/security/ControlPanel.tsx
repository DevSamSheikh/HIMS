import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Settings,
  FileText,
  Printer,
  Columns,
  Layout,
  Image,
  Building,
  Users,
  ShieldCheck,
  Save,
  Upload,
  RefreshCw,
  Eye,
  EyeOff,
  Trash2,
  Plus,
  PanelLeft,
  PanelRight,
  PanelTop,
  PanelBottom,
  Palette,
  FileSpreadsheet,
  FileBarChart,
  ShoppingCart,
  ArrowLeftRight,
  CreditCard,
  Truck,
  BarChart,
  Layers,
  Edit,
  Sliders,
} from "lucide-react";

const ControlPanel = () => {
  const [activeTab, setActiveTab] = useState("forms");

  return (
    <div className="w-full h-full bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Control Panel</h1>
            <p className="text-muted-foreground mt-1">
              Customize and manage your entire system from one place
            </p>
          </div>
          <Button>
            <Save className="mr-2 h-4 w-4" />
            Save Changes
          </Button>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-4"
        >
          <TabsList className="grid grid-cols-5 w-full">
            <TabsTrigger value="forms" className="flex items-center gap-2">
              <Columns className="h-4 w-4" />
              <span>Form Customization</span>
            </TabsTrigger>
            <TabsTrigger value="invoices" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span>Invoice Settings</span>
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center gap-2">
              <FileBarChart className="h-4 w-4" />
              <span>Report Designs</span>
            </TabsTrigger>
            <TabsTrigger value="branches" className="flex items-center gap-2">
              <Building className="h-4 w-4" />
              <span>Projects & Branches</span>
            </TabsTrigger>
            <TabsTrigger value="appearance" className="flex items-center gap-2">
              <Palette className="h-4 w-4" />
              <span>Appearance</span>
            </TabsTrigger>
          </TabsList>

          {/* Form Customization Tab */}
          <TabsContent value="forms" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Form Visibility Settings</CardTitle>
                <CardDescription>
                  Control which forms and fields are visible to different user
                  roles
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label className="text-base font-medium">
                        Select Module
                      </Label>
                    </div>
                    <Select defaultValue="sales">
                      <SelectTrigger>
                        <SelectValue placeholder="Select module" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sales">
                          <div className="flex items-center gap-2">
                            <ShoppingCart className="h-4 w-4" />
                            <span>Sales</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="purchases">
                          <div className="flex items-center gap-2">
                            <Truck className="h-4 w-4" />
                            <span>Purchases</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="inventory">
                          <div className="flex items-center gap-2">
                            <Layers className="h-4 w-4" />
                            <span>Inventory</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="billing">
                          <div className="flex items-center gap-2">
                            <CreditCard className="h-4 w-4" />
                            <span>Billing</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="reports">
                          <div className="flex items-center gap-2">
                            <BarChart className="h-4 w-4" />
                            <span>Reports</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label className="text-base font-medium">
                        Select Form
                      </Label>
                    </div>
                    <Select defaultValue="salesInvoice">
                      <SelectTrigger>
                        <SelectValue placeholder="Select form" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="salesInvoice">
                          Sales Invoice
                        </SelectItem>
                        <SelectItem value="salesReturn">
                          Sales Return
                        </SelectItem>
                        <SelectItem value="salesReport">
                          Sales Report
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label className="text-base font-medium">User Role</Label>
                    </div>
                    <Select defaultValue="all">
                      <SelectTrigger>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Users</SelectItem>
                        <SelectItem value="admin">Administrators</SelectItem>
                        <SelectItem value="manager">Managers</SelectItem>
                        <SelectItem value="staff">Staff</SelectItem>
                        <SelectItem value="cashier">Cashiers</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Separator className="my-6" />

                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">
                      Sales Invoice Form Fields
                    </h3>
                    <Button variant="outline" size="sm">
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Reset to Default
                    </Button>
                  </div>

                  <ScrollArea className="h-[400px] pr-4">
                    <div className="space-y-4">
                      <Card>
                        <CardHeader className="py-3">
                          <CardTitle className="text-base">
                            Header Section
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-center space-x-2">
                              <Checkbox id="invoice-number" defaultChecked />
                              <Label htmlFor="invoice-number">
                                Invoice Number
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox id="invoice-date" defaultChecked />
                              <Label htmlFor="invoice-date">Invoice Date</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox id="customer-name" defaultChecked />
                              <Label htmlFor="customer-name">
                                Customer Name
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox id="customer-address" defaultChecked />
                              <Label htmlFor="customer-address">
                                Customer Address
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox id="customer-phone" defaultChecked />
                              <Label htmlFor="customer-phone">
                                Customer Phone
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox id="customer-email" />
                              <Label htmlFor="customer-email">
                                Customer Email
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox id="reference-number" />
                              <Label htmlFor="reference-number">
                                Reference Number
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox id="payment-terms" />
                              <Label htmlFor="payment-terms">
                                Payment Terms
                              </Label>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="py-3">
                          <CardTitle className="text-base">
                            Item Table Columns
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="flex items-center space-x-2">
                              <Checkbox id="item-code" defaultChecked />
                              <Label htmlFor="item-code">Item Code</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox id="item-name" defaultChecked />
                              <Label htmlFor="item-name">Item Name</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox id="batch-number" defaultChecked />
                              <Label htmlFor="batch-number">Batch Number</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox id="expiry-date" defaultChecked />
                              <Label htmlFor="expiry-date">Expiry Date</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox id="quantity" defaultChecked />
                              <Label htmlFor="quantity">Quantity</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox id="unit" defaultChecked />
                              <Label htmlFor="unit">Unit</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox id="unit-price" defaultChecked />
                              <Label htmlFor="unit-price">Unit Price</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox id="discount" defaultChecked />
                              <Label htmlFor="discount">Discount</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox id="tax" defaultChecked />
                              <Label htmlFor="tax">Tax</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox id="amount" defaultChecked />
                              <Label htmlFor="amount">Amount</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox id="manufacturer" />
                              <Label htmlFor="manufacturer">Manufacturer</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox id="rack-location" />
                              <Label htmlFor="rack-location">
                                Rack Location
                              </Label>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="py-3">
                          <CardTitle className="text-base">
                            Footer Section
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-center space-x-2">
                              <Checkbox id="subtotal" defaultChecked />
                              <Label htmlFor="subtotal">Subtotal</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox id="discount-total" defaultChecked />
                              <Label htmlFor="discount-total">
                                Discount Total
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox id="tax-total" defaultChecked />
                              <Label htmlFor="tax-total">Tax Total</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox id="grand-total" defaultChecked />
                              <Label htmlFor="grand-total">Grand Total</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox id="amount-in-words" defaultChecked />
                              <Label htmlFor="amount-in-words">
                                Amount in Words
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox id="payment-method" defaultChecked />
                              <Label htmlFor="payment-method">
                                Payment Method
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox id="notes" />
                              <Label htmlFor="notes">Notes</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox id="terms-conditions" />
                              <Label htmlFor="terms-conditions">
                                Terms & Conditions
                              </Label>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </ScrollArea>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Invoice Settings Tab */}
          <TabsContent value="invoices" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Invoice Template Settings</CardTitle>
                <CardDescription>
                  Customize the appearance and content of your invoices
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label className="text-base font-medium">
                        Select Document Type
                      </Label>
                    </div>
                    <Select defaultValue="salesInvoice">
                      <SelectTrigger>
                        <SelectValue placeholder="Select document type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="salesInvoice">
                          Sales Invoice
                        </SelectItem>
                        <SelectItem value="salesReturn">
                          Sales Return
                        </SelectItem>
                        <SelectItem value="purchaseOrder">
                          Purchase Order
                        </SelectItem>
                        <SelectItem value="purchaseInvoice">
                          Purchase Invoice
                        </SelectItem>
                        <SelectItem value="purchaseReturn">
                          Purchase Return
                        </SelectItem>
                        <SelectItem value="quotation">Quotation</SelectItem>
                        <SelectItem value="receipt">Receipt</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="col-span-1">
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">
                        Company Information
                      </h3>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="company-logo">Company Logo</Label>
                          <div className="flex items-center gap-4">
                            <div className="h-20 w-20 rounded-md border flex items-center justify-center bg-muted">
                              <Image className="h-8 w-8 text-muted-foreground" />
                            </div>
                            <Button variant="outline" size="sm">
                              <Upload className="mr-2 h-4 w-4" />
                              Upload Logo
                            </Button>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="company-name">Company Name</Label>
                          <Input
                            id="company-name"
                            defaultValue="Healthcare Information Management System"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="company-address">
                            Company Address
                          </Label>
                          <Textarea
                            id="company-address"
                            defaultValue="123 Medical Plaza, Healthcare District, City, Country"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="company-contact">
                            Contact Information
                          </Label>
                          <Input
                            id="company-contact"
                            defaultValue="Phone: +1 234 567 8900, Email: info@hims.com"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="company-registration">
                            Registration/Tax Numbers
                          </Label>
                          <Input
                            id="company-registration"
                            defaultValue="Reg No: 12345, Tax ID: TX-67890"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-span-1">
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Layout Settings</h3>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label>Header Position</Label>
                          <div className="grid grid-cols-2 gap-2">
                            <Button variant="outline" className="justify-start">
                              <PanelTop className="mr-2 h-4 w-4" />
                              Top Centered
                            </Button>
                            <Button variant="outline" className="justify-start">
                              <PanelLeft className="mr-2 h-4 w-4" />
                              Left Aligned
                            </Button>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>Footer Position</Label>
                          <div className="grid grid-cols-2 gap-2">
                            <Button variant="outline" className="justify-start">
                              <PanelBottom className="mr-2 h-4 w-4" />
                              Bottom Centered
                            </Button>
                            <Button variant="outline" className="justify-start">
                              <PanelRight className="mr-2 h-4 w-4" />
                              Right Aligned
                            </Button>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>Paper Size</Label>
                          <Select defaultValue="a4">
                            <SelectTrigger>
                              <SelectValue placeholder="Select paper size" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="a4">A4</SelectItem>
                              <SelectItem value="letter">Letter</SelectItem>
                              <SelectItem value="legal">Legal</SelectItem>
                              <SelectItem value="a5">A5</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Orientation</Label>
                          <Select defaultValue="portrait">
                            <SelectTrigger>
                              <SelectValue placeholder="Select orientation" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="portrait">Portrait</SelectItem>
                              <SelectItem value="landscape">
                                Landscape
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch id="show-watermark" />
                          <Label htmlFor="show-watermark">Show Watermark</Label>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-span-1">
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Content Settings</h3>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="invoice-title">Document Title</Label>
                          <Input
                            id="invoice-title"
                            defaultValue="Sales Invoice"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="invoice-prefix">
                            Document Number Prefix
                          </Label>
                          <Input id="invoice-prefix" defaultValue="INV-" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="terms-conditions">
                            Terms & Conditions
                          </Label>
                          <Textarea
                            id="terms-conditions"
                            rows={4}
                            defaultValue="1. All items sold are non-returnable.\n2. Payment is due within 30 days.\n3. Warranty as per manufacturer's policy."
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="footer-text">Footer Text</Label>
                          <Input
                            id="footer-text"
                            defaultValue="Thank you for your business!"
                          />
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch id="show-signature" defaultChecked />
                          <Label htmlFor="show-signature">
                            Show Signature Line
                          </Label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator className="my-6" />

                <div className="flex justify-between">
                  <Button variant="outline">
                    <Eye className="mr-2 h-4 w-4" />
                    Preview Template
                  </Button>
                  <div className="space-x-2">
                    <Button variant="outline">
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Reset to Default
                    </Button>
                    <Button>
                      <Save className="mr-2 h-4 w-4" />
                      Save Template
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Report Designs Tab */}
          <TabsContent value="reports" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Report Design Settings</CardTitle>
                <CardDescription>
                  Customize the appearance and content of your reports
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label className="text-base font-medium">
                        Select Report Type
                      </Label>
                    </div>
                    <Select defaultValue="salesReport">
                      <SelectTrigger>
                        <SelectValue placeholder="Select report type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="salesReport">
                          Sales Report
                        </SelectItem>
                        <SelectItem value="purchaseReport">
                          Purchase Report
                        </SelectItem>
                        <SelectItem value="inventoryReport">
                          Inventory Report
                        </SelectItem>
                        <SelectItem value="financialReport">
                          Financial Report
                        </SelectItem>
                        <SelectItem value="customerReport">
                          Customer Report
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader className="py-3">
                      <CardTitle className="text-base">
                        Report Content
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                          <Checkbox id="show-summary" defaultChecked />
                          <Label htmlFor="show-summary">
                            Show Summary Section
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="show-charts" defaultChecked />
                          <Label htmlFor="show-charts">
                            Show Charts & Graphs
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="show-detailed-data" defaultChecked />
                          <Label htmlFor="show-detailed-data">
                            Show Detailed Data
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="show-filters" defaultChecked />
                          <Label htmlFor="show-filters">
                            Show Applied Filters
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="show-pagination" defaultChecked />
                          <Label htmlFor="show-pagination">
                            Show Pagination
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="show-timestamp" defaultChecked />
                          <Label htmlFor="show-timestamp">
                            Show Generated Timestamp
                          </Label>
                        </div>
                      </div>

                      <Separator className="my-4" />

                      <div className="space-y-4">
                        <Label>Chart Types</Label>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="flex items-center space-x-2">
                            <Checkbox id="bar-chart" defaultChecked />
                            <Label htmlFor="bar-chart">Bar Chart</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox id="line-chart" defaultChecked />
                            <Label htmlFor="line-chart">Line Chart</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox id="pie-chart" defaultChecked />
                            <Label htmlFor="pie-chart">Pie Chart</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox id="area-chart" />
                            <Label htmlFor="area-chart">Area Chart</Label>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="py-3">
                      <CardTitle className="text-base">Report Layout</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label>Paper Size</Label>
                          <Select defaultValue="a4">
                            <SelectTrigger>
                              <SelectValue placeholder="Select paper size" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="a4">A4</SelectItem>
                              <SelectItem value="letter">Letter</SelectItem>
                              <SelectItem value="legal">Legal</SelectItem>
                              <SelectItem value="a3">A3</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Orientation</Label>
                          <Select defaultValue="landscape">
                            <SelectTrigger>
                              <SelectValue placeholder="Select orientation" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="portrait">Portrait</SelectItem>
                              <SelectItem value="landscape">
                                Landscape
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="report-title">Report Title</Label>
                          <Input
                            id="report-title"
                            defaultValue="Sales Performance Report"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="report-subtitle">
                            Report Subtitle
                          </Label>
                          <Input
                            id="report-subtitle"
                            defaultValue="Monthly Analysis"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="report-footer">Report Footer</Label>
                          <Input
                            id="report-footer"
                            defaultValue="Confidential - For Internal Use Only"
                          />
                        </div>
                      </div>

                      <Separator className="my-4" />

                      <div className="space-y-4">
                        <Label>Export Options</Label>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="flex items-center space-x-2">
                            <Checkbox id="export-pdf" defaultChecked />
                            <Label htmlFor="export-pdf">PDF</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox id="export-excel" defaultChecked />
                            <Label htmlFor="export-excel">Excel</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox id="export-csv" defaultChecked />
                            <Label htmlFor="export-csv">CSV</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox id="export-print" defaultChecked />
                            <Label htmlFor="export-print">Print</Label>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Separator className="my-6" />

                <div className="flex justify-between">
                  <Button variant="outline">
                    <Eye className="mr-2 h-4 w-4" />
                    Preview Report
                  </Button>
                  <div className="space-x-2">
                    <Button variant="outline">
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Reset to Default
                    </Button>
                    <Button>
                      <Save className="mr-2 h-4 w-4" />
                      Save Report Design
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Projects & Branches Tab */}
          <TabsContent value="branches" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Projects & Branches Management</CardTitle>
                <CardDescription>
                  Manage your organization's projects and branch locations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-medium">Projects</h3>
                      <Button size="sm">
                        <Plus className="mr-2 h-4 w-4" />
                        Add Project
                      </Button>
                    </div>

                    <div className="space-y-4">
                      <Card>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold">
                                HP
                              </div>
                              <div>
                                <h4 className="font-medium">Healthcare Plus</h4>
                                <p className="text-sm text-muted-foreground">
                                  Main Project
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Button variant="ghost" size="icon">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon">
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold">
                                DC
                              </div>
                              <div>
                                <h4 className="font-medium">
                                  Diagnostic Center
                                </h4>
                                <p className="text-sm text-muted-foreground">
                                  Sub Project
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Button variant="ghost" size="icon">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon">
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-medium">Branches</h3>
                      <Button size="sm">
                        <Plus className="mr-2 h-4 w-4" />
                        Add Branch
                      </Button>
                    </div>

                    <div className="space-y-4">
                      <Card>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold">
                                HQ
                              </div>
                              <div>
                                <h4 className="font-medium">Headquarters</h4>
                                <p className="text-sm text-muted-foreground">
                                  Main Branch
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Button variant="ghost" size="icon">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon">
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold">
                                NB
                              </div>
                              <div>
                                <h4 className="font-medium">North Branch</h4>
                                <p className="text-sm text-muted-foreground">
                                  Regional Office
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Button variant="ghost" size="icon">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon">
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold">
                                SB
                              </div>
                              <div>
                                <h4 className="font-medium">South Branch</h4>
                                <p className="text-sm text-muted-foreground">
                                  Regional Office
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Button variant="ghost" size="icon">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon">
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </div>

                <Separator className="my-6" />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Branch Settings</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <Switch id="multi-branch-inventory" defaultChecked />
                        <Label htmlFor="multi-branch-inventory">
                          Enable Multi-Branch Inventory
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch id="branch-specific-pricing" defaultChecked />
                        <Label htmlFor="branch-specific-pricing">
                          Allow Branch-Specific Pricing
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch id="branch-transfers" defaultChecked />
                        <Label htmlFor="branch-transfers">
                          Enable Inter-Branch Transfers
                        </Label>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <Switch id="branch-reports" defaultChecked />
                        <Label htmlFor="branch-reports">
                          Branch-Specific Reports
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch id="branch-users" defaultChecked />
                        <Label htmlFor="branch-users">
                          Branch-Specific User Access
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch id="consolidated-view" defaultChecked />
                        <Label htmlFor="consolidated-view">
                          Enable Consolidated View
                        </Label>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Appearance Tab */}
          <TabsContent value="appearance" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Appearance Settings</CardTitle>
                <CardDescription>
                  Customize the look and feel of your application
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Theme</h3>
                    <div className="grid grid-cols-1 gap-4">
                      <div className="flex items-center space-x-2">
                        <Label htmlFor="theme-mode">Theme Mode</Label>
                        <Select defaultValue="system">
                          <SelectTrigger id="theme-mode">
                            <SelectValue placeholder="Select theme mode" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="light">Light</SelectItem>
                            <SelectItem value="dark">Dark</SelectItem>
                            <SelectItem value="system">System</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Primary Color</Label>
                        <div className="grid grid-cols-6 gap-2">
                          <div className="h-8 w-8 rounded-full bg-blue-500 cursor-pointer ring-2 ring-offset-2 ring-blue-500" />
                          <div className="h-8 w-8 rounded-full bg-green-500 cursor-pointer" />
                          <div className="h-8 w-8 rounded-full bg-purple-500 cursor-pointer" />
                          <div className="h-8 w-8 rounded-full bg-red-500 cursor-pointer" />
                          <div className="h-8 w-8 rounded-full bg-orange-500 cursor-pointer" />
                          <div className="h-8 w-8 rounded-full bg-teal-500 cursor-pointer" />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Accent Color</Label>
                        <div className="grid grid-cols-6 gap-2">
                          <div className="h-8 w-8 rounded-full bg-blue-300 cursor-pointer" />
                          <div className="h-8 w-8 rounded-full bg-green-300 cursor-pointer" />
                          <div className="h-8 w-8 rounded-full bg-purple-300 cursor-pointer ring-2 ring-offset-2 ring-purple-300" />
                          <div className="h-8 w-8 rounded-full bg-red-300 cursor-pointer" />
                          <div className="h-8 w-8 rounded-full bg-orange-300 cursor-pointer" />
                          <div className="h-8 w-8 rounded-full bg-teal-300 cursor-pointer" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Layout</h3>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="sidebar-position">
                          Sidebar Position
                        </Label>
                        <Select defaultValue="left">
                          <SelectTrigger id="sidebar-position">
                            <SelectValue placeholder="Select sidebar position" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="left">Left</SelectItem>
                            <SelectItem value="right">Right</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="content-width">Content Width</Label>
                        <Select defaultValue="fixed">
                          <SelectTrigger id="content-width">
                            <SelectValue placeholder="Select content width" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="fixed">Fixed</SelectItem>
                            <SelectItem value="fluid">Fluid</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Switch id="compact-sidebar" />
                        <Label htmlFor="compact-sidebar">Compact Sidebar</Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Switch id="sticky-header" defaultChecked />
                        <Label htmlFor="sticky-header">Sticky Header</Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Switch id="show-breadcrumbs" defaultChecked />
                        <Label htmlFor="show-breadcrumbs">
                          Show Breadcrumbs
                        </Label>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Customization</h3>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="app-name">Application Name</Label>
                        <Input
                          id="app-name"
                          defaultValue="Healthcare Information Management System"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="app-logo">Application Logo</Label>
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 rounded-md border flex items-center justify-center bg-muted">
                            <Image className="h-6 w-6 text-muted-foreground" />
                          </div>
                          <Button variant="outline" size="sm">
                            <Upload className="mr-2 h-4 w-4" />
                            Upload Logo
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="favicon">Favicon</Label>
                        <div className="flex items-center gap-4">
                          <div className="h-8 w-8 rounded-md border flex items-center justify-center bg-muted">
                            <Image className="h-4 w-4 text-muted-foreground" />
                          </div>
                          <Button variant="outline" size="sm">
                            <Upload className="mr-2 h-4 w-4" />
                            Upload Favicon
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="login-background">
                          Login Page Background
                        </Label>
                        <div className="flex items-center gap-4">
                          <div className="h-16 w-24 rounded-md border flex items-center justify-center bg-muted">
                            <Image className="h-6 w-6 text-muted-foreground" />
                          </div>
                          <Button variant="outline" size="sm">
                            <Upload className="mr-2 h-4 w-4" />
                            Upload Background
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator className="my-6" />

                <div className="flex justify-between">
                  <Button variant="outline">
                    <Eye className="mr-2 h-4 w-4" />
                    Preview Changes
                  </Button>
                  <div className="space-x-2">
                    <Button variant="outline">
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Reset to Default
                    </Button>
                    <Button>
                      <Save className="mr-2 h-4 w-4" />
                      Save Appearance
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ControlPanel;
