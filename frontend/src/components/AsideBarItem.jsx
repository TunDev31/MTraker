import { cn } from '@/lib/utils'
import React from 'react'
import { NavLink } from 'react-router'

const AsideBarItem = ({label, icon: Icon, to, end, badge, highlight,isExpand}) => {
  return (
       <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              cn(
                "group flex items-center  gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150",
                isActive
                  ? "bg-[#f0f4ff] text-green-700 border-2 border-l-green-700"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                highlight && !isActive && "text-green-700",
                !isExpand && "justify-center",
              )
            }
          >
            {({ isActive }) => (
              <>
                {/* Active indicator dot */}
               

                <Icon
                  className={cn(
                    "w-4 h-4 shrink-0 transition-colors",
                    isActive
                      ? "text-green-700"
                      : highlight
                        ? "text-[#2563eb]"
                        : "text-gray-400 group-hover:text-gray-600",
                  )}
                />

                <span
                  className={cn(
                    "flex-1 truncate",
                    highlight && !isActive && "text-[#2563eb] font-semibold",
                    !isExpand && "hidden",
                  )}
                >
                  {label}
                </span>
              </>
            )}
          </NavLink>
  )
}

export default AsideBarItem