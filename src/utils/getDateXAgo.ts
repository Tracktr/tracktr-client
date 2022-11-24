const getDateXDaysAgo = (numOfDays: number, date = new Date()) => {
  const daysAgo = new Date(date.getTime());

  daysAgo.setDate(date.getDate() - numOfDays);

  return daysAgo;
};

export default getDateXDaysAgo;
