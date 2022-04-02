var parameters = process.argv.slice(2);
var flags = parameters.filter(p => p.startsWith('--'));
var commandArgs = parameters.filter(p => !p.startsWith('--'));

var hasFlag = (value) => flags.indexOf(`--${value}`) !== -1;

const command = commandArgs[0];
if (!command) {
  console.log("Please provide command as the first argument");
  return;
}

if(command === 'init') {
  const init = require('./app/init');
  init();
  return;
}

if(command === 'update') {
  const update = require('./app/update');
  update();
  return;
}

const fs = require('fs');
if (!fs.existsSync(__dirname + '/.env')) {
  console.log('Configuration is not set. Please use "otp init" command first.');
  return;
}

if(command === 'init-payment') {
  const initPayment = require('./app/init-payment');
  initPayment();
  return;
}

require('dotenv').config({ path: __dirname + '/.env' });

if(!process.env.NAME && (command === 'send' || command === 'sell')) {
  console.log('Application is not configured for send/sell operation. Please use "otp init-payment" command first.');
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
  const browser = await puppeteer.launch({headless: !hasFlag('debug')});
  const page = await browser.newPage();
  await page.goto(process.env.BANK_URL);

  await login(page);
  var accounts = await parseAccount(page);

  var standardCommands = {
    send: async () => await send(page, accounts, commandArgs[1]),
    sell: async () => await sell(page, accounts, commandArgs[1], commandArgs[2]),
    tax: async () => await tax(page, accounts, commandArgs[1])
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