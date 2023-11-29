const groupBy = (key: string) => (array: any[]) =>
  Object.values(
    array.reduce((acc, val) => {
      const property = val[key];
      acc[property] = acc[property] || {
        type: property,
        [key]: [],
      };
      acc[property][key].push(val);
      return acc;
    }, {})
  );

export default groupBy;
