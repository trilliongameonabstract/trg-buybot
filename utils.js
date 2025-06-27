const Web3 = require('web3');
const web3 = new Web3();

function formatETH(amount) {
  return parseFloat(web3.utils.fromWei(amount.toString(), 'ether')).toFixed(4);
}

function formatUSD(amount) {
  return `$${Number(amount).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function shortenAddress(address) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

module.exports = {
  formatETH,
  formatUSD,
  shortenAddress
};
