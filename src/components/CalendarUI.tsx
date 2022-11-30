import { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; // css import

const CalendarUI = ({
  open,
  close,
  mark,
  className,
}: {
  open: boolean;
  close: () => void;
  mark: string[];
  className: string;
}) => {
  const [value, onChange] = useState(new Date());

  return open ? (
    <div className={className}>
      <button
        className="bg-white border border-b-0 border-gray-400 px-1 font-bold"
        onClick={close}
      >
        ✕
      </button>
      <Calendar
        value={value}
        onChange={onChange}
        formatDay={(locale, date) => String(new Date(date).getDate())}
        className="select-none"
        showNeighboringMonth={false}
        tileContent={({ date, view }) => {
          const localDateString = new Date(date).toLocaleDateString(); // 2022. 11. 1.
          const splitLocalDate = localDateString.split('. ');
          const formatDate = `${splitLocalDate[0]}-${
            splitLocalDate[1]
          }-${splitLocalDate[2].substring(0, splitLocalDate[2].length - 1)}`; // 2022-11-26
          const startOrEnd =
            (mark[0] === formatDate && '시작') || (mark[1] === formatDate && '종료');
          if (startOrEnd) {
            return (
              <div className="flex justify-center items-center absoluteDiv">
                <div
                  className={`text-xs md:text-sm font-semibold text-black rounded-full ${
                    startOrEnd === '시작' ? 'bg-red-200' : 'bg-blue-200'
                  }`}
                >
                  {startOrEnd}
                </div>
              </div>
            );
          }
          return null;
        }}
      />
    </div>
  ) : null;
};

export default CalendarUI;
