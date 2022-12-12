export const getDateXDaysAgo = (numOfDays: number, date = new Date()) => {
  const daysAgo = new Date(date.getTime());

  daysAgo.setDate(date.getDate() - numOfDays);

  return daysAgo;
};

export const getFirstDayOfMonth = (year: number, month: number) => {
  return new Date(year, month, 1);
};

export const getLastDayOfMonth = (year: number, month: number) => {
  return new Date(year, month + 1, 0);
};
