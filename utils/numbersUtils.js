const isNumber = (txt) => {
  const pattern = /^[+-]?(\d+(\.\d+)?|\.\d+)$/;
  return pattern.test(txt);
}

module.exports = isNumber;