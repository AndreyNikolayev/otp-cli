const readlineSync = require('readline-sync');
const fs = require('fs');
var eol = require('os').EOL;

function init() {
  const otpUsername = readlineSync.question('Otp username: ', );
  const otpPassword = readlineSync.question('Otp password: ', { hideEchoBack: true});
  const otpFileLocation = readlineSync.question('Otp key full path: ', );

  if(!otpFileLocation.split('.').pop() != 'dat') {
    console.log('Key file must have dat extension');
    return;
  }

  if (!fs.existsSync(otpFileLocation)) {
    console.log('File location is invalid');
    return;
  }
  fs.copyFileSync(otpFileLocation , __dirname + '/../key.dat');

  const otpFilePassword = readlineSync.question('Otp key password: ', { hideEchoBack: true});

  const parameters = [
    'BANK_URL=https://otpay.com.ua/ifobsClientSMB',
    'BANK_SELL_URL=https://otpay.com.ua/ifobsClientSMB/CurrSellOrderShow.action',
    `USER_LOGIN=${otpUsername}`,
    `USER_PASSWORD=${otpPassword}`,
    'KEY_PATH=key.dat',
    `KEY_PASSWORD=${otpFilePassword}`
  ]

  fs.writeFileSync( __dirname + '/../.env', parameters.join(eol));
}

module.exports = init;