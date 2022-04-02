var spawn = require('child_process').spawn;

function update() {
  spawn('bash', ['-c', '$(curl -o- https://raw.githubusercontent.com/AndreyNikolayev/otp-cli/master/install.sh)']
  , {detached: true}).unref();
}

module.exports = update;
