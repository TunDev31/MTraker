import { Film, HelpCircle, Utensils, Van } from "lucide-react";
import React from "react";

const TransactionsDetails = (item) => {
  const ICON_MAP = {
    food: Utensils,
    travel: Van,
    entertainment: Film,
  };
  const iconKey = item.tag?.[0]?.toLowerCase();
  const IconComponent = ICON_MAP[iconKey] || HelpCircle;
  return (
    <div className="h-full w-full bg-white ">
      <div className="flex gap-1">
        <div>
          <IconComponent />
        </div>
        <div>
          <p>Chi tiet giao dich</p>
          <p>14:46- Hom nay</p>
        </div>
        <div>X</div>
      </div>
      <div>
        <p>{item.title}</p>
      </div>
    </div>
  );
};

export default TransactionsDetails;
