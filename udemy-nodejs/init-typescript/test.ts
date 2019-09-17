class TestMe {
  private someValue: string;
  private otherValue: string;

  constructor(someValue: string, otherValue: string) {
    this.someValue = someValue;
    this.otherValue = otherValue;
  }

  public smthPublicPlease: string;

  public setupSmth(): void {
    this.smthPublicPlease = this.someValue + ' ' + this.otherValue;
  }
}

let newOne = new TestMe('asda', 'asdasd');

newOne.setupSmth();
console.log(newOne.smthPublicPlease);
