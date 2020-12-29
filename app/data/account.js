class Account {
  constructor(id, number, currency, balanceAmount, paymentLink) {
    this.id = id;
    this.number = number;
    this.currency = currency;
    this.balanceAmount = +balanceAmount;
    this.paymentLink = paymentLink;
  }

  get isTransit() {
    return this.number.substring(18).startsWith('2603');
  }

  get balanceDescription() {
    return `${this.currency}${this.isTransit ? ' (transit)' : ''}: ${this.balanceAmount}`
  }
}

module.exports = Account;