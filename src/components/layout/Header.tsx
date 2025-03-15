import React, { useState, useRef, useEffect } from "react";
import { Bell, Menu, Moon, Search, Settings, Sun, User, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import NotificationPanel from "./NotificationPanel";
import SettingsDrawer from "./SettingsDrawer";
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandGroup,
  CommandItem,
  CommandEmpty,
} from "@/components/ui/command";

interface HeaderProps {
  userName?: string;
  userAvatar?: string;
  notificationCount?: number;
  sidebarCollapsed?: boolean;
  onToggleSidebar?: () => void;
  isMobile?: boolean;
}

const Header = ({
  userName = "Dr. Smith",
  userAvatar = "",
  notificationCount = 3,
  sidebarCollapsed = false,
  onToggleSidebar = () => {},
  isMobile = false,
}: HeaderProps) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Mock search results
  const searchResults = [
    {
      id: "1",
      category: "Patients",
      items: [
        { id: "p1", name: "John Doe", path: "/patients/1" },
        { id: "p2", name: "Sarah Johnson", path: "/patients/2" },
      ],
    },
    {
      id: "2",
      category: "Appointments",
      items: [
        { id: "a1", name: "Dr. Smith - 2:00 PM", path: "/appointments/1" },
        { id: "a2", name: "Dr. Wilson - 3:30 PM", path: "/appointments/2" },
      ],
    },
    {
      id: "3",
      category: "Modules",
      items: [
        { id: "m1", name: "Patient Management", path: "/modules/patient" },
        { id: "m2", name: "Billing", path: "/modules/billing" },
        { id: "m3", name: "Laboratory", path: "/modules/lab" },
      ],
    },
  ];

  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsSearchOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle keyboard shortcut for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsCommandOpen(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((e) => {
        console.error(`Error attempting to enable fullscreen: ${e.message}`);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-40 w-full border-b bg-background py-3 shadow-sm",
          sidebarCollapsed ? "px-4" : "lg:pl-0 px-4",
          isMobile ? "pl-4" : "",
        )}
      >
        <div className="flex h-12 items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Mobile menu toggle - only show if isMobile is true */}
            {isMobile && (
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full"
                onClick={onToggleSidebar}
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            )}

            {/* Search bar */}
            <div className="relative max-w-md px-2" ref={searchRef}>
              <div
                className={cn(
                  "flex items-center rounded-md border bg-background px-4 py-3 text-sm shadow-sm",
                  isSearchOpen ? "ring-2 ring-ring" : "",
                  "w-[240px] sm:w-[280px] md:w-[300px] lg:w-[320px] xl:w-[400px]",
                  "mx-2",
                )}
                onClick={() => setIsCommandOpen(true)}
              >
                <Search className="mr-3 h-4 w-4 shrink-0 opacity-50" />
                <span className="text-muted-foreground">Search... (⌘K)</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-3">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full relative"
                >
                  <Bell className="h-5 w-5" />
                  {notificationCount > 0 && (
                    <Badge
                      className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                      variant="destructive"
                    >
                      {notificationCount}
                    </Badge>
                  )}
                  <span className="sr-only">Notifications</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <NotificationPanel />
              </PopoverContent>
            </Popover>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full"
                    onClick={() => setIsSettingsOpen(true)}
                  >
                    <Settings className="h-5 w-5" />
                    <span className="sr-only">Settings</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Settings</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-8 w-8 rounded-full"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={userAvatar} alt={userName} />
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {userName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>{userName}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setIsSettingsOpen(true)}>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Log out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Settings Drawer */}
      <SettingsDrawer
        open={isSettingsOpen}
        onOpenChange={setIsSettingsOpen}
        currentTheme="light"
        onToggleFullscreen={toggleFullscreen}
      />

      {/* Command Menu */}
      <CommandDialog open={isCommandOpen} onOpenChange={setIsCommandOpen}>
        <CommandInput
          placeholder="Search across the application..."
          value={searchQuery}
          onValueChange={setSearchQuery}
        />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          {searchResults.map((category) => (
            <CommandGroup key={category.id} heading={category.category}>
              {category.items.map((item) => (
                <CommandItem key={item.id}>{item.name}</CommandItem>
              ))}
            </CommandGroup>
          ))}
        </CommandList>
      </CommandDialog>
    </>
  );
};

export default Header;
