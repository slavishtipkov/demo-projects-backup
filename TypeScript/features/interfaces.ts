interface IPrintable {
  print(): string;
}

interface Unknown {
  funnny: IPrintable;
}

interface Vehicle {
  name: string;
  year: number;
  broken: boolean;
}

interface NewVehicle extends Vehicle {
  color: string;
  summary(): string;
}

const oldCivic: Vehicle = {
  name: 'civic',
  year: 2000,
  broken: true
};

const newCivic: Vehicle = { name: 'new civic', year: 2013, broken: false };

const printVehicle = (vehicle: Vehicle): void => {
  console.log(`
    Name: ${vehicle.name}
    Year: ${vehicle.year}
    Broken? ${vehicle.broken}
  `);
};

printVehicle(oldCivic);
printVehicle(newCivic);

const newVeh: NewVehicle = {
  color: 'asd',
  broken: false,
  name: 'dasgs',
  year: 12333,
  summary: () => 'asd'
};

const lqlq = {};
