const getPercent = (num1, num2) => {
  return (Math.min(num1, num2) / Math.max(num1, num2)) * 100;
};
module.exports = { getPercent };
