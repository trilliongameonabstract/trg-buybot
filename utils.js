const axios = require("axios");

const getUSDValue = async (amountTRG) => {
  try {
    const res = await axios.get("https://api.coingecko.com/api/v3/simple/price", {
      params: {
        ids: "ethereum",
        vs_currencies: "usd"
      }
    });

    const ethPrice = res.data.ethereum.usd || 0;
    const estETHperTRG = 0.0000001; // change to your rate later
    const usd = amountTRG * estETHperTRG * ethPrice;
    return usd.toFixed(2);
  } catch (err) {
    return "0.00";
  }
};

module.exports = { getUSDValue };
