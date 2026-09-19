import React from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export default function MyCombobox({ 
  data , 
  placeholder = "Chọn...", 
  searchPlaceholder = "Tìm kiếm...", 
  emptyMessage = "Không tìm thấy.",
  value, 
  onChange ,
  className = ""
}) {
  const [open, setOpen] = React.useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
  render={
    <Button
      variant="outline"
      role="combobox"
      aria-expanded={open}
      className={cn(
            // Các class mặc định của Combobox
            "w-fit justify-between rounded-xl px-3 py-2 text-sm font-medium",
           
            
            className // 2. Đặt className truyền vào ở CỐI để ghi đè class mặc định
          )}
    >
      {value
        ? data.find((item) => item.value === value)?.label
        : placeholder}
      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
    </Button>
  }
/>
      <PopoverContent className="w-fit p-0 rounded-xl">
        <Command>
          <CommandInput className="focus:ring-emerald-500 inline-block" placeholder={searchPlaceholder} />
          <CommandList>
            <CommandEmpty>{emptyMessage}</CommandEmpty>
            <CommandGroup>
              {data.map((item) => (
                <CommandItem
                  key={item.value}
                  value={item.value}
                  onSelect={(currentValue) => {
                    onChange(currentValue === value ? "" : currentValue)
                    setOpen(false)
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === item.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {item.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}