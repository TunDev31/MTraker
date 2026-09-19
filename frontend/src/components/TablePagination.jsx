import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { cn } from "@/lib/utils"

export function TablePagination({  pageNums,handlePrevPage,handleNextPage,handleChangePage,totalPage}) {
  const generatePage = ()=> {
    const arrPage = [];
    if (totalPage <=4) {
        for (let index = 1; index <=totalPage; index++) {
         arrPage.push(index);
        }
    } else {
      if (pageNums <=2) {
        arrPage.push(1,2,3,"...",totalPage);
      } else if (pageNums <= totalPage -1) {
        arrPage.push(1,"...",totalPage-1,totalPage);
      } else 
      {
        arrPage.push(1,"...",pageNums,"...",totalPage);
      }
    }
    return arrPage;
  }
  const pagesToShow = generatePage();
  return (

    <Pagination>
      <PaginationContent>

        {/* Nút Previous */}
        <PaginationItem>
          <PaginationPrevious 
            onClick={pageNums ===1 ? undefined : handlePrevPage}
            className={cn("cursor-pointer",pageNums===1 ? 'pointer-events-none opacity-50': '')}
          />
        </PaginationItem>

       {pagesToShow.map((p, index)=> { 
        return (
            <PaginationItem
            key={index}>
                {p==='...' ? <PaginationEllipsis/> : <PaginationLink
                isActive={p===pageNums}
                onClick={()=> {
                  if (p!==pageNums) handleChangePage(p);
                }}
                >
                  {p}
                  </PaginationLink>}    

            </PaginationItem>
       )

       })}



        {/* Nút Next */}
        <PaginationItem>
          <PaginationNext  onClick={pageNums === totalPage ? undefined : handleNextPage}
            className={cn("cursor-pointer",pageNums===totalPage ? 'pointer-events-none opacity-50': '')} />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}