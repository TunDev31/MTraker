import { useEffect, useMemo, useState } from "react"

export const usePagination = (trans,pageNumsLimit) => {
    const [pageNums,setPageNums] = useState(1);
    useEffect (()=>{
        if (pageNums> visibleTaskNums.totalPage) setPageNums(1);
    },[trans]);
    const visibleTaskNums = useMemo(()=>{
        const transShow = trans?.slice((pageNums-1)*pageNumsLimit,(pageNums)*pageNumsLimit );
        const totalPage = Math.ceil(trans.length / pageNumsLimit );
        return {
            transShow,
            totalPage
        }
    },[trans,pageNums]);
    const handlePrevPage = ()=> {
        if (pageNums > 1) setPageNums((prevNums)=> prevNums-1);
    }
    const handleNextPage = ()=> {
       if (pageNums < visibleTaskNums.totalPage) setPageNums((prevNums)=> prevNums+1);
    }
    const handleChangePage = (newPage)=> {
        setPageNums(newPage);
    }
    return {
        visibleTaskNums,pageNums ,handlePrevPage,handleNextPage,handleChangePage
    }
}