var Account = require('./data/account');

async function parseAccount(page) {
  var elements = await page.$$('tbody tr.cards-list__item__tr');
  return Promise.all(elements.map(async element => parseSingleAccount(element)));
}

async function parseSingleAccount(elementHandler) {
  var id = await elementHandler.evaluate(el => el.getAttribute("data-account-id"));
 
  var accountColumnts = await elementHandler.$$('td');
  var number = await accountColumnts[2].evaluate(element => element.textContent.trim());
  var currency = await accountColumnts[3].evaluate(element => element.textContent.trim());

  var accountBalance = await (await accountColumnts[7].$('div')).evaluate(element => element.textContent.trim());

  var paymentLink = await (await accountColumnts[8].$('a')).evaluate(element => element && element.getAttribute("href") || null);

  if(paymentLink && paymentLink.indexOf('NationalTransfersShow') === -1)
  {
    paymentLink = null;
  }

  return new Account(id, number,currency, accountBalance, process.env.BANK_URL + '/' + paymentLink);
}

module.exports = parseAccount;