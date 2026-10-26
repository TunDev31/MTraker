import { Ban, Film, HelpCircle, ShoppingCart, Utensils, Van } from "lucide-react";

export const TAG_OPTIONS = [
  { label: "ĂN UỐNG", value: "food" },
  { label: "ĐI LẠI", value: "travel" },
  { label: "GIẢI TRÍ", value: "entertainment" },
  { label: "MUA SẮM", value: "shopping" },
  { label: "KHÁC", value: "none" },
  {label:"LƯƠNG", value:"salary"}
];

export const TAG_CONFIG = {
  food: { label: "Ăn uống", icon: Utensils },
  travel: { label: "Đi lại", icon: Van },
  entertainment: { label: "Giải trí", icon: Film },
  shopping: { label: "Mua sắm", icon: ShoppingCart },
  khac: { label: "Khác", icon: HelpCircle },
  none: { label: "Không có tag", icon: Ban },
};