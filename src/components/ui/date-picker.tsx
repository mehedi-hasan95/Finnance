"use client";
import { CalendarIcon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { SelectSingleEventHandler } from "react-day-picker";
import { Button } from "./button";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar } from "./calendar";

type Props = {
  value?: Date;
  onChange?: SelectSingleEventHandler;
  disabled?: boolean;
};

export const DatePicker = ({ disabled, onChange, value }: Props) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          disabled={disabled}
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !value && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="size-4 mr-2" />
          {value ? format(value, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <Calendar
          mode="single"
          selected={value}
          onSelect={onChange}
          disabled={((date) => date > new Date()) || disabled}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
};
