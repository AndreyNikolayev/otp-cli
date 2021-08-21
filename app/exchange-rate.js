const axios = require('axios').default;

const exchangeRateUrl = `https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?valcode=<CURRENCY>&date=<DATE>&json`

async function getExchangeRate(currency, date) {
  var exchangeRateUrl = getExchangeRateUrl(currency, date);

  var response = await axios.get(`${exchangeRateUrl}`);

  if(response.status !== 200) {
    throw new Error('Could not get exchange rate');
  }

  return response.data[0].rate;
}

function getExchangeRateUrl(currency, date) {
  var formattedDateString = getFormattedDateString(date);

  return exchangeRateUrl.replace('<CURRENCY>', currency).replace('<DATE>', formattedDateString);
}

function getFormattedDateString(date) {
  return date.getFullYear().toString() + (date.getMonth() + 1).toString().padStart(2, '0') + date.getDate().toString().padStart(2, '0');
}
  
module.exports = getExchangeRate;