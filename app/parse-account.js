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

  var linkHandles = await accountColumnts[8].$$('a');

  var links = await Promise.all(linkHandles.map(async elementHandle => 
    await elementHandle.evaluate(async element => await element && element.getAttribute("href") || null)
  ));

  var fullLinkBuilder = (linkTextSearch) => {
    var link = links.find(p => p.indexOf(linkTextSearch) !== -1) || null;
    return link && process.env.BANK_URL + '/' + link;
  };

  return new Account(id, number,currency, accountBalance.replace(/\s/g,''),
  fullLinkBuilder('NationalTransfersShow'), fullLinkBuilder('StatementShow'));
}

module.exports = parseAccount;