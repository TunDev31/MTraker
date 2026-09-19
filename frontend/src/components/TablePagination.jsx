import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

export function TablePagination() {
  return (
    <Pagination>
      <PaginationContent>
        {/* Nút Previous */}
        <PaginationItem>
          <PaginationPrevious href="#" />
        </PaginationItem>

        {/* Trang 1 (Đang active) */}
        <PaginationItem>
          <PaginationLink href="#" isActive>1</PaginationLink>
        </PaginationItem>

        {/* Trang 2 */}
        <PaginationItem>
          <PaginationLink href="#">2</PaginationLink>
        </PaginationItem>

        {/* Dấu ba chấm */}
        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>

        {/* Nút Next */}
        <PaginationItem>
          <PaginationNext href="#" />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}