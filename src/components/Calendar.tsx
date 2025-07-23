'use client';

import { CalendarIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "@/components/ui/use-toast";
import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";

const FormSchema = z.object({
  dob: z.date({
    required_error: "A date is required.",
  }),
});

export function CalendarForm({ 
  onDateChange, 
  disabledDates = [], 
  calendarType = 'departure' 
}: { 
  onDateChange: (date: Date | null) => void, 
  disabledDates?: Date[], 
  calendarType?: 'departure' | 'return' 
}) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });
  
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  function onSubmit(data: z.infer<typeof FormSchema>) {
    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
  }
  
  if (!isClient) {
    return null;
  }
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 font-semibold w-full">
        <FormField
          control={form.control}
          name="dob"
          render={({ field }) => (
            <FormItem className="flex font-semibold flex-col">
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <div
                      className={cn(
                        "w-full flex items-center justify-between text-left text-sm font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span >{calendarType === 'departure' ? 'Date' : 'Return Date'}</span>
                      )}
                      <CalendarIcon className="ml-2 h-4 w-4 opacity-50" />
                    </div>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className={`w-auto font-semibold bg-white rounded-[1pc] z-[99999] p-0`} align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={(date) => {
                      field.onChange(date);
                      onDateChange(date ?? null);
                    }}
                    disabled={(date) => {
                      // Get today's date and reset the time to midnight
                      const today = new Date();
                      today.setHours(0, 0, 0, 0);
                      
                      // Get tomorrow's date
                      const tomorrow = new Date(today);
                      tomorrow.setDate(tomorrow.getDate());
                      
                      // Disable today and all dates before today
                      if (date < tomorrow) {
                        return true;
                      }
                      
                      // For the return date calendar, disable the selected departure dates
                      // and all dates before them
                      if (disabledDates.length > 0) {
                        return disabledDates.some(disabledDate =>
                          date.getTime() < disabledDate.getTime()
                        );
                      }
                      
                      return false;
                    }}
                    initialFocus
                    classNames={{
                      day_selected: "text-blue-500 font-semibold focus:text-orange-500",
                      day_today: "bg-blue-100 text-blue-900 font-medium"
                    }}
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
