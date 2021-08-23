const command = process.argv[2];
if (!command) {
  console.log("Please provide command as the first argument");
  return;
}

if(command === 'init') {
  const init = require('./app/init');
  init();
  return;
}

const fs = require('fs');

if (!fs.existsSync(__dirname + '/.env')) {
  console.log('Configuration is not set. Please user "otp init" command first.');
  return;
}

require('dotenv').config({ path: __dirname + '/.env' });

if(!process.env.NAME && (command === 'send' || command === 'sell')) {
  console.log('Application is not configured for send/sell operation. TBD for easy configuration.');
  return;
}

const puppeteer = require('puppeteer');
const Spinner = require('cli-spinner').Spinner;
const spinner = new Spinner('processing.. %s');
spinner.setSpinnerString('|/-\\');

const login = require('./app/login');
const parseAccount = require('./app/parse-account');
const send = require('./app/send');
const sell = require('./app/sell');
const tax = require('./app/tax');

spinner.start();

async function run() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(process.env.BANK_URL);

  await login(page);
  var accounts = await parseAccount(page);

  var standardCommands = {
    send: async () => await send(page, accounts, process.argv[3]),
    sell: async () => await sell(page, accounts, process.argv[3], process.argv[4]),
    tax: async () => await tax(page, accounts, process.argv[3])
  };

  if(command === 'balance') {
    spinner.stop(true);
    accounts.forEach(account => console.log(account.balanceDescription));
  } else if(standardCommands[command]) {
    const result = await standardCommands[command]();
    spinner.stop(true);
    console.log(result);
  } else {
    console.log(`Command ${command} not found.`);
  }

  browser.close();
}


run().catch((err) => console.log(err));