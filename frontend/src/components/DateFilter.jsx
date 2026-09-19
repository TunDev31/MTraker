import MyCombobox from './ui/MyCombobox'
import React from 'react'
const DateFilter = ({ selectedDateFilter, setSelectedDateFilter }) => {
    const today = new Date();
    const [selectedValue, setSelectedValue] = React.useState("day");
    const handleChange = (value) => {
        if (!value) return;
        setSelectedValue(value);
        
        setSelectedDateFilter(value);
    };
    const formattedDate = today.toLocaleDateString('vi-VN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
    return (
        <div className='flex justify-between items-center '>
           
            <div className='flex gap-2 sm:gap-2 items-center'>
                <p className=" text-xs font-bold text-center border-b border-slate-200 dark:border-slate-600 sm:text-base" >PHÂN TÍCH CHI TIÊU THEO</p>
             <MyCombobox value={selectedValue} onChange={handleChange} data = {[{ value: "day", label: "Ngày" }, { value: "month", label: "Tháng" }, { value: "year", label: "Năm" }]} />
            </div>
             <p className="text-xs sm:text-sm font-medium">{formattedDate}</p>
        </div>
    )
}
export default DateFilter