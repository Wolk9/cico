import React from "react";
import moment from "moment";

export const date = (unixTime) => {
  console.log(unixTime);
  const { seconds, nanoseconds } = unixTime;
  console.log(unixTime, seconds, nanoseconds);
  const Date = moment.unix(seconds).add(nanoseconds / 1000000, "milliseconds");
  const formatedDate = Date.format("DD-MM-YYYY");

  console.log(formatedDate);
  return formatedDate;
};

export const time = (unixTime) => {
  console.log(unixTime);
  const { seconds, nanoseconds } = unixTime;
  console.log(unixTime, seconds, nanoseconds);
  const Date = moment.unix(seconds).add(nanoseconds / 1000000, "milliseconds");
  const formatedTime = Date.format("HH:mm:ss");

  console.log(formatedTime);
  return formatedTime;
};
