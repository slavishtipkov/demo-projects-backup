interface Speed {
  type: string;
  value: number;
}

interface Vehicle {
  name: string;
  speed: Speed;
}

class Car implements Vehicle {
  name: 'asd';
  speed: Speed;
}
