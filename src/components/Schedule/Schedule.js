import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { getSchedule } from "../../firebase/utils";
import { IoIosArrowForward } from "react-icons/io";
import TimeBooker from "./TimeBooker";

import "../cssFiles/schedule.css";
import "../cssFiles/timebooker.css";

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Oct",
  "Sep",
  "Nov",
  "Dec",
];

const Schedule = () => {
  const location = useLocation();
  const [sectionData, setSectionData] = useState();
  const [validHours, setValidHours] = useState([]);
  const [timeClicked, setTimeClicked] = useState(new Date());
  const [bookingVisible, setBookingVisible] = useState(false);
  const { section } = location.state;

  const start = new Date(section.data.startTime.seconds * 1000);
  const end = new Date(section.data.endTime.seconds * 1000);

  const getValidTimes = () => {
    if (start < end && sectionData) {
      let sectionCounter = 0;
      let sectionStart = null;
      let sectionEnd = null;
      let timeAnchor = new Date(start);
      console.log(sectionData);
      if (sectionData.length > 0) {
        sectionStart = new Date(sectionData[0].startTime.seconds * 1000);
        sectionEnd = new Date(sectionData[0].endTime.seconds * 1000);
      } else {
        sectionStart = new Date(start);
        sectionEnd = new Date(end);
      }

      let validHours = [];
      let startTime = start;
      let content = [];
      console.log(sectionStart);
      while (startTime < end) {
        if (startTime > sectionEnd) {
          sectionCounter = sectionCounter + 1;
          if (sectionData[sectionCounter] != null) {
            sectionStart = new Date(
              sectionData[sectionCounter].startTime.seconds * 1000
            );
            sectionEnd = new Date(
              sectionData[sectionCounter].endTime.seconds * 1000
            );
          }
        }

        if (
          sectionStart.getTime() <= startTime.getTime() &&
          startTime <= sectionEnd &&
          sectionData[sectionCounter] != null
        ) {
          content.push({
            data: sectionData[sectionCounter],
            booked: true,
            time: new Date(startTime),
          });
          if (
            sectionData[sectionCounter + 1] != null &&
            startTime.getTime() >= sectionEnd.getTime()
          ) {
            let nextSectionStartTime = new Date(
              sectionData[sectionCounter + 1].startTime.seconds * 1000
            );
            if (nextSectionStartTime.getTime() > startTime.getTime()) {
              content.push({
                booked: false,
                time: `${startTime.getHours()}:${
                  startTime.getMinutes() < 1 ? "00" : startTime.getMinutes()
                }`,
                date: new Date(startTime),
              });
            } else if (nextSectionStartTime.getTime() == startTime.getTime()) {
              content.push({
                data: sectionData[sectionCounter + 1],
                booked: true,
                time: new Date(startTime),
              });
            }
          } else if (
            sectionData[sectionCounter + 1] == null &&
            startTime.getTime() >= sectionEnd.getTime()
          ) {
            content.push({
              booked: false,
              time: `${startTime.getHours()}:${
                startTime.getMinutes() < 1 ? "00" : startTime.getMinutes()
              }`,
              date: new Date(startTime),
            });
          }
        } else {
          content.push({
            booked: false,
            time: `${startTime.getHours()}:${
              startTime.getMinutes() < 1 ? "00" : startTime.getMinutes()
            }`,
            date: new Date(startTime),
          });
        }

        if (startTime.getTime() == sectionEnd.getTime()) {
          validHours.push({
            time: `${timeAnchor.getHours()} :${
              timeAnchor.getMinutes() < 1 ? "00" : timeAnchor.getMinutes()
            }`,
            date: `${months[timeAnchor.getMonth()]}${timeAnchor.getDate()} `,
            content: content,
            startDate: new Date(startTime),
          });
          timeAnchor = new Date(startTime);

          content = [];
        } else if (
          startTime.getTime() > sectionEnd.getTime() &&
          startTime.getMinutes() == 0
        ) {
          validHours.push({
            time: `${timeAnchor.getHours()}:${
              timeAnchor.getMinutes() < 1 ? "00" : timeAnchor.getMinutes()
            }`,
            date: `${months[timeAnchor.getMonth()]}${timeAnchor.getDate()} `,
            content: content,
            startDate: new Date(timeAnchor),
          });
          timeAnchor = new Date(startTime);
          content = [];
        } else if (
          sectionData[sectionCounter] == null &&
          startTime.getMinutes() == 0 &&
          startTime.getTime() !=
            new Date(section.data.startTime.seconds * 1000).getTime()
        ) {
          validHours.push({
            time: `${startTime.getHours() - 1}:${
              startTime.getMinutes() < 1 ? "00" : startTime.getMinutes()
            }`,
            date: `${months[startTime.getMonth()]}${startTime.getDate()} `,
            content: content,
            startDate: new Date(startTime),
          });

          content = [];
        }
        startTime.setMinutes(startTime.getMinutes() + 15);
      }

      setValidHours(validHours);
    }
  };

  const getData = async () => {
    if (section) {
      const data = await getSchedule(section.id);
      setSectionData(data);
    }
  };
  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    getValidTimes();
  }, [sectionData]);

  const openBooking = (date) => {
    console.log(date);
    setTimeClicked(date);
    setBookingVisible(!bookingVisible);
  };
  let first;
  let validation;

  console.log(validHours);

  return (
    <div className="main-container">
      <TimeBooker
        visible={bookingVisible}
        timeClicked={timeClicked}
        closeBooking={() => setBookingVisible(false)}
      />
      {validHours.map((hour) => {
        return (
          <div>
            {hour.content.map((e) => {
              if (e.booked) {
                if (validation == e.data.name) {
                  first = false;
                }

                if (validation !== e.data.name) {
                  first = true;
                  validation = e.data.name;
                }
                return (
                  <div className={!first ? "booked" : "first-section"}>
                    <p>{e.data.name + " " + e.time}</p>
                  </div>
                );
              }

              return (
                <button onClick={() => openBooking(e.date)} className="button">
                  {" "}
                  {`+ ${e.time}`}
                </button>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

export default Schedule;
