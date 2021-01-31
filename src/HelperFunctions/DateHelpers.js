export const formatLongDate = (timestamp) => {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  let dateOutput;

  if (timestamp) {
    dateOutput =
      months[timestamp.toDate().getMonth()] +
      " " +
      timestamp.toDate().getDate() +
      " at " +
      (timestamp.toDate().getHours() > 12
        ? timestamp.toDate().getHours() - 12
        : timestamp.toDate().getHours()) +
      ":" +
      (timestamp.toDate().getMinutes() < 10
        ? "0" + timestamp.toDate().getMinutes()
        : timestamp.toDate().getMinutes()) +
      (timestamp.toDate().getHours() > 12 ? "pm" : "am");
  }

  return dateOutput;
};

export const formatLongDateDifference = (timestamp) => {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  let dateOutput;

  if (timestamp) {
    const oneMinute = 60 * 1000;
    const oneHour = 60 * oneMinute;
    const oneDay = 24 * oneHour;
    const presentMoment = new Date();
    const dateDifference = presentMoment - timestamp.toDate();

    switch (true) {
      case dateDifference < oneMinute:
        dateOutput = "now";
        break;
      case dateDifference < oneHour:
        dateOutput = Math.floor(dateDifference / oneMinute) + "m";
        break;
      case dateDifference < oneDay:
        dateOutput = Math.floor(dateDifference / oneHour) + "h";
        break;
      default:
        dateOutput =
          months[timestamp.toDate().getMonth()] +
          " " +
          timestamp.toDate().getDate() +
          " at " +
          (timestamp.toDate().getHours() > 12
            ? timestamp.toDate().getHours() - 12
            : timestamp.toDate().getHours()) +
          ":" +
          (timestamp.toDate().getMinutes() < 10
            ? "0" + timestamp.toDate().getMinutes()
            : timestamp.toDate().getMinutes()) +
          (timestamp.toDate().getHours() > 12 ? "pm" : "am");
    }
  }

  return dateOutput;
};

export const formatShortDateDifference = (timestamp) => {
  let dateOutput;

  if (timestamp) {
    const oneMinute = 60 * 1000;
    const oneHour = 60 * oneMinute;
    const oneDay = 24 * oneHour;
    const oneWeek = 7 * oneDay;
    const presentMoment = new Date();
    const dateDifference = presentMoment - timestamp.toDate();

    switch (true) {
      case dateDifference < oneMinute:
        dateOutput = "now";
        break;
      case dateDifference < oneHour:
        dateOutput = Math.floor(dateDifference / oneMinute) + "m";
        break;
      case dateDifference < oneDay:
        dateOutput = Math.floor(dateDifference / oneHour) + "h";
        break;
      case dateDifference < oneWeek:
        dateOutput = Math.floor(dateDifference / oneDay) + "d";
        break;
      case dateDifference <= 52 * oneWeek:
        dateOutput = Math.floor(dateDifference / oneWeek) + "w";
        break;

      default:
        dateOutput = Math.floor((dateDifference / 52) * oneWeek) + "y";
    }
  }

  return dateOutput;
};
