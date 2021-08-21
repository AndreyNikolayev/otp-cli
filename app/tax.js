var FormData = require('form-data');
var axios = require('axios').default;

const getRate = require('./exchange-rate.js');
var TaxPeriod = require('./data/tax-period.js');

async function tax(page, accounts, period) {
  var targetCurrency = 'USD';

  var targetAccount = accounts.find(p => !p.isTransit && p.currency === targetCurrency);

  if(!targetAccount) {
    return 'USD account is not found';
  }

  if(!targetAccount.statementLink) {
    return 'Link to account statement page is not found';
  }

  var targetPeriod = new TaxPeriod(period ? period: getPreviousPeriod());

  var cookies = await page.cookies();

  var fileText = await getFileResponse(targetAccount.id, targetPeriod, cookies);

  const taxableAmounts = fileText.split(/\r\n/).filter(p => p).map(line => {
    var lineParts = line.trim().split(/(\s+)/).filter(p => p.trim());

    return {
      amount: (+lineParts[4])/100,
      date: getDateFromFileString(lineParts[lineParts.length - 1])
    }
  });

  const amountsWithExchangeRates = await Promise.all(taxableAmounts.map(async p => {
    var rate = await getRate(targetCurrency, p.date);

    return {
      ...p,
      exchangeRate: rate,
      nationalCurrencyAmount: Number((p.amount * rate).toFixed(2))
    };
  }));

  const yearTotal = Number(amountsWithExchangeRates.reduce((a, b) => a + b.nationalCurrencyAmount, 0).toFixed(2));
  const quarterTotal = Number(amountsWithExchangeRates.filter(p => p.date.getTime() >= targetPeriod.quarterStartDate.getTime())
  .reduce((a, b) => a + b.nationalCurrencyAmount, 0).toFixed(2));

  const yearTax = Number((yearTotal * 0.05).toFixed(2));
  const quarterTax = Number((quarterTotal * 0.05).toFixed(2));

  const result = {
    yearTotal: yearTotal,
    quarterTotal: quarterTotal,
    yearTax: yearTax,
    quarterTax: quarterTax
  };

  return `Year earnings: ${result.yearTotal}
Quarter earnings: ${result.quarterTotal}
Year tax: ${result.yearTax}
Quarter tax: ${result.quarterTax}`;
}

async function getFileResponse(accountId, targetPeriod, cookies) {
  const form = new FormData();

  var options = {
    exportType: 2,
    documentType: 1,
    periodType: 9,
    doctype: 3,
    dateFrom: getFormattedDateString(targetPeriod.yearStartDate),
    dateTill: getFormattedDateString(targetPeriod.quarterEndDate),
    daysCount: 1,
    contractorId: '', 
    fileName: '',
    accountId: accountId,
    revertDateOrder: false,
    digitsSeparation: false,
    bookedDateSort: false,
    feeOneLine: false,
    showRevaluation: false
  }

  for(var propertyName in options) {
    form.append(propertyName, options[propertyName].toString());
 }


  const response = await axios({
    method: 'post',
    url: 'https://otpay.com.ua/ifobsClientSMB/StatementSaveFile.action',
    data: form,
    headers: {
          'Content-Type': `multipart/form-data; boundary=${form._boundary}`,
          'Cookie': cookies.map(p => `${p.name}=${p.value};`).join(' ')
    }
  });

  return response.data;
}

function getDateFromFileString(dateString) {
  var parts = dateString.match(/.{2}/g);

  return new Date(Number(`20${parts[0]}`), +parts[1] - 1, parts[2]);
}

function getFormattedDateString(date) {
  return `${date.getDate().toString().padStart(2, '0')}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getFullYear()}`;
}

function getPreviousPeriod() {
  var date = new Date();

  var year = date.getFullYear();
  var month = date.getMonth() + 1;

  if(month <= 3) {
    return `${year - 1}/4`;
  };

  if(month <= 6) {
    return `${year}/1`;
  }

  if(month <= 9) {
    return `${year}/2`;
  }

  return `${year}/3`;
}


module.exports = tax;