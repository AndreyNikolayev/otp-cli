async function send(page, accounts, amount) {
  const targetAccount = accounts.find((account) => account.currency === 'UAH' && account.paymentLink);

  if(targetAccount === null) {
    return 'Account for payment not found';
  }

  if(isNaN(amount)) {
    return 'Amount must be a valid number';
  }

  if(targetAccount.balanceAmount < amount) {
    return 'Amount is less than the account balance.';
  }

  await page.goto(targetAccount.paymentLink);

  await page.waitForSelector('input[name=corrsname]');

  await page.$eval('input[name=corrsname]', (el, value) => el.value = value, process.env.NAME);
  await page.$eval('input[name=corridentifycode]', (el, value) => el.value = value, process.env.INN);

  const ibanElement = await page.$('#corribanVisual');
  await ibanElement.type(process.env.IBAN);

  await page.$eval('input[name=amount_visual]', (el, value) => el.value = value, amount);

  const commentElement = await page.$('#detailsofpayment');
  await commentElement.type(getSendComment());

  await page.waitForTimeout(1000);
  await page.$eval('#sign_btn', btn => btn.click());

  await page.waitForSelector('#folder');
  await page.waitForTimeout(1000);

  const [fileChooser] = await Promise.all([ 
    page.waitForFileChooser(),
    page.$eval('#folder', btn => btn.click())
  ]);
  await fileChooser.accept([__dirname+'/../'+ process.env.KEY_PATH]);

  await page.$eval('input[name=key_password]', (el, keyPassword) => el.value = keyPassword, process.env.KEY_PASSWORD);
  await page.waitForTimeout(1000);

  await page.$eval('#enter_btn_iit', btn => btn.click());

  return 'Send request is submitted successfully';
}

function getSendComment() {
  const date = new Date();
  date.setMonth(date.getMonth() - 1);

  return `Поповнення карткового рахунку №${process.env.CARD_NUMBER}, ${process.env.NAME}, ` +
  `${process.env.INN}. Дохід від підприємницької діяльності за: `+ 
  `${date.getMonth() + 1} місяць, ${Math.floor((date.getMonth()) / 3) + 1} квартал, ${date.getFullYear()}`;
}

module.exports = send;