import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Home,
  Users,
  Calendar,
  CreditCard,
  Settings,
  Package,
  LayoutDashboard,
  FileText,
  HelpCircle,
  LogOut,
  ChevronRight,
  ChevronDown,
  Database,
  FileSpreadsheet,
  ShieldCheck,
  UserCog,
  Lock,
  Stethoscope,
  Pill,
  Beaker,
  Menu,
  X,
  ChevronLeft,
  ChevronRight as ChevronRightIcon,
  UserPlus,
  Search,
  ClipboardList,
  CalendarClock,
  Stethoscope as StethoscopeIcon,
  Receipt,
  BedDouble,
  Building2,
  Clipboard,
  PlusCircle,
  Boxes,
  FileOutput,
  ShoppingCart,
  FlaskConical,
  FileBarChart,
  CreditCard as CreditCardIcon,
  DollarSign,
  BarChart,
  TestTube,
  Activity,
  AlertCircle,
  Truck,
  Clock,
  CheckCircle,
  Edit,
  Sliders,
  DoorClosed,
  Microscope,
} from "lucide-react";
import { Sheet, SheetContent } from "@/components/ui/sheet";

interface SidebarProps {
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  className?: string;
  isMobile?: boolean;
}

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  href?: string;
  active?: boolean;
  collapsed?: boolean;
  onClick?: () => void;
  subItems?: SubNavItem[];
}

interface SubNavItem {
  id: string;
  label: string;
  href: string;
}

const NavItem = ({
  icon,
  label,
  href = "#",
  active = false,
  collapsed = false,
  onClick,
  subItems,
}: NavItemProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const hasSubItems = subItems && subItems.length > 0;
  const location = useLocation();

  // Check if any subitems are active based on current location
  const hasActiveSubItem =
    hasSubItems && subItems.some((item) => location.pathname === item.href);

  const toggleSubMenu = (e: React.MouseEvent) => {
    if (hasSubItems) {
      e.preventDefault();
      setIsOpen(!isOpen);
    }
  };

  // Get icon for subitem based on its label
  const getSubItemIcon = (label: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      // Records & Definitions
      Categories: <FileText size={16} />,
      Departments: <Building2 size={16} />,
      Companies: <Building2 size={16} />,
      Warehouses: <Boxes size={16} />,
      Banks: <CreditCardIcon size={16} />,
      "Units of Measurement": <FileSpreadsheet size={16} />,
      Forms: <FileText size={16} />,
      Templates: <FileSpreadsheet size={16} />,
      Reports: <FileBarChart size={16} />,

      // Security
      "User Management": <UserCog size={16} />,
      Roles: <Lock size={16} />,
      Permissions: <ShieldCheck size={16} />,
      "Control Panel": <Sliders size={16} />,

      // Patient Management
      Registration: <UserPlus size={16} />,
      Search: <Search size={16} />,
      Records: <ClipboardList size={16} />,

      // Doctor Management
      Management: <UserCog size={16} />,
      Scheduling: <CalendarClock size={16} />,
      Appointments: <Calendar size={16} />,

      // OPD
      Appointments: <CalendarClock size={16} />,
      Consultations: <StethoscopeIcon size={16} />,
      Billing: <Receipt size={16} />,
      Diseases: <AlertCircle size={16} />,
      Symptoms: <Activity size={16} />,
      Tests: <FlaskConical size={16} />,
      Dosage: <Pill size={16} />,
      Days: <Clock size={16} />,
      "Pending Patients": <ClipboardList size={16} />,
      "OPD Checkup": <StethoscopeIcon size={16} />,
      "OPD Billing": <Receipt size={16} />,

      // IPD
      Dashboard: <LayoutDashboard size={16} />,
      Wards: <Building2 size={16} />,
      Rooms: <DoorClosed size={16} />,
      Beds: <BedDouble size={16} />,
      Services: <Stethoscope size={16} />,
      "Patient Treatments": <ClipboardList size={16} />,
      Billing: <Receipt size={16} />,

      // Pharmacy
      Items: <Pill size={16} />,
      Customers: <Users size={16} />,
      Inventory: <Boxes size={16} />,
      Prescriptions: <FileOutput size={16} />,
      Sales: <ShoppingCart size={16} />,

      // Laboratory
      "Test Catalog": <FlaskConical size={16} />,
      "Order Management": <ClipboardList size={16} />,
      "Sample Management": <TestTube size={16} />,
      "Results Entry": <TestTube size={16} />,
      Tests: <FlaskConical size={16} />,
      Results: <TestTube size={16} />,
      Samples: <Beaker size={16} />,
      Packages: <Package size={16} />,
      Machines: <Microscope size={16} />,
      Settings: <Settings size={16} />,

      // Billing
      Invoices: <CreditCardIcon size={16} />,
      Payments: <DollarSign size={16} />,
      Reports: <BarChart size={16} />,
    };

    return iconMap[label] || <FileText size={16} />;
  };

  // For collapsed sidebar with submenu items
  if (collapsed && hasSubItems) {
    return (
      <div
        className="w-full relative"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Popover open={isHovered} onOpenChange={setIsHovered}>
          <PopoverTrigger asChild>
            <Button
              variant={active || hasActiveSubItem ? "secondary" : "ghost"}
              size="icon"
              className={cn(
                "w-10 h-10",
                (active || hasActiveSubItem) && "bg-secondary",
                !(active || hasActiveSubItem) &&
                  "hover:bg-primary/10 hover:text-primary",
              )}
            >
              <div className="flex items-center justify-center">{icon}</div>
            </Button>
          </PopoverTrigger>
          <PopoverContent
            side="right"
            className="p-0 w-48 -mt-1"
            sideOffset={10}
          >
            <div className="py-2">
              <div className="px-3 py-2 font-medium text-sm">{label}</div>
              <Separator className="my-1" />
              <div className="mt-2 space-y-1">
                {subItems.map((subItem) => {
                  const isActive = location.pathname === subItem.href;
                  return (
                    <Button
                      key={subItem.id}
                      variant="ghost"
                      size="sm"
                      className={cn(
                        "w-full justify-start px-2 gap-2",
                        isActive
                          ? "bg-secondary text-secondary-foreground"
                          : "hover:bg-primary/10 hover:text-primary",
                      )}
                      asChild
                    >
                      <Link
                        to={subItem.href}
                        className="flex items-center cursor-pointer"
                      >
                        {getSubItemIcon(subItem.label)}
                        <span>{subItem.label}</span>
                      </Link>
                    </Button>
                  );
                })}
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    );
  }

  // For expanded sidebar or items without subitems
  return (
    <div className="w-full">
      <TooltipProvider delayDuration={0} disableHoverableContent={!collapsed}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={active || hasActiveSubItem ? "secondary" : "ghost"}
              size={collapsed ? "icon" : "default"}
              className={cn(
                "w-full justify-start",
                collapsed ? "h-10 w-10" : "px-2",
                (active || hasActiveSubItem) && "bg-secondary",
                hasSubItems && "justify-between",
                !(active || hasActiveSubItem) &&
                  "hover:bg-primary/10 hover:text-primary",
              )}
              onClick={hasSubItems ? toggleSubMenu : onClick}
              asChild
            >
              {hasSubItems ? (
                <div
                  className={cn(
                    "flex items-center",
                    collapsed ? "justify-center" : "justify-between w-full",
                  )}
                >
                  <div className="flex items-center">
                    {icon}
                    {!collapsed && <span className="ml-2">{label}</span>}
                  </div>
                  {!collapsed && hasSubItems && (
                    <div className="ml-2">
                      {isOpen ? (
                        <ChevronDown size={16} />
                      ) : (
                        <ChevronRight size={16} />
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to={href}
                  className={cn(
                    "flex items-center cursor-pointer",
                    collapsed ? "justify-center" : "justify-between w-full",
                  )}
                >
                  <div className="flex items-center">
                    {icon}
                    {!collapsed && <span className="ml-2">{label}</span>}
                  </div>
                </Link>
              )}
            </Button>
          </TooltipTrigger>
          {collapsed && !hasSubItems && (
            <TooltipContent side="right" className="flex items-center gap-4">
              {label}
            </TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>

      {hasSubItems && (isOpen || hasActiveSubItem) && !collapsed && (
        <div className="ml-6 mt-1 space-y-1 border-l pl-2">
          {subItems.map((subItem) => {
            const isActive = location.pathname === subItem.href;
            return (
              <Button
                key={subItem.id}
                variant="ghost"
                size="sm"
                className={cn(
                  "w-full justify-start px-2 gap-2",
                  isActive
                    ? "bg-secondary text-secondary-foreground"
                    : "hover:bg-primary/10 hover:text-primary",
                )}
                asChild
              >
                <Link
                  to={subItem.href}
                  className="flex items-center cursor-pointer"
                >
                  {getSubItemIcon(subItem.label)}
                  <span>{subItem.label}</span>
                </Link>
              </Button>
            );
          })}
        </div>
      )}
    </div>
  );
};

const Sidebar = ({
  collapsed = false,
  onToggleCollapse,
  className,
  isMobile = false,
}: SidebarProps) => {
  // Use react-router hooks for navigation and active state
  const location = useLocation();
  const [activeItem, setActiveItem] = useState("");
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(collapsed);

  // Get current location and set active item
  React.useEffect(() => {
    const path = location.pathname;

    // First check for exact matches
    if (path === "/") {
      setActiveItem("dashboard");
      return;
    }

    // Check for main sections
    const mainSections = [
      { path: "/pharmacy-dashboard", id: "pharmacy-dashboard" },
      { path: "/opd-dashboard", id: "opd-dashboard" },
      { path: "/ipd-dashboard", id: "ipd-dashboard" },
      { path: "/lab-dashboard", id: "lab-dashboard" },
      { path: "/laboratory", id: "laboratory" },
      { path: "/modules", id: "modules" },
      { path: "/settings", id: "settings" },
      { path: "/help", id: "help" },
      { path: "/docs", id: "documentation" },
    ];

    const exactMatch = mainSections.find((section) => section.path === path);
    if (exactMatch) {
      setActiveItem(exactMatch.id);
      return;
    }

    // Check for section prefixes
    const sectionPrefixes = [
      { prefix: "/records", id: "records" },
      { prefix: "/security", id: "security" },
      { prefix: "/patients", id: "patients" },
      { prefix: "/doctors", id: "doctors" },
      { prefix: "/opd", id: "opd" },
      { prefix: "/ipd", id: "ipd" },
      { prefix: "/pharmacy", id: "pharmacy" },
      { prefix: "/lab", id: "lab" },
      { prefix: "/laboratory", id: "laboratory" },
      { prefix: "/billing", id: "billing" },
    ];

    const prefixMatch = sectionPrefixes.find((section) =>
      path.startsWith(section.prefix),
    );
    if (prefixMatch) {
      setActiveItem(prefixMatch.id);
      return;
    }

    // Default to dashboard if no match
    setActiveItem("dashboard");
  }, [location.pathname]);

  const handleNavClick = (itemId: string) => {
    setActiveItem(itemId);
  };

  const toggleMobileSidebar = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  const handleToggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
    if (onToggleCollapse) {
      onToggleCollapse();
    }
  };

  const navItems = [
    // {
    //   id: "dashboard",
    //   label: "Admin Dashboard",
    //   icon: <LayoutDashboard size={20} />,
    //   href: "/",
    // },
    // {
    //   id: "pharmacy-dashboard",
    //   label: "Pharmacy Dashboard",
    //   icon: <Pill size={20} />,
    //   href: "/pharmacy-dashboard",
    // },
    {
      id: "opd-dashboard",
      label: "OPD Dashboard",
      icon: <Stethoscope size={20} />,
      href: "/opd-dashboard",
    },
    {
      id: "ipd-dashboard",
      label: "IPD Dashboard",
      icon: <BedDouble size={20} />,
      href: "/ipd-dashboard",
    },
    {
      id: "lab-dashboard",
      label: "Lab Dashboard",
      icon: <FlaskConical size={20} />,
      href: "/lab-dashboard",
    },
    {
      id: "laboratory",
      label: "Laboratory Management",
      icon: <TestTube size={20} />,
      subItems: [
        { id: "dashboard", label: "Dashboard", href: "/laboratory" },
        { id: "tests", label: "Test Catalog", href: "/laboratory/tests" },
        {
          id: "orders",
          label: "Order Management",
          href: "/laboratory/orders",
        },
        {
          id: "samples",
          label: "Sample Management",
          href: "/laboratory/samples",
        },
        { id: "results", label: "Results Entry", href: "/laboratory/results" },
        { id: "reports", label: "Reports", href: "/laboratory/reports" },
        { id: "packages", label: "Packages", href: "/laboratory/packages" },
        { id: "machines", label: "Machines", href: "/laboratory/machines" },
        { id: "settings", label: "Settings", href: "/laboratory/settings" },
      ],
    },
    {
      id: "patients",
      label: "Patient Management",
      icon: <Users size={20} />,
      subItems: [
        { id: "management", label: "Management", href: "/patients/management" },
      ],
    },
    {
      id: "doctors",
      label: "Doctor Management",
      icon: <Stethoscope size={20} />,
      subItems: [
        { id: "management", label: "Management", href: "/doctors" },
        { id: "scheduling", label: "Scheduling", href: "/doctors/scheduling" },
        {
          id: "appointments",
          label: "Appointments",
          href: "/doctors/appointments",
        },
      ],
    },
    {
      id: "opd",
      label: "OPD",
      icon: <Stethoscope size={20} />,
      subItems: [
        { id: "diseases", label: "Diseases", href: "/opd/diseases" },
        { id: "symptoms", label: "Symptoms", href: "/opd/symptoms" },
        { id: "tests", label: "Tests", href: "/opd/tests" },
        { id: "dosage", label: "Dosage", href: "/opd/dosage" },
        { id: "days", label: "Days", href: "/opd/days" },
        {
          id: "pending-patients",
          label: "Pending Patients",
          href: "/opd/pending-patients",
        },
        { id: "checkup", label: "OPD Checkup", href: "/opd/checkup" },
        { id: "billing", label: "OPD Billing", href: "/opd/billing" },
      ],
    },
    // {
    //   id: "ipd",
    //   label: "IPD",
    //   icon: <BedDouble size={20} />,
    //   subItems: [
    //     { id: "dashboard", label: "Dashboard", href: "/ipd" },
    //     { id: "wards", label: "Wards", href: "/ipd/wards" },
    //     { id: "rooms", label: "Rooms", href: "/ipd/rooms" },
    //     { id: "beds", label: "Beds", href: "/ipd/beds" },
    //     { id: "services", label: "Services", href: "/ipd/services" },
    //     {
    //       id: "treatments",
    //       label: "Patient Treatments",
    //       href: "/ipd/treatments",
    //     },
    //     { id: "billing", label: "Billing", href: "/ipd/billing" },
    //     {
    //       id: "death-certificate",
    //       label: "Death Certificate",
    //       href: "/ipd/death-certificate",
    //     },
    //     {
    //       id: "birth-certificate",
    //       label: "Birth Certificate",
    //       href: "/ipd/birth-certificate",
    //     },
    //   ],
    // },
    // {
    //   id: "pharmacy",
    //   label: "Pharmacy",
    //   icon: <Pill size={20} />,
    //   subItems: [
    //     { id: "items", label: "Items", href: "/pharmacy/items" },
    //     { id: "customers", label: "Customers", href: "/pharmacy/customers" },
    //     { id: "inventory", label: "Inventory", href: "/pharmacy/inventory" },
    //     {
    //       id: "prescriptions",
    //       label: "Prescriptions",
    //       href: "/pharmacy/prescriptions",
    //     },
    //     { id: "purchase", label: "Purchase", href: "/pharmacy/purchase" },
    //     { id: "sales", label: "Sales", href: "/pharmacy/sales" },
    //   ],
    // },
    // {
    //   id: "records",
    //   label: "Records & Definitions",
    //   icon: <Database size={20} />,
    //   subItems: [
    //     { id: "categories", label: "Categories", href: "/records/categories" },
    //     {
    //       id: "departments",
    //       label: "Departments",
    //       href: "/records/departments",
    //     },
    //     { id: "companies", label: "Companies", href: "/records/companies" },
    //     {
    //       id: "warehouses",
    //       label: "Warehouses",
    //       href: "/records/warehouses",
    //     },
    //     { id: "banks", label: "Banks", href: "/records/banks" },
    //     {
    //       id: "uoms",
    //       label: "Units of Measurement",
    //       href: "/records/uoms",
    //     },
    //     { id: "forms", label: "Forms", href: "/records/forms" },
    //     { id: "templates", label: "Templates", href: "/records/templates" },
    //     { id: "reports", label: "Reports", href: "/records/reports" },
    //   ],
    // },
    // {
    //   id: "security",
    //   label: "Security",
    //   icon: <ShieldCheck size={20} />,
    //   subItems: [
    //     { id: "users", label: "User Management", href: "/security/users" },
    //     { id: "roles", label: "Roles", href: "/security/roles" },
    //     {
    //       id: "permissions",
    //       label: "Permissions",
    //       href: "/security/permissions",
    //     },
    //     {
    //       id: "control-panel",
    //       label: "Control Panel",
    //       href: "/security/control-panel",
    //     },
    //   ],
    // },
    // {
    //   id: "modules",
    //   label: "Modules",
    //   icon: <Package size={20} />,
    //   href: "/module-selection",
    // },
    // {
    //   id: "settings",
    //   label: "Settings",
    //   icon: <Settings size={20} />,
    //   href: "/settings",
    // },
    // {
    //   id: "help",
    //   label: "Help",
    //   icon: <HelpCircle size={20} />,
    //   href: "/help",
    // },
    // {
    //   id: "documentation",
    //   label: "Documentation",
    //   icon: <FileText size={20} />,
    //   href: "/docs",
    // },
    {
      id: "logout",
      label: "Logout",
      icon: <LogOut size={20} />,
      href: "/login",
    },
  ];

  return (
    <>
      {/* Mobile sidebar toggle button */}
      {isMobile && (
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden fixed top-4 left-4 z-50"
          onClick={toggleMobileSidebar}
        >
          {isMobileOpen ? <X size={20} /> : <Menu size={20} />}
        </Button>
      )}

      {/* Mobile sidebar */}
      {isMobile && (
        <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
          <SheetContent side="left" className="p-0 w-[280px]">
            <div className="flex flex-col h-full">
              <div className="p-4 border-b">
                <h2 className="text-lg font-semibold">Menu</h2>
              </div>
              <ScrollArea className="flex-1">
                <div className="p-2 space-y-1">
                  {navItems.map((item) => (
                    <NavItem
                      key={item.id}
                      icon={item.icon}
                      label={item.label}
                      href={item.href}
                      active={activeItem === item.id}
                      subItems={item.subItems}
                      onClick={() => {
                        handleNavClick(item.id);
                        if (!item.subItems) {
                          setIsMobileOpen(false);
                        }
                      }}
                    />
                  ))}
                </div>
              </ScrollArea>
            </div>
          </SheetContent>
        </Sheet>
      )}

      {/* Desktop sidebar */}
      <div
        className={cn(
          "hidden md:flex flex-col h-full border-r transition-all duration-300",
          isCollapsed ? "w-[60px]" : "w-[280px]",
          className,
        )}
      >
        <div
          className={cn(
            "flex items-center justify-between p-4 border-b",
            isCollapsed && "justify-center",
          )}
        >
          {!isCollapsed && <h2 className="text-lg font-semibold">Menu</h2>}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleToggleCollapse}
            className="h-8 w-8"
          >
            {isCollapsed ? (
              <ChevronRightIcon size={18} />
            ) : (
              <ChevronLeft size={18} />
            )}
          </Button>
        </div>
        <ScrollArea className="flex-1">
          <div className="p-2 space-y-1">
            {navItems.map((item) => (
              <NavItem
                key={item.id}
                icon={item.icon}
                label={item.label}
                href={item.href}
                active={activeItem === item.id}
                collapsed={isCollapsed}
                subItems={item.subItems}
                onClick={() => handleNavClick(item.id)}
              />
            ))}
          </div>
        </ScrollArea>
      </div>
    </>
  );
};

export default Sidebar;
