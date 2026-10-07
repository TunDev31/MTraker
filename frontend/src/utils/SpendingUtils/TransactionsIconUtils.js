import { Ban, Banknote, Film, ShoppingCart, Utensils, Van } from "lucide-react";

export const ICON_MAP = {
    food: Utensils ,
    travel: Van,
    entertainment: Film,
    none: Ban,
    shopping: ShoppingCart ,
    transfer: Banknote
  };
export const ICON_CLASS = {
    food: ' bg-yellow-200 ',
    travel: ' bg-blue-200 ',
    entertainment: ' bg-purple-200 ',
    shopping: 'bg-orange-600 ',
    khac: 'bg-gray-200 ',
    transfer: 'bg-green-200'
  };
export const ICON_COLOR = {
  food: 'brown',
    travel: 'blue',
    entertainment: 'purple',
    shopping: 'white',
    khac: 'white',
    transfer: 'white'
}
export const ICON_TEXTCOLOR = {
  food: 'text-orange-900',
    travel: 'text-blue-900',
    entertainment: 'text-purple-900',
    shopping: 'text-white',
    khac: 'white',
    none: '',
    transfer: 'white'
}