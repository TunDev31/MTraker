import { CircleAlert, ShieldAlert, ShieldCheck, TriangleAlert } from "lucide-react";

export const FUND_REMAIN = 30000;



export const limitLabel = {
  safe: {
    ICON: ShieldCheck ,
    LABEL: "An toàn",
    TEXT: "text-green-700",
    BGROUND: "bg-green-100",
  },
  caution: {
    ICON:TriangleAlert ,
    LABEL: "Cần chú ý",
    TEXT: "text-orange-600",
    BGROUND: "bg-orange-100",
  },
  warning: {
    ICON: CircleAlert  ,
    LABEL: "Cảnh báo",
    TEXT: "text-white",
    BGROUND: "bg-orange-900",
  },
  danger: {
    ICON: ShieldAlert,
    LABEL: "Nguy hiểm",
    TEXT: "text-red-900",
    BGROUND: "bg-red-200",
  },
};



export const getWarningLimitLabel = (percent) => {
  if (typeof percent !== "number" || Number.isNaN(percent)) return null;

  if (percent >= 100) return limitLabel.danger;
  if (percent >= 90) return limitLabel.warning;
  if (percent >= 70) return limitLabel.caution;
  return limitLabel.safe;
};