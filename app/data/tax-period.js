class TaxPeriod {
  //ex. 2021/3 where 2021 - year, 3 - 3 quarter
  constructor(periodString) {
    var periodParts = periodString.split('/');

    if(periodParts.length !== 2) {
      throw new Error('Invalid period');
    }

    this.year = +periodParts[0];
    this.quarter = +periodParts[1];
  }

  get yearStartDate() {
    return new Date(this.year, 0, 1);
  }

  get quarterStartDate() {
    return new Date(this.year,(this.quarter - 1) * 3, 1);
  }

  get quarterEndDate() {
    return new Date(this.year, this.quarter * 3, 0);
  }
}

module.exports = TaxPeriod;