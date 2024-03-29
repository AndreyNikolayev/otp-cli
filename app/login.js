async function login(page) {
  await page.waitForSelector('#loginForm');

  await page.$eval('input[name=userLogin]', (el, userLogin) => el.value = userLogin, process.env.USER_LOGIN);
  
  await page.$eval('input[name=password]', (el, userPassword) => el.value = userPassword, process.env.USER_PASSWORD);

  await page.$eval('#enter_btn', btn => btn.click());

  await page.waitForSelector('#select-keyFile');
  await page.waitForTimeout(3000);

  const [fileChooser] = await Promise.all([ 
    page.waitForFileChooser(),
    page.$eval('#select-keyFile', btn => btn.click())
  ]);

  await fileChooser.accept([__dirname+'/../'+ process.env.KEY_PATH]);

  await page.$eval('input[name=keyIit_password]', (el, keyPassword) => el.value = keyPassword, process.env.KEY_PASSWORD);

    try {
      await page.$eval('#enter_btn', btn => btn.click());
      await page.waitForSelector('.cards-list', {timeout:  10000});
    } catch(e) {
        await page.waitForFunction('initIit', {timeout: 15000});
        await page.$eval('#enter_btn', btn => btn.click());
        await page.waitForSelector('.cards-list', {timeout:  30000});
    }

}

module.exports = login;