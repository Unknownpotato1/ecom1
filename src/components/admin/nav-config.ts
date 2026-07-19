import {
  LayoutDashboard,
  Package,
  FolderTree,
  Tags,
  ShoppingCart,
  Users,
  Ticket,
  Star,
  Image as ImageIcon,
  FileText,
  LayoutTemplate,
  Compass,
  Palette,
  Settings,
  ScrollText,
  DatabaseBackup,
  Code2,
  type LucideIcon,
} from "lucide-react";

export interface AdminNavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  description?: string;
}

export interface AdminNavGroup {
  label: string;
  items: AdminNavItem[];
}

export const adminNavGroups: AdminNavGroup[] = [
  {
    label: "Overview",
    items: [
      {
        label: "Dashboard",
        href: "/admin/dashboard",
        icon: LayoutDashboard,
        description: "Sales analytics & KPIs",
      },
    ],
  },
  {
    label: "Catalog",
    items: [
      {
        label: "Products",
        href: "/admin/products",
        icon: Package,
        description: "Manage your product catalog",
      },
      {
        label: "Collections",
        href: "/admin/collections",
        icon: FolderTree,
        description: "Group products into collections",
      },
      {
        label: "Categories",
        href: "/admin/products?tab=categories",
        icon: Tags,
        description: "Organize products by category",
      },
    ],
  },
  {
    label: "Sales",
    items: [
      {
        label: "Orders",
        href: "/admin/orders",
        icon: ShoppingCart,
        description: "View & fulfil customer orders",
      },
      {
        label: "Customers",
        href: "/admin/customers",
        icon: Users,
        description: "Customer profiles & history",
      },
      {
        label: "Coupons",
        href: "/admin/coupons",
        icon: Ticket,
        description: "Discount codes & promotions",
      },
    ],
  },
  {
    label: "Content",
    items: [
      {
        label: "Reviews",
        href: "/admin/reviews",
        icon: Star,
        description: "Moderate product reviews",
      },
      {
        label: "Media Library",
        href: "/admin/media",
        icon: ImageIcon,
        description: "Images, banners & assets",
      },
      {
        label: "Pages",
        href: "/admin/pages",
        icon: FileText,
        description: "CMS pages (About, FAQ, etc.)",
      },
    ],
  },
  {
    label: "Storefront",
    items: [
      {
        label: "Homepage Builder",
        href: "/admin/homepage-builder",
        icon: LayoutTemplate,
        description: "Drag-and-drop section editor",
      },
      {
        label: "Custom Sections",
        href: "/admin/custom-sections",
        icon: Code2,
        description: "Build HTML/CSS/JS sections",
      },
      {
        label: "Navigation",
        href: "/admin/navigation",
        icon: Compass,
        description: "Header, footer & announcements",
      },
      {
        label: "Theme Settings",
        href: "/admin/theme",
        icon: Palette,
        description: "Colors, fonts & layout",
      },
    ],
  },
  {
    label: "System",
    items: [
      {
        label: "Settings",
        href: "/admin/settings",
        icon: Settings,
        description: "Store, payment & shipping",
      },
      {
        label: "Activity Logs",
        href: "/admin/logs",
        icon: ScrollText,
        description: "Audit trail & events",
      },
      {
        label: "Backups",
        href: "/admin/settings?tab=backups",
        icon: DatabaseBackup,
        description: "Export & restore data",
      },
    ],
  },
];

export const adminNavItems: AdminNavItem[] = adminNavGroups.flatMap((g) => g.items);
