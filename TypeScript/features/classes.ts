class Vehicle {
  drive(): void {
    console.log('dasda asd asdas asdasd asdas');
  }

  honk(): void {
    console.log('beeeep');
  }
}

const vehicle = new Vehicle();

vehicle.drive();
vehicle.honk();

class Car extends Vehicle {
  model: string;
}

const car = new Car();
car.model = 'asd';
car.drive = () => console.log('vrrrrrr');

car.drive();

interface IPost {
  title: string;
  content: string;
  author: Author;
  date: Date;
}

interface Author {
  name: string;
}

class LocalAuthor implements Author {
  name: string;

  constructor(name: string) {
    this.name = name;
  }
}

let la = new LocalAuthor('Sharo');

class Post implements IPost {
  name: 'asd';
  author: LocalAuthor;
  content: 'asd';
  date: Date;
  title: string;
}
