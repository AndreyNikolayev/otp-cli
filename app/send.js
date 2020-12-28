var Account = require('./data/account');

async function send(pageHandler, accounts) {
  const targetAccount = accounts.find((account) => account.currency === 'UAH' && account.paymentLink);

  if(targetAccount === null) {
    console.log('Account for payment not found');
    return;
  }

  await pageHandler.goto(targetAccount.paymentLink);
}

module.exports = send;