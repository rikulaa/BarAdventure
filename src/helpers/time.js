export const getDurationBetweenDates = (start, finish) => {
  //Get 1 minut in milliseconds
  const one_day=1000*60*60*24;
  const one_hour=1000*60*60;
  const one_minute=1000*60;
  const one_second=1000;
  const durationInMs = start - finish;

  // Calculate the difference in milliseconds
  const difference = start - finish;
  //take out milliseconds
  const difference_seconds = difference/1000;
  const seconds = Math.floor(difference_seconds % 60);

  difference_minutes = difference_seconds/60;
  var minutes = Math.floor(difference_minutes % 60);

  difference_hours = difference_minutes/60;
  var hours = Math.floor(difference_hours % 24);
  var days = Math.floor(difference_hours/24);

  return {seconds, minutes, hours, days};
};
