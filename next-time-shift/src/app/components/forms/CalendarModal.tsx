'use client';

import React, { useState } from 'react';
import { format, getDaysInMonth, startOfMonth, addDays, isSameDay, isDate } from 'date-fns';

interface DatePickerModalProps {
  onDateSelect: (date: Date) => void;
  disabledDates?: Date[];
}

function CalendarModal({ onDateSelect, disabledDates = [] }: DatePickerModalProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());

  const days: Date[] = [];
  const monthStart = startOfMonth(currentMonth);
  const daysInMonthCount = getDaysInMonth(currentMonth);

  for (let i = 0; i < daysInMonthCount; i++) {
    days.push(addDays(monthStart, i));
  }

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    onDateSelect(date);
    setIsOpen(false);
  };

  const isDateDisabled = (date: Date): boolean => {
    return disabledDates.some((disabledDate) => isSameDay(date, disabledDate));
  };

  return (
    <div className="relative">
      <button
        className="pl-3 text-left font-normal flex w-full border border-gray-300 rounded-md p-2"
        onClick={() => setIsOpen(true)}
      >
        {selectedDate ? format(selectedDate, 'PP') : 'Pick a date'}
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-4 rounded-md shadow-lg w-full max-w-sm">
            <div className="flex justify-between mb-4">
              <button onClick={() => setCurrentMonth(addDays(currentMonth, -daysInMonthCount))}>
                {'<'}
              </button>
              <span>{format(currentMonth, 'MMMM yyyy')}</span>
              <button onClick={() => setCurrentMonth(addDays(currentMonth, daysInMonthCount))}>
                {'>'}
              </button>
            </div>

            <div className="grid grid-cols-7 gap-1">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <span key={day} className="text-center text-sm">
                  {day}
                </span>
              ))}

              {days.map((day) => (
                <button
                  key={day.toISOString()}
                  className={`p-2 rounded-md text-center ${
                    isSameDay(day, selectedDate || new Date(0))
                      ? 'bg-blue-500 text-white'
                      : ''
                  } ${isDateDisabled(day) ? 'text-gray-400 cursor-not-allowed' : 'hover:bg-gray-100'}`}
                  onClick={() => !isDateDisabled(day) && handleDateSelect(day)}
                  disabled={isDateDisabled(day)}
                >
                  {format(day, 'd')}
                </button>
              ))}
            </div>
            <button className="mt-4 bg-blue-500 text-white p-2 rounded-md w-full" onClick={() => setIsOpen(false)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default CalendarModal;