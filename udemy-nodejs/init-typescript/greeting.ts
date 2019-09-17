interface Person {
  firstName: string;
  lastName: string;
}

function greeter(person: Person) {
  return 'Hello, ' + person.firstName + ' ' + person.lastName;
}

let user = { firstName: 'Sasha', lastName: 'Man' };

document.body.textContent = greeter(user);
