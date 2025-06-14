const buyers = {};

const trackBuyer = (address, amount) => {
  if (!buyers[address]) buyers[address] = 0;
  buyers[address] += amount;
};

const getTopBuyers = (limit = 3) => {
  const sorted = Object.entries(buyers)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit);

  let msg = `🏆 *Top ${limit} Buyers So Far* 🏆\n`;
  sorted.forEach(([addr, amt], idx) => {
    msg += `${idx + 1}. \`${addr}\` - ${amt.toLocaleString()} TRG\n`;
  });
  return msg;
};

module.exports = { trackBuyer, getTopBuyers };
