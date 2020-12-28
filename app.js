require('dotenv').config({path:__dirname+'/.env'})
const puppeteer = require('puppeteer');
const Spinner = require('cli-spinner').Spinner;
const spinner = new Spinner('processing.. %s');
spinner.setSpinnerString('|/-\\');
spinner.start();

const login = require('./app/login');
const parseAccount = require('./app/parse-account');

const command = process.argv[2];
if (!command) {
    throw "Please provide command as the first argument";
}

async function run () {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(process.env.BANK_URL);

  await login(page);
  var accounts = await parseAccount(page);

  spinner.stop(true);

  switch (command) {
    case 'balance':
      accounts.forEach(account => console.log(account.balanceDescription));
      break;
    default:
      console.log(`Command ${command} not found.`);
  }

  browser.close();
}


run().catch((err)=> console.log(err));