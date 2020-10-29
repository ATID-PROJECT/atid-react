import React from "react";
import 'react-big-calendar/lib/css/react-big-calendar.css';
import myEventsList from './events';

import {Calendar, momentLocalizer} from 'react-big-calendar';
import moment from 'moment'

moment.locale('pt-BR');
const localizer = momentLocalizer(moment)

const CalendarPage = props => (
  <div>
    <Calendar
      localizer={localizer}
      events={myEventsList}
      startAccessor="start"
      endAccessor="end"
      style={{ height: 500 }}
      culture="pt-BR"
      messages={{
        month: 'Mês',
        week: 'Semana',
        day: 'Dia',
        today: 'Hoje',
        previous: '<',
        next: '>',
      }}
    />
  </div>
)

export default CalendarPage;