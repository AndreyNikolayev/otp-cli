class Account {
  constructor(id, number, currency, balanceAmount, paymentLink, statementLink) {
    this.id = id;
    this.number = number;
    this.currency = currency;
    this.balanceAmount = +balanceAmount;
    this.paymentLink = paymentLink;
    this.statementLink = statementLink;
  }

  get isTransit() {
    return this.number.substring(18).startsWith('2603');
  }

  get balanceDescription() {
    return `${this.currency}${this.isTransit ? ' (transit)' : ''}: ${this.balanceAmount}`
  }
}

module.exports = Account;