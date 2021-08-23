## About
otp-cli is a command line tool for speeding up interaction with OTP banking, designed to be installed per-user, and invoked per-shell. `otp-bank` works on any POSIX-compliant shell (sh, dash, ksh, zsh, bash), tested on macOS but you should be able to use it on windows/ linux if POSIX-compliant shell, "curl" and "grep" are installed.

## Installing and Updating

### Install & Update Script

To **install** or **update** otp-cli, you should run the [install script][2]. To do that, you may either download and run the script manually, or use the following cURL or Wget command:
```sh
curl -o- https://raw.githubusercontent.com/AndreyNikolayev/otp-cli/master/install.sh | bash
```
```sh
wget -qO- https://raw.githubusercontent.com/AndreyNikolayev/otp-cli/master/install.sh | bash
```

Running either of the above commands downloads a script and runs it. The script clones the nvm repository to `~/.otp-bank`, and attempts to add the source lines from the snippet below to the correct profile file (`~/.bash_profile`, `~/.zshrc`, `~/.profile`, or `~/.bashrc`).

```sh
alias otp-bank="sh $HOME/.otp-cli/otp.sh"
```

## USAGE

### Initial configuration

Use next command for the first setup or the update of the configuration

```sh
otp-bank init
```

After that you will be prompted to provide all the login details for the application. Try any of the next operations in order to check whether cli is configured correctly. Otherwise, retry the **init** command

### Commands

#### View current balance
```sh
otp-bank balance
```

#### Calculate taxes for the quarter
```sh
otp-bank 2021/3
```
In the example above taxes will be calculated for the 3rd quarter of the 2021 year along with the income and tax for the all 3 quarters together.



