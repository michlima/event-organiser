import React, { useEffect, useState } from "react";
import { postForm } from "../../firebase/utils";
import "../cssFiles/timebooker.css";

const TimeBooker = ({ visible, closeBooking, id, timeClicked }) => {
  const [formData, setFormData] = useState({
    name: "",
    startTime: null,
    endTime: null,
  });
  const [visibility, setVisibility] = useState("closing-animation invisible");

  useEffect(() => {
    if (visible) {
      setVisibility("booking-animation");
    }
    setFormData((prev) => ({
      ...prev,
      startTime: `${timeClicked.getHours()}:00`,
    }));
  }, [visible]);

  const close = () => {
    setVisibility("closing-animation invisible");
    closeBooking();
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    let realvalue = value;
    if (type == "time") {
      let nums = [0, 15, 30, 45];
      let minutes = value.substring(3, 5);
      minutes = Number(minutes);
      let target = minutes;
      var closest = nums.sort(function (a, b) {
        var a = Math.abs(a - target);
        var b = Math.abs(b - target);

        return a < b ? -1 : a > b ? 1 : 0;
      });
      realvalue =
        closest[0] < 1
          ? `${value.substring(0, 2)}:00`
          : `${value.substring(0, 2)}:${closest[0]}`;
    }
    console.log(realvalue);
    setFormData((prev) => ({
      ...prev,
      [name]: realvalue,
    }));
  };

  const validate = (form) => {
    console.log();
    if (form.name.length < 1) {
      return { error: true, response: "Please inform your name" };
    } else {
      console.log(timeClicked.getMonth());
      console.log(timeClicked);
      let date1 = new Date(
        `${timeClicked.getFullYear()}-${
          timeClicked.getMonth() < 9
            ? `0${timeClicked.getMonth() + 1}`
            : timeClicked.getMonth() + 1
        }-${
          timeClicked.getDate() < 9
            ? `0${timeClicked.getDate()}`
            : timeClicked.getDate()
        }T${formData.startTime}Z`
      );
      let date2 = new Date();
      console.log(date1);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let form = formData;
    const res = validate(form);
    // let startDate = new Date(timeClicked.date);
    console.log(form);

    // postForm(formData, id);
  };

  console.log(timeClicked);

  return (
    <div className={`time-booker-container ` + visibility}>
      <form onSubmit={handleSubmit} className="book-container">
        <label>
          {timeClicked.getDate()} - {timeClicked.getHours()}:
          {timeClicked.getMinutes()}
        </label>
        <label>
          Name:
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
        </label>
        <label>
          Duration:
          <input
            type="time"
            name="endTime"
            value={formData.endTime}
            onChange={handleChange}
          />
        </label>
        <button type="submit">Book</button>
      </form>
      <button onClick={() => close()}>x</button>
    </div>
  );
};

export default TimeBooker;
