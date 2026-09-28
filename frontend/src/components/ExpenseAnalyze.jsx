import { cn } from '@/lib/utils'
import { getDateFilter } from '@/utils/DateUtils/DateFilterUtils'
import React from 'react'
import TransactionsIcon from './TransactionsIcon'
const ExpenseAnalyze = ({selectedDateFilter,expenseStats}) => {
  return (
    <div className="grid grid-cols-2 gap-3">
            {/* 1.1.Thong ke tong chi tieu theo ngay */}
            <div className="flex flex-col px-2 py-3 gap-1 bg-white rounded-xl  shadow-md">
              {/* 1.1.1.Header */}
              <div className="flex justify-between items-center gap-1">
                <h2 className="text-xs font-semibold">
                  TỔNG CHI {getDateFilter(selectedDateFilter).toUpperCase()}
                </h2>
              </div>
              {/* 1.1.1.So tien */}
              <div className="flex gap-1 items-center">
                <p className="text-lg font-bold truncate">
                  {expenseStats.currentExpenseValueByDate.toLocaleString("vi-VN")}
                  
                </p>
                <span>VND</span>
              </div>
              {/* 1.1.1.So sanh ti le phan tram */}
              <div className="flex gap-1 items-center">
                <div
                  className={cn(
                    "rounded-2xl",
                    expenseStats.expensePercentage < 0
                      ? "bg-green-100"
                      : "bg-red-100",
                  )}
                >
                  <p
                    className={cn(
                      "mx-5",
                      expenseStats.expensePercentage < 0
                        ? "text-green-900"
                        : "text-red-900",
                    )}
                  >
                    {expenseStats.expensePercentage !== 0
                      ? `${expenseStats.isIncrease ? "+" : ""}${expenseStats.expensePercentage.toFixed(1)}%`
                      : `Chưa có dữ liệu`}
                  </p>
                </div>
    
                <p className="flex justify-center items-center gap-2 text-xs text-black">
                  {expenseStats.expensePercentage !== 0
                    ? `${getDateFilter(selectedDateFilter)} trước`
                    : ``}
                </p>
              </div>
            </div>
       
            <div className="flex flex-col p-2 gap-2 bg-white rounded-xl  shadow-md">
              <div className="flex items-center justify-center gap-1">
                <h2 className="items-center justify-center text-xs font-semibold">
                  DANH MỤC CHI NHIỀU
                </h2>
              </div>
              <div className="flex gap-2 items-center justify-center">
                <TransactionsIcon type={expenseStats.mostExpensiveType}/>
                <p className="text-lg font-bold text-black">
                  {expenseStats.mostExpensiveType}
            </p>
              </div>
              <div className='flex justify-center items-center'>
                <p className="text-sm flex gap-2">
                  <span className="text-green-700 justify-center items-center ">
                    {expenseStats.mostExpensePerDay.toFixed(0)} %
                  </span>
                  <span>
                    / Chi tiêu {getDateFilter(selectedDateFilter).toLowerCase()}
                  </span>
                </p>
              </div>
            </div>
          </div>
  )
}

export default ExpenseAnalyze