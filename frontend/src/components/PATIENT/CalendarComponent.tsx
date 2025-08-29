import * as React from "react";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import {
  PickersDay,
  type PickersDayProps,
} from "@mui/x-date-pickers/PickersDay";

const CalendarComponent = () => {
  const [value, setValue] = React.useState<Date | null>(new Date());

  // Dates to mark
  const markedDates = [
    new Date(2025, 7, 30).toDateString(), // Aug 30, 2025
    new Date(2025, 8, 1).toDateString(), // Sep 1, 2025
  ];

 // ✅ Custom Day component
  const CustomDay = (props: PickersDayProps) => {
    const { day } = props;
    const isMarked = markedDates.includes(day.toDateString());

    return (
      <PickersDay
        {...props}
        sx={{
          bgcolor: isMarked ? "green" : undefined,
          color: isMarked ? "white" : undefined,
          "&:hover": {
            bgcolor: isMarked ? "darkgreen" : undefined,
          },
        }}
      />
    );
  };


  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DateCalendar
        value={value}
        onChange={(newValue) => setValue(newValue)}
        slots={{
          day: CustomDay, // 👈 custom renderer here
        }}
      />
    </LocalizationProvider>
  );
};

export default CalendarComponent;
