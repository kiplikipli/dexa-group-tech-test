'use client';

import * as React from 'react';
import { ChevronDownIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import dayjs from 'dayjs';

type DatepickerProps = {
  label: string;
  onChange: (date: dayjs.Dayjs) => void;
  defaultValue?: dayjs.Dayjs;
};

export function Datepicker({ label, onChange, defaultValue }: DatepickerProps) {
  const [open, setOpen] = React.useState(false);
  const [date, setDate] = React.useState<dayjs.Dayjs | undefined>(undefined);

  React.useEffect(() => {
    if (defaultValue) {
      setDate(defaultValue);
    }
  }, [defaultValue]);

  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={`${label}-datepicker`} className="px-1">
        {label}
      </Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            id={`${label}-datepicker`}
            className="w-full justify-between font-normal"
          >
            {date ? dayjs(date).format('DD MMMM YYYY') : 'Select date'}
            <ChevronDownIcon />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
          <Calendar
            mode="single"
            selected={date ? date.toDate() : undefined}
            captionLayout="dropdown"
            onSelect={(date) => {
              if (date) {
                const dayjsDate = dayjs(date);
                setDate(dayjsDate);
                setOpen(false);
                onChange(dayjsDate);
              }
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
