#!/bin/bash
function installNodeIfMissing() {
  if which node > /dev/null
  then
    echo "node is installed, skipping..."
  else
    echo "node is not installed, installing..."
    installNode
  fi
}

function installNode() {
  curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.37.2/install.sh | bash
  export NVM_DIR="$HOME/.nvm"
  [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
  [ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion
  nvm install --lts
}

function installOtpCli() {
  rm -rf $HOME/.otp-cli-temp
  mkdir $HOME/.otp-cli-temp
  [ -d $HOME/.otp-cli ] && mv $HOME/.otp-cli/.env $HOME/.otp-cli-temp
  [ -d $HOME/.otp-cli ] && mv $HOME/.otp-cli/key.dat $HOME/.otp-cli-temp
  rm -rf $HOME/.otp-cli
  mkdir $HOME/.otp-cli

  cd $HOME/.otp-cli
  curl -LJ https://github.com/AndreyNikolayev/otp-cli/zipball/master -o myfile.zip
  unzip myfile.zip -d ./tmp
  mv ./tmp/*/* .
  rm -rf myfile.zip
  rm -rf tmp
  [ -f $HOME/.otp-cli-temp/.env ] && mv $HOME/.otp-cli-temp/.env $HOME/.otp-cli
  [ -f $HOME/.otp-cli-temp/key.dat ] && mv $HOME/.otp-cli-temp/key.dat $HOME/.otp-cli
  rm -rf $HOME/.otp-cli-temp
  npm install
}

function addCliToPath() {
  LINE='alias otp="sh $HOME/.otp-cli/otp.sh"'
  ALL_FILES=("${HOME}/.bash_profile" "${HOME}/.zshrc" "${HOME}/.bashrc", "${HOME}/.profile")
  for FILE in ${ALL_FILES[@]}; do
    if test -f "$FILE"; then
      echo "$FILE exists."
      grep -qF -- "$LINE" "$FILE" || echo "$LINE" >> "$FILE"
      if [ "$FILE" == "${HOME}/.zshrc" ]; then
        exec zsh
      else
        source $FILE
      fi
    else
       echo "$FILE does not exist."
    fi
  done
}

installNodeIfMissing
installOtpCli
addCliToPath
