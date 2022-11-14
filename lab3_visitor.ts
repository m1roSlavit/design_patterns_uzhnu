/*
  8. Дано список будинків. Нехай будинок - це об'єкт.  Якщо це приватний будинок, то він містить список мешканців будинку,
  якщо ж це багатоквартирний будинок - він містить список квартир, кожна із яких містить список мешканців.
  Мешканець - це  об'єкт, що містить такі дані: ПІБ, стать і дату народження. 
  Передбачити, що здійснювати обхід будинків можуть різні служби: 
  а. Військкомат виводить в консоль список дані всіх призовників (чоловіків віком від 18 до 27 років).
  б. Служба перепису населення підраховує загальну кількість мешканців.
*/

type Resident = {
  fullName: string;
  sex: 'male' | 'female' | 'unset';
  dateOfBirth: string;
};

type Flat = { residents: Resident[] };

type IBuildingVisitor = {
  visitPrivateBuilding(_: PrivateBuilding): void;
  visitApartmentBuilding(_: ApartmentBuilding): void;
};

class PrivateBuilding {
  residents: Resident[];
  constructor(residents: Resident[]) {
    this.residents = residents;
  }
  accept(visitor: IBuildingVisitor) {
    visitor.visitPrivateBuilding(this);
  }
}

class ApartmentBuilding {
  flats: Flat[];
  constructor(flats: Flat[]) {
    this.flats = flats;
  }
  accept(visitor: IBuildingVisitor) {
    visitor.visitApartmentBuilding(this);
  }
}

class MilitaryCommissariatVisitor implements IBuildingVisitor {
  private getAge(dateString: string) {
    var today = new Date();
    var birthDate = new Date(dateString);
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }

  private processResidents(residents: Resident[]) {
    for (const resident of residents) {
      const age = this.getAge(resident.dateOfBirth);
      if (age >= 18 && age <= 27 && resident.sex === 'male') {
        console.log(`${resident.fullName} : ${age} : ${resident.sex}`);
      }
    }
  }

  visitApartmentBuilding(apartmentBuilding: ApartmentBuilding): void {
    for (const flat of apartmentBuilding.flats) {
      this.processResidents(flat.residents);
    }
  }

  visitPrivateBuilding(privateBuilding: PrivateBuilding): void {
    this.processResidents(privateBuilding.residents);
  }
}

class CensusServiceVisiter implements IBuildingVisitor {
  private calculateTotalNumberOfResidents(residents: Resident[]) {
    const totalNumber = residents.length;
    console.log(`Total number of residents is ${totalNumber}`);
  }

  visitApartmentBuilding(apartmentBuilding: ApartmentBuilding): void {
    let residents = apartmentBuilding.flats.reduce<Resident[]>(
      (allResidents, flat) => [...allResidents, ...flat.residents],
      []
    );
    this.calculateTotalNumberOfResidents(residents);
  }

  visitPrivateBuilding(privateBuilding: PrivateBuilding): void {
    this.calculateTotalNumberOfResidents(privateBuilding.residents);
  }
}

const buildings: (PrivateBuilding | ApartmentBuilding)[] = [
  new PrivateBuilding([
    {
      dateOfBirth: '2003-10-11T19:56:13.560Z',
      fullName: 'Ivan Ivanov Ivanovich',
      sex: 'male',
    },
    {
      dateOfBirth: '2020-10-11T19:56:13.560Z',
      fullName: 'Max',
      sex: 'male',
    },
    {
      dateOfBirth: '1950-10-11T19:56:13.560Z',
      fullName: 'Lesya',
      sex: 'female',
    },
  ]),
  new ApartmentBuilding([
    {
      residents: [
        {
          dateOfBirth: '1990-10-11T19:56:13.560Z',
          fullName: 'Olga',
          sex: 'female',
        },
        {
          dateOfBirth: '2005-10-11T19:56:13.560Z',
          fullName: 'John',
          sex: 'unset',
        },
      ],
    },
    {
      residents: [
        {
          dateOfBirth: '1999-10-11T19:56:13.560Z',
          fullName: 'Yuriy',
          sex: 'male',
        },
      ],
    },
  ]),
];

const proceedBuildings = () => {
  for (const building of buildings) {
    building.accept(new MilitaryCommissariatVisitor());
    building.accept(new CensusServiceVisiter());
  }
};

proceedBuildings();
