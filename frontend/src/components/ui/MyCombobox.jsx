import React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export default function MyCombobox({
  data = [],
  placeholder = "Chọn...",
  searchPlaceholder = "Tìm kiếm...",
  emptyMessage = "Không tìm thấy.",
  value,
  onChange,
  className = "",
}) {
  const [open, setOpen] = React.useState(false);

  const selectedLabel = data?.find((item) => item.value === value)?.label;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      {/* 🟢 KHÔNG dùng asChild và KHÔNG dùng <Button> bên trong */}
      <PopoverTrigger
        role="combobox"
        aria-expanded={open}
        className={cn(
          "flex w-fit items-center justify-between rounded-xl px-2 py-1.5 text-sm font-normal hover:bg-[#323339] transition-colors cursor-pointer outline-none",
          !value && "text-gray-500",
          className
        )}
      >
        <span className="truncate">{selectedLabel || placeholder}</span>
        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </PopoverTrigger>

      <PopoverContent className="w-[--radix-popover-trigger-width] p-0 rounded-xl bg-primary border-gray-700 text-white shadow-xl z-50">
        <Command className="bg-transparent text-white">
          <CommandInput
            className="text-white  "
            placeholder={searchPlaceholder}
          />
          <CommandList>
            <CommandEmpty className="p-3 text-xs text-gray-400 text-center">
              {emptyMessage}
            </CommandEmpty>
            <CommandGroup>
              {data?.map((item) => (
                <CommandItem
                  key={item.value}
                  value={item.value}
                  onSelect={() => {
                    onChange(item.value === value ? "" : item.value);
                    setOpen(false);
                  }}
                  className="text-gray-200 hover:bg-[#3a3b42] hover:text-white cursor-pointer py-2 px-3 my-0.5 rounded-lg flex items-center justify-between"
                >
                  <span className="truncate">{item.label}</span>
                  <Check
                    className={cn(
                      "h-4 w-4 text-[#ccff00]",
                      value === item.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}