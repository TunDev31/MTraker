import { Ban, Film, ShoppingCart, Utensils, Van } from "lucide-react";

export const ICON_MAP = {
    food: Utensils ,
    travel: Van,
    entertainment: Film,
    none: Ban,
    shopping: ShoppingCart ,
    khac: Ban
  };
export const ICON_CLASS = {
    food: 'p-2 bg-yellow-200 rounded-full',
    travel: 'p-2 bg-blue-200 rounded-full',
    entertainment: 'p-2 bg-purple-200 rounded-full',
    shopping: 'p-2 bg-green-200 rounded-full',
    khac: 'p-2 bg-gray-200 rounded-full',
    none: ''
  };
