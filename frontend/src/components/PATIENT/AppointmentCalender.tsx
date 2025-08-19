import {
    dateFnsLocalizer,
    Calendar as BigCalendar,
} from 'react-big-calendar';
import {
    format,
    parse,
    startOfWeek,
    getDay,
} from 'date-fns';
import { enUS } from 'date-fns/locale';
import { Box, Typography } from '@mui/material';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const locales = {
    'en-US': enUS,
};

const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
    getDay,
    locales,
});

type AppointmentCalendarProps = {
    appointments: {
        appointment_date: string;
        reason_for_visit?: string;
    }[];
};

const AppointmentCalendar = ({ appointments }: AppointmentCalendarProps) => {
    const events = appointments.map((appt) => ({
        title: appt.reason_for_visit || 'Appointment',
        start: new Date(appt.appointment_date),
        end: new Date(appt.appointment_date),
        allDay: false,
    }));

    return (
        <Box mt={4}>
            <Typography variant="h6" gutterBottom>
                My Appointment Calendar
            </Typography>
            <BigCalendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                style={{ height: 500 }}
            />
        </Box>
    );
};

export default AppointmentCalendar;
