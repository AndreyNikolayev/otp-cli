async function sell(page, accounts, amount, minRate) {
  const targetAccount = accounts.find((account) => account.currency === 'USD' && !account.isTransit);

  if(targetAccount === null) {
    console.log('Account for payment not found');
    return;
  }

  if(isNaN(amount)) {
    console.log('Amount must be a valid number');
    return;
  }

  if(minRate && isNaN(minRate)) {
    console.log('Min Rate must be a valid number');
    return;
  }

  if(targetAccount.balanceAmount < amount) {
    console.log('Amount is less than the account balance.');
    return;
  }

  var uahAccount = accounts.find((account) => account.currency === 'UAH');

  if(uahAccount == null) {
    console.log('UAH account not found');
    return;
  }

  await page.goto(process.env.BANK_SELL_URL);

  await page.waitForSelector('#currencyid_select');

  await page.$eval('#currencyid_select', e => { 
    e.value = '840';
    var event = new Event('change');
    e.dispatchEvent(event);
  });

  await page.$eval('input[name=managername]', (el, value) => el.value = value, process.env.NAME);
  await page.$eval('input[name=managerphone]', (el, value) => el.value = value, process.env.PHONE_NUMBER);
  await page.$eval('input[name=amountvisuali]', (el, value) => el.value = value, amount);
  await page.$eval('#note', (el, value) => el.value = value, 'Продаж виручки');

  if(minRate) {
    var minRateSelector = (await page.$x('//input[@name="ratefixed"][@value="1"]/../label[contains(@class, "custom-radio__label")]'))[0];
    await minRateSelector.evaluate(btn => btn.click());
    await (await page.$('#minrate')).type(minRate);
  }

  await page.$eval('#accountidNew', btn => btn.click());
  await page.$eval(`.complex-select-li[data-value="${uahAccount.id}"]`, btn => btn.click());

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

  return 'Sell request is submitted successfully';
}

module.exports = sell;