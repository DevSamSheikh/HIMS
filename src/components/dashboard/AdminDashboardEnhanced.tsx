import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  TrendingDown,
  Calendar,
  BarChart3,
  LineChart,
  PieChart,
  Activity,
  Layers,
  Users,
  Bed,
  Flask,
  Pill,
  DollarSign,
  CreditCard,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";

// Import chart components
import LineChartComponent from "./charts/LineChart";
import BarChartComponent from "./charts/BarChart";
import PieChartComponent from "./charts/PieChart";

const AdminDashboardEnhanced = () => {
  const [timeRange, setTimeRange] = useState<
    "daily" | "weekly" | "monthly" | "yearly"
  >("weekly");

  // Mock data for charts and metrics
  const revenueData = {
    daily: [
      { name: "00:00", value: 1200 },
      { name: "04:00", value: 900 },
      { name: "08:00", value: 1800 },
      { name: "12:00", value: 2400 },
      { name: "16:00", value: 1800 },
      { name: "20:00", value: 1500 },
    ],
    weekly: [
      { name: "Mon", value: 5200 },
      { name: "Tue", value: 4800 },
      { name: "Wed", value: 6100 },
      { name: "Thu", value: 5600 },
      { name: "Fri", value: 7200 },
      { name: "Sat", value: 8500 },
      { name: "Sun", value: 4300 },
    ],
    monthly: [
      { name: "Week 1", value: 22000 },
      { name: "Week 2", value: 26000 },
      { name: "Week 3", value: 30000 },
      { name: "Week 4", value: 28000 },
    ],
    yearly: [
      { name: "Jan", value: 95000 },
      { name: "Feb", value: 88000 },
      { name: "Mar", value: 105000 },
      { name: "Apr", value: 110000 },
      { name: "May", value: 120000 },
      { name: "Jun", value: 118000 },
      { name: "Jul", value: 125000 },
      { name: "Aug", value: 132000 },
      { name: "Sep", value: 128000 },
      { name: "Oct", value: 135000 },
      { name: "Nov", value: 142000 },
      { name: "Dec", value: 150000 },
    ],
  };

  const patientDistributionData = [
    { name: "OPD", value: 65 },
    { name: "IPD", value: 25 },
    { name: "Emergency", value: 10 },
  ];

  const departmentRevenueData = [
    { name: "Pharmacy", value: 35 },
    { name: "Laboratory", value: 25 },
    { name: "OPD", value: 20 },
    { name: "IPD", value: 15 },
    { name: "Radiology", value: 5 },
  ];

  const moduleMetrics = {
    pharmacy: {
      todaySales: 12500,
      weeklySales: 78500,
      monthlySales: 320000,
      stockItems: 1245,
      lowStockItems: 28,
      profit: 4200,
      expenses: 1800,
      salesGrowth: 8.5,
      purchaseGrowth: -2.3,
    },
    ipd: {
      occupiedBeds: 42,
      totalBeds: 60,
      occupiedRooms: 18,
      totalRooms: 25,
      admittedPatients: 42,
      dischargedPatients: 8,
      revenue: 28500,
      averageStay: 4.2,
      occupancyRate: 70,
    },
    opd: {
      todayPatients: 85,
      weeklyPatients: 520,
      monthlyPatients: 2100,
      appointmentsToday: 92,
      completedAppointments: 78,
      cancelledAppointments: 5,
      revenue: 18500,
      growth: 12.3,
    },
    laboratory: {
      testsToday: 120,
      testsWeekly: 780,
      testsMonthly: 3200,
      pendingResults: 18,
      completedResults: 102,
      revenue: 15200,
      growth: 5.8,
    },
  };

  return (
    <div className="p-6 bg-background">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Comprehensive overview of your healthcare facility
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Select
            value={timeRange}
            onValueChange={(value: "daily" | "weekly" | "monthly" | "yearly") =>
              setTimeRange(value)
            }
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Today</SelectItem>
              <SelectItem value="weekly">This Week</SelectItem>
              <SelectItem value="monthly">This Month</SelectItem>
              <SelectItem value="yearly">This Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon">
            <Calendar className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Revenue
                </p>
                <h3 className="text-2xl font-bold mt-1">$348,500</h3>
                <div className="flex items-center mt-1">
                  <span className="text-xs font-medium text-green-600 flex items-center">
                    <ArrowUpRight className="h-3 w-3 mr-1" /> +12.5%
                  </span>
                  <span className="text-xs text-muted-foreground ml-2">
                    vs last {timeRange}
                  </span>
                </div>
              </div>
              <div className="bg-primary/10 p-2 rounded-full">
                <DollarSign className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Patients
                </p>
                <h3 className="text-2xl font-bold mt-1">2,845</h3>
                <div className="flex items-center mt-1">
                  <span className="text-xs font-medium text-green-600 flex items-center">
                    <ArrowUpRight className="h-3 w-3 mr-1" /> +8.2%
                  </span>
                  <span className="text-xs text-muted-foreground ml-2">
                    vs last {timeRange}
                  </span>
                </div>
              </div>
              <div className="bg-blue-500/10 p-2 rounded-full">
                <Users className="h-5 w-5 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Pharmacy Sales
                </p>
                <h3 className="text-2xl font-bold mt-1">$78,500</h3>
                <div className="flex items-center mt-1">
                  <span className="text-xs font-medium text-green-600 flex items-center">
                    <ArrowUpRight className="h-3 w-3 mr-1" /> +5.3%
                  </span>
                  <span className="text-xs text-muted-foreground ml-2">
                    vs last {timeRange}
                  </span>
                </div>
              </div>
              <div className="bg-green-500/10 p-2 rounded-full">
                <Pill className="h-5 w-5 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Expenses
                </p>
                <h3 className="text-2xl font-bold mt-1">$42,350</h3>
                <div className="flex items-center mt-1">
                  <span className="text-xs font-medium text-red-600 flex items-center">
                    <ArrowDownRight className="h-3 w-3 mr-1" /> +3.7%
                  </span>
                  <span className="text-xs text-muted-foreground ml-2">
                    vs last {timeRange}
                  </span>
                </div>
              </div>
              <div className="bg-red-500/10 p-2 rounded-full">
                <CreditCard className="h-5 w-5 text-red-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Revenue Overview</CardTitle>
            <CardDescription>
              Revenue trends across all departments
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <LineChartComponent data={revenueData[timeRange]} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Revenue Distribution</CardTitle>
            <CardDescription>By department</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <PieChartComponent data={departmentRevenueData} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Module-specific metrics */}
      <Tabs defaultValue="pharmacy" className="mb-6">
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="pharmacy" className="flex items-center">
            <Pill className="h-4 w-4 mr-2" /> Pharmacy
          </TabsTrigger>
          <TabsTrigger value="ipd" className="flex items-center">
            <Bed className="h-4 w-4 mr-2" /> IPD
          </TabsTrigger>
          <TabsTrigger value="opd" className="flex items-center">
            <Users className="h-4 w-4 mr-2" /> OPD
          </TabsTrigger>
          <TabsTrigger value="laboratory" className="flex items-center">
            <Flask className="h-4 w-4 mr-2" /> Laboratory
          </TabsTrigger>
        </TabsList>

        {/* Pharmacy Tab */}
        <TabsContent value="pharmacy" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium">Sales</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${moduleMetrics.pharmacy.todaySales.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">Today</p>
                <div className="flex items-center mt-4 text-sm">
                  <div className="flex-1">
                    <div className="flex items-center">
                      <span className="font-medium">
                        ${moduleMetrics.pharmacy.weeklySales.toLocaleString()}
                      </span>
                      <span className="text-xs text-green-600 flex items-center ml-2">
                        <TrendingUp className="h-3 w-3 mr-1" />{" "}
                        {moduleMetrics.pharmacy.salesGrowth}%
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">This Week</p>
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">
                      ${moduleMetrics.pharmacy.monthlySales.toLocaleString()}
                    </div>
                    <p className="text-xs text-muted-foreground">This Month</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium">
                  Inventory Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {moduleMetrics.pharmacy.stockItems}
                </div>
                <p className="text-xs text-muted-foreground">Total Items</p>
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm">Low Stock Items</span>
                    <span className="text-sm font-medium text-amber-600">
                      {moduleMetrics.pharmacy.lowStockItems}
                    </span>
                  </div>
                  <Progress
                    value={
                      (moduleMetrics.pharmacy.lowStockItems /
                        moduleMetrics.pharmacy.stockItems) *
                      100
                    }
                    className="h-2"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium">
                  Profit & Loss
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <div className="text-2xl font-bold text-green-600">
                    +${moduleMetrics.pharmacy.profit.toLocaleString()}
                  </div>
                  <div className="ml-auto text-base font-medium text-red-600">
                    -${moduleMetrics.pharmacy.expenses.toLocaleString()}
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">Today's P&L</p>
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm">Profit Margin</span>
                    <span className="text-sm font-medium">
                      {Math.round(
                        (moduleMetrics.pharmacy.profit /
                          (moduleMetrics.pharmacy.profit +
                            moduleMetrics.pharmacy.expenses)) *
                          100,
                      )}
                      %
                    </span>
                  </div>
                  <Progress
                    value={
                      (moduleMetrics.pharmacy.profit /
                        (moduleMetrics.pharmacy.profit +
                          moduleMetrics.pharmacy.expenses)) *
                      100
                    }
                    className="h-2"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium">
                  Purchase Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <div className="text-2xl font-bold">28</div>
                  <div className="ml-auto flex items-center text-red-600 text-sm">
                    <TrendingDown className="h-4 w-4 mr-1" />
                    {Math.abs(moduleMetrics.pharmacy.purchaseGrowth)}%
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  Purchase Orders (This Week)
                </p>
                <div className="h-[100px] mt-4">
                  <BarChartComponent
                    data={[
                      { name: "Mon", value: 5 },
                      { name: "Tue", value: 3 },
                      { name: "Wed", value: 7 },
                      { name: "Thu", value: 2 },
                      { name: "Fri", value: 6 },
                      { name: "Sat", value: 4 },
                      { name: "Sun", value: 1 },
                    ]}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Pharmacy Sales Analysis</CardTitle>
              <CardDescription>
                Detailed breakdown of pharmacy sales
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <BarChartComponent
                  data={[
                    { name: "Antibiotics", value: 12500 },
                    { name: "Painkillers", value: 9800 },
                    { name: "Vitamins", value: 7600 },
                    { name: "Cardiac", value: 15200 },
                    { name: "Diabetes", value: 11300 },
                    { name: "Respiratory", value: 8700 },
                    { name: "Others", value: 13400 },
                  ]}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* IPD Tab */}
        <TabsContent value="ipd" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium">
                  Bed Occupancy
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {moduleMetrics.ipd.occupiedBeds}/{moduleMetrics.ipd.totalBeds}
                </div>
                <p className="text-xs text-muted-foreground">Occupied Beds</p>
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm">Occupancy Rate</span>
                    <span className="text-sm font-medium">
                      {moduleMetrics.ipd.occupancyRate}%
                    </span>
                  </div>
                  <Progress
                    value={moduleMetrics.ipd.occupancyRate}
                    className="h-2"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium">
                  Room Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {moduleMetrics.ipd.occupiedRooms}/
                  {moduleMetrics.ipd.totalRooms}
                </div>
                <p className="text-xs text-muted-foreground">Occupied Rooms</p>
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm">Room Occupancy</span>
                    <span className="text-sm font-medium">
                      {Math.round(
                        (moduleMetrics.ipd.occupiedRooms /
                          moduleMetrics.ipd.totalRooms) *
                          100,
                      )}
                      %
                    </span>
                  </div>
                  <Progress
                    value={
                      (moduleMetrics.ipd.occupiedRooms /
                        moduleMetrics.ipd.totalRooms) *
                      100
                    }
                    className="h-2"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium">
                  Patient Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <div>
                    <div className="text-2xl font-bold">
                      {moduleMetrics.ipd.admittedPatients}
                    </div>
                    <p className="text-xs text-muted-foreground">Admitted</p>
                  </div>
                  <div className="ml-auto">
                    <div className="text-2xl font-bold">
                      {moduleMetrics.ipd.dischargedPatients}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Discharged Today
                    </p>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm">Average Stay</span>
                    <span className="text-sm font-medium">
                      {moduleMetrics.ipd.averageStay} days
                    </span>
                  </div>
                  <Progress
                    value={(moduleMetrics.ipd.averageStay / 10) * 100}
                    className="h-2"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium">
                  IPD Revenue
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${moduleMetrics.ipd.revenue.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">Today's Revenue</p>
                <div className="h-[100px] mt-4">
                  <LineChartComponent
                    data={[
                      { name: "Mon", value: 22500 },
                      { name: "Tue", value: 19800 },
                      { name: "Wed", value: 25600 },
                      { name: "Thu", value: 28500 },
                      { name: "Fri", value: 31300 },
                      { name: "Sat", value: 27700 },
                      { name: "Sun", value: 18400 },
                    ]}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Ward-wise Bed Occupancy</CardTitle>
              <CardDescription>Current bed allocation by ward</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <BarChartComponent
                  data={[
                    { name: "General", value: 85 },
                    { name: "Semi-Private", value: 75 },
                    { name: "Private", value: 60 },
                    { name: "ICU", value: 90 },
                    { name: "Pediatric", value: 65 },
                    { name: "Maternity", value: 70 },
                    { name: "Surgical", value: 80 },
                  ]}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* OPD Tab */}
        <TabsContent value="opd" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium">
                  Patient Visits
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {moduleMetrics.opd.todayPatients}
                </div>
                <p className="text-xs text-muted-foreground">
                  Today's Patients
                </p>
                <div className="flex items-center mt-4 text-sm">
                  <div className="flex-1">
                    <div className="font-medium">
                      {moduleMetrics.opd.weeklyPatients}
                    </div>
                    <p className="text-xs text-muted-foreground">This Week</p>
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">
                      {moduleMetrics.opd.monthlyPatients}
                    </div>
                    <p className="text-xs text-muted-foreground">This Month</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium">
                  Appointments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {moduleMetrics.opd.appointmentsToday}
                </div>
                <p className="text-xs text-muted-foreground">
                  Today's Appointments
                </p>
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm">Completed</span>
                    <span className="text-sm font-medium">
                      {Math.round(
                        (moduleMetrics.opd.completedAppointments /
                          moduleMetrics.opd.appointmentsToday) *
                          100,
                      )}
                      %
                    </span>
                  </div>
                  <Progress
                    value={
                      (moduleMetrics.opd.completedAppointments /
                        moduleMetrics.opd.appointmentsToday) *
                      100
                    }
                    className="h-2"
                  />
                </div>
                <div className="mt-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm">Cancelled</span>
                    <span className="text-sm font-medium text-red-600">
                      {Math.round(
                        (moduleMetrics.opd.cancelledAppointments /
                          moduleMetrics.opd.appointmentsToday) *
                          100,
                      )}
                      %
                    </span>
                  </div>
                  <Progress
                    value={
                      (moduleMetrics.opd.cancelledAppointments /
                        moduleMetrics.opd.appointmentsToday) *
                      100
                    }
                    className="h-2 bg-red-100"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium">
                  OPD Revenue
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <div className="text-2xl font-bold">
                    ${moduleMetrics.opd.revenue.toLocaleString()}
                  </div>
                  <div className="ml-auto flex items-center text-green-600 text-sm">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    {moduleMetrics.opd.growth}%
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">Today's Revenue</p>
                <div className="h-[100px] mt-4">
                  <LineChartComponent
                    data={[
                      { name: "Mon", value: 15500 },
                      { name: "Tue", value: 12800 },
                      { name: "Wed", value: 18600 },
                      { name: "Thu", value: 16500 },
                      { name: "Fri", value: 19300 },
                      { name: "Sat", value: 22700 },
                      { name: "Sun", value: 10400 },
                    ]}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium">
                  Department Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[180px]">
                  <PieChartComponent
                    data={[
                      { name: "General Medicine", value: 35 },
                      { name: "Pediatrics", value: 20 },
                      { name: "Orthopedics", value: 15 },
                      { name: "Gynecology", value: 12 },
                      { name: "Dermatology", value: 10 },
                      { name: "Others", value: 8 },
                    ]}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>OPD Patient Trends</CardTitle>
              <CardDescription>Patient visits by time of day</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <BarChartComponent
                  data={[
                    { name: "8-9 AM", value: 12 },
                    { name: "9-10 AM", value: 18 },
                    { name: "10-11 AM", value: 22 },
                    { name: "11-12 PM", value: 15 },
                    { name: "12-1 PM", value: 8 },
                    { name: "1-2 PM", value: 5 },
                    { name: "2-3 PM", value: 10 },
                    { name: "3-4 PM", value: 14 },
                    { name: "4-5 PM", value: 16 },
                    { name: "5-6 PM", value: 12 },
                  ]}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Laboratory Tab */}
        <TabsContent value="laboratory" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium">
                  Test Volume
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {moduleMetrics.laboratory.testsToday}
                </div>
                <p className="text-xs text-muted-foreground">Tests Today</p>
                <div className="flex items-center mt-4 text-sm">
                  <div className="flex-1">
                    <div className="font-medium">
                      {moduleMetrics.laboratory.testsWeekly}
                    </div>
                    <p className="text-xs text-muted-foreground">This Week</p>
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">
                      {moduleMetrics.laboratory.testsMonthly}
                    </div>
                    <p className="text-xs text-muted-foreground">This Month</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium">
                  Test Results
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <div>
                    <div className="text-2xl font-bold">
                      {moduleMetrics.laboratory.completedResults}
                    </div>
                    <p className="text-xs text-muted-foreground">Completed</p>
                  </div>
                  <div className="ml-auto">
                    <div className="text-2xl font-bold text-amber-600">
                      {moduleMetrics.laboratory.pendingResults}
                    </div>
                    <p className="text-xs text-muted-foreground">Pending</p>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm">Completion Rate</span>
                    <span className="text-sm font-medium">
                      {Math.round(
                        (moduleMetrics.laboratory.completedResults /
                          (moduleMetrics.laboratory.completedResults +
                            moduleMetrics.laboratory.pendingResults)) *
                          100,
                      )}
                      %
                    </span>
                  </div>
                  <Progress
                    value={
                      (moduleMetrics.laboratory.completedResults /
                        (moduleMetrics.laboratory.completedResults +
                          moduleMetrics.laboratory.pendingResults)) *
                      100
                    }
                    className="h-2"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium">
                  Lab Revenue
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <div className="text-2xl font-bold">
                    ${moduleMetrics.laboratory.revenue.toLocaleString()}
                  </div>
                  <div className="ml-auto flex items-center text-green-600 text-sm">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    {moduleMetrics.laboratory.growth}%
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">Today's Revenue</p>
                <div className="h-[100px] mt-4">
                  <LineChartComponent
                    data={[
                      { name: "Mon", value: 12500 },
                      { name: "Tue", value: 11800 },
                      { name: "Wed", value: 14600 },
                      { name: "Thu", value: 15200 },
                      { name: "Fri", value: 16300 },
                      { name: "Sat", value: 13700 },
                      { name: "Sun", value: 9400 },
                    ]}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium">
                  Test Categories
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[180px]">
                  <PieChartComponent
                    data={[
                      { name: "Hematology", value: 30 },
                      { name: "Biochemistry", value: 25 },
                      { name: "Microbiology", value: 15 },
                      { name: "Pathology", value: 10 },
                      { name: "Immunology", value: 12 },
                      { name: "Others", value: 8 },
                    ]}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Test Volume by Category</CardTitle>
              <CardDescription>
                Number of tests performed by category
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <BarChartComponent
                  data={[
                    { name: "Blood Tests", value: 450 },
                    { name: "Urine Tests", value: 320 },
                    { name: "Imaging", value: 180 },
                    { name: "Cardiac", value: 120 },
                    { name: "Hormone", value: 90 },
                    { name: "Allergy", value: 70 },
                    { name: "Genetic", value: 40 },
                  ]}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Patient Distribution and Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Patient Distribution</CardTitle>
            <CardDescription>By department</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <PieChartComponent data={patientDistributionData} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cash Flow</CardTitle>
            <CardDescription>Income vs Expenses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <BarChartComponent
                data={[
                  { name: "Week 1", income: 85000, expense: 62000 },
                  { name: "Week 2", income: 92000, expense: 58000 },
                  { name: "Week 3", income: 78000, expense: 51000 },
                  { name: "Week 4", income: 95000, expense: 63000 },
                ]}
                stacked={true}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboardEnhanced;
