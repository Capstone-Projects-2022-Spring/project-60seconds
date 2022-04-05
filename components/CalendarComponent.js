import React, {useState} from "react";
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { format, startOfWeek, addDays, startOfMonth, endOfMonth, endOfWeek, isSameMonth, isSameDay, subMonths, addMonths, isBefore } from "date-fns";
import Container from "@mui/material/Container";
import Box from '@mui/material/Box'
import Day from '../components/day';

export default function calendar({dateArray}) {

    const [selectedDate, setSelectedDate] = useState(new Date());
    const [activeDate, setActiveDate] = useState(new Date())
    const [data, setData] = useState(new Date());

    const parentToChild = (dateToSet) => {
        setData(dateToSet);
    }

    const dates = [];

    Object.entries(dateArray).forEach(entry => {
        const [key, value] = entry;
        
        //there is a strange error where days from database that are converted to JS date objects are one day behind.
        //this is a temporary fix that adds a day to the returned dates to keep things accurate. [AS 4/2/22]
        var date = new Date(value);
        date.setDate(date.getDate() + 1);

        dates.push(date);
      })

      //console.log(dates);
    const getHeader = () => {
        return (
            <div className="header">
                <div 
                    className="todayButton"
                    onClick={() => {
                        setSelectedDate(new Date());
                        setActiveDate(new Date());
                        parentToChild(new Date());
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

    //returns true if currentDate is found in array of dates returned from database
    const isDateInDatabase = (currentDate) => {
        for(const date of dates){
            if(isSameDay(date, currentDate)){
                return true;
            }
        }
    }

    const generateDatesForCurrentWeek = (date, selectedDate, activeDate) => {
        let currentDate = date;
        const week = [];
        for(let day = 0; day < 7; day++){
            const cloneDate = currentDate;

            week.push(
                <div key={currentDate}
                    className={`day 
                        ${isSameMonth(currentDate, activeDate) ? "" : "inactiveDay"} 
                        ${isDateInDatabase(currentDate) ? "dayWithRecording" : ""}
                        ${isSameDay(currentDate, selectedDate) ? "selectedDay" : ""}
                        ${isSameDay(currentDate, new Date()) ? "today" : ""}}`}
                    onClick={() => {
                        //if new selected date is not in current month displayed
                        if(!isSameMonth(cloneDate, activeDate)){
                            if(isBefore(cloneDate, activeDate)){
                                //if selected date is from previous month
                                setActiveDate(subMonths(activeDate, 1));
                                setSelectedDate(cloneDate);
                                //console.log(cloneDate);
                                parentToChild(cloneDate);
                            } else {
                                //if selected date is from next month
                                setActiveDate(addMonths(activeDate, 1));
                                setSelectedDate(cloneDate);
                                //console.log(cloneDate);
                                parentToChild(cloneDate);
                            }
                        } else {
                            //if selected date is in current month
                            setSelectedDate(cloneDate);
                            //console.log(cloneDate);
                            parentToChild(cloneDate);
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
            <Box sx={{
                flexDirection: "row",
                display: "flex", 
                alignItems: 'center'
            }}>
                <Container maxWidth="md">
                    {getHeader()}
                    {getWeekDaysNames()}
                    {getDates()}
                </Container>
                <Day parentToChild={data}/>
            </Box>
        </div>
    )
}