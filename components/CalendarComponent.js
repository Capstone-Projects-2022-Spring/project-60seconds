import React, {useState} from "react";
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { format, startOfWeek, addDays, startOfMonth, endOfMonth, endOfWeek, isSameMonth, isSameDay, subMonths, addMonths, isBefore } from "date-fns";

export default function calendar() {

    const [selectedDate, setSelectedDate] = useState(new Date());
    const [activeDate, setActiveDate] = useState(new Date())

    const getHeader = () => {
        return (
            <div className="header">
                <div 
                    className="todayButton"
                    onClick={() => {
                        setSelectedDate(new Date());
                        setActiveDate(new Date());
                    }}
                >Today
                </div>
                <ChevronLeftIcon 
                    className="navIcon"
                    onClick={() => setActiveDate(subMonths(activeDate, 1))}
                />
                <ChevronRightIcon 
                    className="navIcon"
                    onClick={() => setActiveDate(addMonths(activeDate, 1))}
                />
                <h2 className="currentMonth">{format(activeDate, "MMMM yyyy")}</h2>
            </div>
        )
    };
    const getWeekDaysNames = () => {
        const weekStartDate = startOfWeek(activeDate);
        const weekDays = [];
        for(let day = 0; day < 7; day++){
            weekDays.push(
                <div className="day weekNames" key={day}>
                    {format(addDays(weekStartDate, day), "E")}
                </div>
            )
        }
        return <div className="weekContainer">{weekDays}</div>
    };

    const generateDatesForCurrentWeek = (date, selectedDate, activeDate) => {
        let currentDate = date;
        const week = [];
        for(let day = 0; day < 7; day++){
            const cloneDate = currentDate;
            week.push(
                <div key={currentDate}
                    className={`day 
                        ${isSameMonth(currentDate, activeDate) ? "" : "inactiveDay"} 
                        ${isSameDay(currentDate, selectedDate) ? "selectedDay" : ""}
                        ${isSameDay(currentDate, new Date()) ? "today" : ""}}`}
                    onClick={() => {
                        //if new selected date is not in current month displayed
                        if(!isSameMonth(cloneDate, activeDate)){
                            if(isBefore(cloneDate, activeDate)){
                                //if selected date is from previous month
                                setActiveDate(subMonths(activeDate, 1));
                                setSelectedDate(cloneDate);
                                console.log(cloneDate);
                            } else {
                                //if selected date is from next month
                                setActiveDate(addMonths(activeDate, 1));
                                setSelectedDate(cloneDate);
                                console.log(cloneDate);
                            }
                        } else {
                            //if selected date is in current month
                            setSelectedDate(cloneDate);
                            console.log(cloneDate);
                        }
                    }}  
                >
                    {format(currentDate, "d")}
                </div>
            );
            currentDate = addDays(currentDate, 1);
        }
        return <React.Fragment key={Math.random() /*temporary key*/}>{week}</React.Fragment>;
    }

    const getDates = () => {
        const startOfTheSelectedMonth = startOfMonth(activeDate);
        const endOfTheSelectedMonth = endOfMonth(activeDate);
        const startDate = startOfWeek(startOfTheSelectedMonth);
        const endDate = endOfWeek(endOfTheSelectedMonth);
        
        let currentDate = startDate;

        const allWeeks = [];

        while(currentDate<=endDate){
            allWeeks.push(generateDatesForCurrentWeek(currentDate, selectedDate, activeDate));
            currentDate = addDays(currentDate, 7);
        }

        return <div className="weekContainer">{allWeeks}</div>
    };

    return(
        <div className="calendar">
            {getHeader()}
            {getWeekDaysNames()}
            {getDates()}
        </div>
    )
}