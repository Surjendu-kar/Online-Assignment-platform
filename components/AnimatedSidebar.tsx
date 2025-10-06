"use client";

import * as React from "react";
import { useCallback, useEffect, useState, useMemo } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion } from "motion/react";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarRail,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarMenuAction,
} from "@/components/animate-ui/components/radix/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/animate-ui/primitives/radix/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/animate-ui/components/radix/dropdown-menu";
import {
  AudioWaveform,
  BadgeCheck,
  Bell,
  BookOpen,
  Bot,
  ChevronRight,
  ChevronsUpDown,
  CreditCard,
  Folder,
  Forward,
  Frame,
  GalleryVerticalEnd,
  LogOut,
  Map,
  MoreHorizontal,
  Plus,
  Settings2,
  Sparkles,
  SquareTerminal,
  Trash2,
  Edit,
  MoreVertical,
  User,
  FileText,
  Calendar,
  BarChart3,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useIsMobile } from "@/hooks/use-mobile";
import { ThemeTogglerButton } from "@/components/animate-ui/components/buttons/theme-toggler";
import { DepartmentDialog } from "@/components/DepartmentDialog";
import departmentsData from "@/data/departmentsData.json";
import { supabase } from "@/lib/supabase/client";
import { signOut } from '@/lib/auth';

interface Department {
  id: string;
  name: string;
  code: string;
  description: string;
  logo: React.ComponentType<{ className?: string }>;
}

interface DepartmentFormData {
  name: string;
  code: string;
  description: string;
}

interface Breadcrumb {
  title: string;
  url: string;
  isLast: boolean;
}

interface NavItem {
  title: string;
  url: string;
  icon: React.ComponentType;
  items?: {
    title: string;
    url: string;
  }[];
}

// Map departments data to include logos
const DEPARTMENTS_WITH_LOGOS = departmentsData.map((dept) => ({
  ...dept,
  logo:
    dept.code === "ALL"
      ? GalleryVerticalEnd
      : dept.code === "BCA"
      ? SquareTerminal
      : dept.code === "BBA"
      ? AudioWaveform
      : dept.code === "CSE"
      ? Bot
      : dept.code === "ECE"
      ? BookOpen
      : dept.code === "MBA"
      ? Settings2
      : GalleryVerticalEnd,
}));

// Define navigation items for different roles
const NAV_ITEMS: Record<string, NavItem[]> = {
  admin: [
    {
      title: "Management",
      url: "/admin/management",
      icon: SquareTerminal,
      items: [
        {
          title: "Teachers",
          url: "/admin/management/teachers",
        },
        {
          title: "Students",
          url: "/admin/management/students",
        },
        {
          title: "Exams",
          url: "/admin/management/exams",
        },
      ],
    },
    {
      title: "Analytics",
      url: "/admin/analytics",
      icon: BarChart3,
      items: [
        {
          title: "Platform Stats",
          url: "/admin/analytics/platform-stats",
        },
        {
          title: "Usage Reports",
          url: "/admin/analytics/usage-reports",
        },
        {
          title: "Performance",
          url: "/admin/analytics/performance",
        },
      ],
    },
    {
      title: "Communications",
      url: "/admin/communications",
      icon: BookOpen,
      items: [
        {
          title: "Notifications",
          url: "/admin/communications/notifications",
        },
        {
          title: "Messages",
          url: "/admin/communications/messages",
        },
        {
          title: "Announcements",
          url: "/admin/communications/announcements",
        },
      ],
    },
    {
      title: "Settings",
      url: "/admin/settings",
      icon: Settings2,
      items: [
        {
          title: "System Config",
          url: "/admin/settings/system-config",
        },
        {
          title: "Permissions",
          url: "/admin/settings/permissions",
        },
        {
          title: "Security",
          url: "/admin/settings/security",
        },
        {
          title: "Backup",
          url: "/admin/settings/backup",
        },
      ],
    },
  ],
  teacher: [
    {
      title: "Management",
      url: "/teacher/management",
      icon: SquareTerminal,
      items: [
        {
          title: "Students",
          url: "/teacher/management/students",
        },
        {
          title: "Exams",
          url: "/teacher/management/exams",
        },
      ],
    },
    {
      title: "Analytics",
      url: "/teacher/analytics",
      icon: BarChart3,
      items: [
        {
          title: "Student Performance",
          url: "/teacher/analytics/performance",
        },
        {
          title: "Exam Results",
          url: "/teacher/analytics/results",
        },
      ],
    },
  ],
  student: [
    {
      title: "Dashboard",
      url: "/student/dashboard",
      icon: SquareTerminal,
    },
    {
      title: "Exams",
      url: "/student/exams",
      icon: FileText,
    },
    {
      title: "Results",
      url: "/student/results",
      icon: BarChart3,
    },
  ],
};

const RECENT_ITEMS: Record<string, any[]> = {
  admin: [
    {
      name: "Recent Assignments",
      url: "/admin/recent-assignments",
      icon: Frame,
    },
    {
      name: "Pending Invitations",
      url: "/admin/pending-invitations",
      icon: Map,
    },
  ],
  teacher: [
    {
      name: "Recent Exams",
      url: "/teacher/recent-exams",
      icon: Frame,
    },
    {
      name: "Pending Invitations",
      url: "/teacher/pending-invitations",
      icon: Map,
    },
  ],
  student: [
    {
      name: "Upcoming Exams",
      url: "/student/upcoming-exams",
      icon: Calendar,
    },
    {
      name: "Recent Results",
      url: "/student/recent-results",
      icon: BarChart3,
    },
  ],
};

// Helper function to generate breadcrumbs from pathname
function generateBreadcrumbs(pathname: string): Breadcrumb[] {
  const segments = pathname.split("/").filter(Boolean);
  const breadcrumbs: Breadcrumb[] = [];

  // Skip role prefix for breadcrumbs
  if (segments[0] === "admin" || segments[0] === "teacher" || segments[0] === "student") {
    segments.shift(); // Remove role from segments
  }

  let currentPath = pathname.split("/").slice(0, 2).join("/"); // Start from role base

  for (let i = 0; i < segments.length; i++) {
    currentPath += `/${segments[i]}`;
    const isLast = i === segments.length - 1;

    // Convert segment to title case
    const title = segments[i]
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    breadcrumbs.push({
      title,
      url: currentPath,
      isLast,
    });
  }

  return breadcrumbs;
}

// Extract sidebar content to prevent unnecessary re-renders
const SidebarContentMemo = React.memo(({
  navItems,
  recentItems,
  pathname,
  openSection,
  setOpenSection,
  isPathInSection
}: {
  navItems: NavItem[];
  recentItems: any[];
  pathname: string;
  openSection: string;
  setOpenSection: (section: string) => void;
  isPathInSection: (sectionPath: string) => boolean;
}) => {
  const isMobile = useIsMobile();
  
  return (
    <>
      <SidebarGroup>
        <SidebarGroupLabel>Platform</SidebarGroupLabel>
        <SidebarMenu>
          {navItems.map((item: NavItem) => (
            item.items && item.items.length > 0 ? (
              // Items with sub-items (use collapsible)
              <Collapsible
                key={item.title}
                asChild
                open={openSection === item.title}
                onOpenChange={(isOpen) => {
                  if (isOpen) {
                    setOpenSection(item.title);
                  } else if (openSection === item.title) {
                    setOpenSection("");
                  }
                }}
                className="group/collapsible"
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton tooltip={item.title}>
                      {item.icon && <item.icon />}
                      <span>{item.title}</span>
                      <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.items?.map((subItem: { title: string; url: string }) => (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton
                            asChild
                            isActive={pathname === subItem.url}
                          >
                            <Link href={subItem.url}>
                              <span>{subItem.title}</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            ) : (
              // Items without sub-items (simple link)
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === item.url}
                  tooltip={item.title}
                >
                  <Link href={item.url}>
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          ))}
        </SidebarMenu>
      </SidebarGroup>
      <SidebarGroup className="group-data-[collapsible=icon]:hidden">
        <SidebarGroupLabel>Quick Access</SidebarGroupLabel>
        <SidebarMenu>
          {recentItems.map((item: any) => (
            <SidebarMenuItem key={item.name}>
              <SidebarMenuButton asChild isActive={pathname === item.url}>
                <Link href={item.url}>
                  <item.icon />
                  <span>{item.name}</span>
                </Link>
              </SidebarMenuButton>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuAction showOnHover>
                    <MoreHorizontal />
                    <span className="sr-only">More</span>
                  </SidebarMenuAction>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-48 rounded-lg"
                  side={isMobile ? "bottom" : "right"}
                  align={isMobile ? "end" : "start"}
                >
                  <DropdownMenuItem>
                    <Folder className="text-muted-foreground" />
                    <span>View Project</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Forward className="text-muted-foreground" />
                    <span>Share Project</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Trash2 className="text-muted-foreground" />
                    <span>Delete Project</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          ))}
          <SidebarMenuItem>
            <SidebarMenuButton className="text-sidebar-foreground/70">
              <MoreHorizontal className="text-sidebar-foreground/70" />
              <span>More</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroup>
    </>
  );
});

export function AnimatedSidebar({ children }: { children: React.ReactNode }) {
  const isMobile = useIsMobile();
  const pathname = usePathname();
  const [departments, setDepartments] = React.useState<Department[]>(
    DEPARTMENTS_WITH_LOGOS
  );
  const [activeDepartment, setActiveDepartment] = React.useState<Department>(
    DEPARTMENTS_WITH_LOGOS[0]
  );
  const [editingDepartment, setEditingDepartment] =
    React.useState<Department | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userData, setUserData] = useState<any>(null);

  const breadcrumbs = useMemo(() => {
    return generateBreadcrumbs(pathname);
  }, [pathname]);

  // Check if current path belongs to a navigation section
  const isPathInSection = useCallback(
    (sectionPath: string): boolean => {
      return pathname.startsWith(sectionPath);
    },
    [pathname]
  );

  // State to manage which section is open
  const [openSection, setOpenSection] = React.useState<string>(() => {
    if (userRole) {
      return NAV_ITEMS[userRole]?.find((item) => isPathInSection(item.url))?.title || "";
    }
    return "";
  });

  // Fetch user data and role
  useEffect(() => {
    // First, try to get role from localStorage
    const storedRole = localStorage.getItem('userRole');
    const storedFirstName = localStorage.getItem('userFirstName') || '';
    const storedLastName = localStorage.getItem('userLastName') || '';
    const storedEmail = localStorage.getItem('userEmail') || '';

    if (storedRole) {
      setUserRole(storedRole.toLowerCase());
      setUserData({
        first_name: storedFirstName,
        last_name: storedLastName,
        email: storedEmail,
        role: storedRole
      });
    } else {
      // Fallback to API call if localStorage doesn't have the role
      const fetchUserData = async () => {
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            try {
              // Fetch user profile data directly using the user ID
              const { data: profileData, error: profileError } = await supabase
                .from('user_profiles')
                .select('*')
                .eq('id', user.id)
                .single();
              
              if (!profileError && profileData) {
                setUserRole(profileData.role.toLowerCase());
                setUserData({
                  ...user,
                  first_name: profileData.first_name,
                  last_name: profileData.last_name,
                  role: profileData.role,
                  email: profileData.email
                });
                
                // Also store in localStorage for future use
                localStorage.setItem('userRole', profileData.role);
                localStorage.setItem('userFirstName', profileData.first_name || '');
                localStorage.setItem('userLastName', profileData.last_name || '');
                localStorage.setItem('userEmail', profileData.email || '');
              }
            } catch (error) {
              console.error('Error fetching user profile:', error);
            }
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      };

      fetchUserData();
    }
  }, []); // Empty dependency array means this runs only once

  // Update open section when pathname or userRole changes
  useEffect(() => {
    if (userRole) {
      const currentSection = NAV_ITEMS[userRole]?.find((item) =>
        isPathInSection(item.url)
      );
      if (currentSection) {
        setOpenSection(currentSection.title);
      }
    }
  }, [pathname, isPathInSection, userRole]);

  // Memoize department functions to prevent unnecessary re-renders
  const handleAddDepartment = useCallback((department: DepartmentFormData): void => {
    const newDepartment: Department = {
      id: department.code.toLowerCase(),
      name: department.name,
      description: department.description || `${department.code} Department`,
      code: department.code,
      logo: GalleryVerticalEnd,
    };
    setDepartments((prev) => [...prev, newDepartment]);
  }, []);

  const handleUpdateDepartment = useCallback((department: DepartmentFormData): void => {
    if (!editingDepartment) return;

    const updatedDepartment: Department = {
      ...editingDepartment,
      name: department.name,
      description: department.description || `${department.code} Department`,
      code: department.code,
    };

    setDepartments((prev) =>
      prev.map((dept) =>
        dept.id === editingDepartment.id ? updatedDepartment : dept
      )
    );

    // Update active department if it was the one being edited
    if (activeDepartment.id === editingDepartment.id) {
      setActiveDepartment(updatedDepartment);
    }

    setEditingDepartment(null);
  }, [activeDepartment.id, editingDepartment]);

  const handleSaveDepartment = useCallback((department: DepartmentFormData): void => {
    if (editingDepartment) {
      handleUpdateDepartment(department);
    } else {
      handleAddDepartment(department);
    }
  }, [editingDepartment, handleAddDepartment, handleUpdateDepartment]);

  const handleEditDepartment = useCallback((department: Department): void => {
    setEditingDepartment(department);
    setIsEditDialogOpen(true);
  }, []);

  const handleDeleteDepartment = useCallback((department: Department): void => {
    if (
      window.confirm(
        `Are you sure you want to delete ${department.name} department?`
      )
    ) {
      setDepartments((prev) =>
        prev.filter((dept) => dept.id !== department.id)
      );

      // If the deleted department was active, switch to "All Departments"
      if (activeDepartment.id === department.id) {
        setActiveDepartment(DEPARTMENTS_WITH_LOGOS[0]); // "All Departments"
      }
    }
  }, [activeDepartment.id]);

  // Memoize navigation items to prevent unnecessary re-renders
  const navItems = useMemo(() => {
    return userRole ? NAV_ITEMS[userRole] || [] : [];
  }, [userRole]);
  
  const recentItems = useMemo(() => {
    return userRole ? RECENT_ITEMS[userRole] || [] : [];
  }, [userRole]);

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton
                    size="lg"
                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                  >
                    <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                      <activeDepartment.logo className="size-4" />
                    </div>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">
                        {activeDepartment.name}
                      </span>
                      <span className="truncate text-xs">
                        {activeDepartment.description}
                      </span>
                    </div>
                    <ChevronsUpDown className="ml-auto" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                  align="start"
                  side={isMobile ? "bottom" : "right"}
                  sideOffset={4}
                >
                  <DropdownMenuLabel className="text-xs text-muted-foreground">
                    Departments
                  </DropdownMenuLabel>
                  {departments.map((department) => (
                    <DropdownMenuItem
                      key={department.name}
                      onClick={() => setActiveDepartment(department)}
                      className="gap-2 p-2"
                    >
                      <div className="flex size-6 items-center justify-center rounded-sm border">
                        <department.logo className="size-4 shrink-0" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-medium">{department.name}</span>
                        <span className="text-xs text-muted-foreground w-50 truncate">
                          {department.description}
                        </span>
                      </div>
                      {department.code !== "ALL" && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button
                              className="ml-auto p-1 cursor-pointer"
                              title="More options"
                              aria-label="More options"
                            >
                              <MoreVertical className="h-3 w-3" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            className="w-32"
                            side="right"
                            align="start"
                          >
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditDepartment(department);
                              }}
                              className="cursor-pointer"
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              <span>Edit</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteDepartment(department);
                              }}
                              className="cursor-pointer text-red-600 focus:text-red-600"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              <span>Delete</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator />
                  <DepartmentDialog
                    trigger={
                      <DropdownMenuItem
                        className="gap-2 p-2"
                        onSelect={(e) => e.preventDefault()}
                      >
                        <div className="flex size-6 items-center justify-center rounded-md border border-dashed">
                          <Plus className="size-4" />
                        </div>
                        <div className="font-medium text-muted-foreground">
                          Add department
                        </div>
                      </DropdownMenuItem>
                    }
                    onSaveDepartment={handleSaveDepartment}
                  />
                  {editingDepartment && (
                    <DepartmentDialog
                      key={editingDepartment.id}
                      editDepartment={editingDepartment}
                      isOpen={isEditDialogOpen}
                      onOpenChange={(open) => {
                        setIsEditDialogOpen(open);
                        // Don't immediately clear editingDepartment - let the animation complete
                        if (!open) {
                          // Delay clearing the editingDepartment to allow close animation
                          setTimeout(() => {
                            setEditingDepartment(null);
                          }, 500); // Match the dialog animation duration
                        }
                      }}
                      onSaveDepartment={(dept) => {
                        handleSaveDepartment(dept);
                        setIsEditDialogOpen(false);
                        // Clear editingDepartment after animation completes
                        setTimeout(() => {
                          setEditingDepartment(null);
                        }, 500);
                      }}
                    />
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <SidebarContentMemo 
            navItems={navItems}
            recentItems={recentItems}
            pathname={pathname}
            openSection={openSection}
            setOpenSection={setOpenSection}
            isPathInSection={isPathInSection}
          />
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton
                    size="lg"
                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                  >
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarImage
                        src={userData?.user_metadata?.avatar_url || ""}
                        alt={userData?.first_name || "User"}
                      />
                      <AvatarFallback className="rounded-lg">
                        {userData?.first_name?.charAt(0) || "U"}
                        {userData?.last_name?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">
                        {userData?.first_name} {userData?.last_name}
                      </span>
                      <span className="truncate text-xs">
                        {userData?.email}
                      </span>
                    </div>
                    <ChevronsUpDown className="ml-auto size-4" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                  side={isMobile ? "bottom" : "right"}
                  align="end"
                  sideOffset={4}
                >
                  <DropdownMenuLabel className="p-0 font-normal">
                    <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                      <Avatar className="h-8 w-8 rounded-lg">
                        <AvatarImage
                          src={userData?.user_metadata?.avatar_url || ""}
                          alt={userData?.first_name || "User"}
                        />
                        <AvatarFallback className="rounded-lg">
                          {userData?.first_name?.charAt(0) || "U"}
                          {userData?.last_name?.charAt(0) || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-semibold">
                          {userData?.first_name} {userData?.last_name}
                        </span>
                        <span className="truncate text-xs">
                          {userData?.email}
                        </span>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem>
                      <User />
                      Profile
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={async () => {
                    await signOut();
                  }}>
                    <LogOut />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>

      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Breadcrumb>
              <BreadcrumbList>
                {breadcrumbs.map((breadcrumb: Breadcrumb, index: number) => (
                  <React.Fragment key={breadcrumb.url}>
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        duration: 0.4,
                        delay: index * 0.15,
                        ease: "easeOut",
                      }}
                    >
                      <BreadcrumbItem>
                        {breadcrumb.isLast ? (
                          <BreadcrumbPage>{breadcrumb.title}</BreadcrumbPage>
                        ) : (
                          <span className="text-muted-foreground">
                            {breadcrumb.title}
                          </span>
                        )}
                      </BreadcrumbItem>
                    </motion.div>
                    {!breadcrumb.isLast && index < breadcrumbs.length - 1 && (
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{
                          duration: 0.4,
                          delay: index * 0.15 + 0.1,
                          ease: "easeOut",
                        }}
                      >
                        <BreadcrumbSeparator className="hidden md:block mt-1" />
                      </motion.div>
                    )}
                  </React.Fragment>
                ))}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="ml-auto px-4">
            <ThemeTogglerButton
              variant="ghost"
              size="xs"
              modes={["light", "dark"]}
            />
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}