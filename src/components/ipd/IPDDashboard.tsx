import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  BedDouble,
  Building2,
  DoorClosed,
  Stethoscope,
  FileText,
  ClipboardList,
  Receipt,
} from "lucide-react";

const IPDDashboard = () => {
  const menuItems = [
    {
      title: "Ward Management",
      description: "Create and manage hospital wards",
      icon: <Building2 className="h-8 w-8 mb-2" />,
      link: "/ipd/wards",
      color: "bg-blue-50 dark:bg-blue-900/20",
      textColor: "text-blue-600 dark:text-blue-400",
    },
    {
      title: "Room Management",
      description: "Define rooms and their categories",
      icon: <DoorClosed className="h-8 w-8 mb-2" />,
      link: "/ipd/rooms",
      color: "bg-purple-50 dark:bg-purple-900/20",
      textColor: "text-purple-600 dark:text-purple-400",
    },
    {
      title: "Bed Management",
      description: "Manage beds and their allocation",
      icon: <BedDouble className="h-8 w-8 mb-2" />,
      link: "/ipd/beds",
      color: "bg-green-50 dark:bg-green-900/20",
      textColor: "text-green-600 dark:text-green-400",
    },
    {
      title: "Services",
      description: "Define IPD services and pricing",
      icon: <Stethoscope className="h-8 w-8 mb-2" />,
      link: "/ipd/services",
      color: "bg-amber-50 dark:bg-amber-900/20",
      textColor: "text-amber-600 dark:text-amber-400",
    },
    {
      title: "Patient Treatments",
      description: "Record patient treatments and services",
      icon: <ClipboardList className="h-8 w-8 mb-2" />,
      link: "/ipd/treatments",
      color: "bg-red-50 dark:bg-red-900/20",
      textColor: "text-red-600 dark:text-red-400",
    },
    {
      title: "Billing",
      description: "Generate and manage IPD bills",
      icon: <Receipt className="h-8 w-8 mb-2" />,
      link: "/ipd/billing",
      color: "bg-indigo-50 dark:bg-indigo-900/20",
      textColor: "text-indigo-600 dark:text-indigo-400",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {menuItems.map((item, index) => (
          <Link to={item.link} key={index}>
            <Card
              className={`${item.color} hover:shadow-md transition-shadow h-full`}
            >
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className={item.textColor}>{item.icon}</div>
                  <h3 className="text-xl font-semibold mt-2">{item.title}</h3>
                  <p className="text-muted-foreground mt-2">
                    {item.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default IPDDashboard;
