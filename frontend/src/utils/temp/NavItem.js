import { BarChart2, CreditCard, Home, Settings, Wallet } from "lucide-react";

export const NAV_ITEMS = [
  {
    key: "home",
    label: "Trang chính",
    icon: Home,
    to: "/",
    end: true,
    badge: null,
  },
  {
    key: "trans",
    label: "Giao dịch",
    icon: CreditCard,
    to: "/transactions",
    end: false,
    badge: null,
  },
  {
    key: "wallet",
    label: "Ví & Tài sản",
    icon: Wallet,
    to: "/wallets",
    end: false,
    badge: null,
  },
  {
    key: "report",
    label: "Báo cáo & Phân tích",
    icon: BarChart2,
    to: "/reports",
    end: false,
    badge: null,
    highlight: false,
  },
  {
    key: "personal",
    label: "Cá nhân",
    icon: Settings,
    to: "/profile",
    end: false,
    badge: null,
  },
];
