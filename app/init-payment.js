const readlineSync = require('readline-sync');
const fs = require('fs');
const envfile = require('envfile');
const sourcePath = __dirname + '/../.env';

function initPayment() {
  const fullName = readlineSync.question('Full Name: ');
  const phoneNumber = readlineSync.question('Phone Number: ');
  const inn = readlineSync.question('INN: ');
  const physicalCardIBAN = readlineSync.question('Physical card IBAN: ');
  const physicalCardNumber = readlineSync.question('Physical card number: ');

  let parsedEnv = envfile.parse(fs.readFileSync(sourcePath, {encoding: 'utf8'}));

  parsedEnv.NAME = fullName;
  parsedEnv.PHONE_NUMBER = phoneNumber;
  parsedEnv.INN = inn;
  parsedEnv.IBAN = physicalCardIBAN;
  parsedEnv.CARD_NUMBER = physicalCardNumber;

  fs.writeFileSync( __dirname + '/../.env', envfile.stringifySync(parsedEnv));
}

module.exports = initPayment;