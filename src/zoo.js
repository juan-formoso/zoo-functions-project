const data = require('./data');
const { species, employees, prices } = require('./data');

function getSpeciesByIds(...ids) {
  return species.filter((animal) => ids.includes(animal.id));
}

function getAnimalsOlderThan(animal, age) {
  const selectedAnimal = species.find((specie) => specie.name === animal);
  return selectedAnimal.residents.every((resident) => resident.age > age);
}

function getEmployeeByName(employeeName) {
  if (!employeeName) return {};
  return data.employees.find(
    ({ firstName, lastName }) => firstName === employeeName || lastName === employeeName,
  );
}

function createEmployee(personalInfo, associatedWith) {
  return { ...personalInfo, ...associatedWith };
}

function isManager(id) {
  const managersId = employees.map(({ managers }) => managers).reduce((acc, current) => {
    acc.push(...current);
    return acc;
  });
  const managersFiltered = managersId.filter((element, i) => managersId.indexOf(element) === i);
  return managersFiltered.includes(id);
}

function addEmployee(id, firstName, lastName, managers = [], responsibleFor = []) {
  const newEmployee = {
    id,
    firstName,
    lastName,
    managers,
    responsibleFor,
  };
  return employees.push(newEmployee);
}

function countAnimals(spec) {
  if (!spec) {
    return species
      .reduce((acc, { name, residents }) => ({ ...acc, [name]: residents.length }), {});
  }
  return species.find(({ name }) => name === spec).residents.length;
}

function calculateEntry(entrants) {
  if (entrants === undefined) return 0;
  const { Child = 0, Adult = 0, Senior = 0 } = entrants;
  return (prices.Child * Child + prices.Adult * Adult + prices.Senior * Senior);
}

const searchByLocation = (local) => species.filter((y) => y.location === local);
const newObject = (callback) => species.reduce((acc, { location }) =>
  ({ ...acc, [location]: searchByLocation(location).map(callback) }), {});
const getNames = (y) => y.name;
function scanInsertedNames(value, callback) {
  return value ? newObject(callback) : newObject(getNames);
}

function getAnimalMap(options) {
  if (!options) return newObject(getNames);
  const { includeNames = false, sorted = false, sex = null } = options;
  const residentNames = (array) => (sex
    ? array.filter((x) => x.sex === sex).map(getNames)
    : array.map(getNames));
  const includeAnimalNames = ({ name, residents }) => ({
    [name]:
    residentNames(residents),
  });
  const includeAnimalSortedNames = ({ name, residents }) => ({
    [name]:
      residentNames(residents).sort(),
  });
  return includeNames && sorted
    ? newObject(includeAnimalSortedNames)
    : scanInsertedNames(includeNames, includeAnimalNames);
}
// Para resolver a função 'getAnimalMap' utilizei como base o código da Grasiela Gomes. Link do repositório: https://github.com/grasielaGomes

function getSchedule(dayName) {
  const getHours = data.hours;
  if (!dayName) {
    const weekDay = Object.keys(data.hours);
    return weekDay.reduce((acc, actualDay) => {
      const day = getHours[actualDay];
      if (day.open === 0) {
        acc[actualDay] = 'CLOSED';
        return acc;
      }
      acc[actualDay] = `Open from ${[day.open]}am until ${[day.close] - 12}pm`;
      return acc;
    }, {});
  }
  const getDay = getHours[dayName];
  if (getDay.open === 0) return { [dayName]: 'CLOSED' };
  return { [dayName]: `Open from ${[getDay.open]}am until ${[getDay.close] - 12}pm` };
}

function getOldestFromFirstSpecies(id) {
  const firstSpecie = data.employees.find((employee) => employee.id === id).responsibleFor[0];
  const residentSorted = data.species
    .find((specie) => specie.id === firstSpecie).residents
    .sort((a, b) => b.age - a.age);
  return residentSorted.reduce((acc, currResident, i) => {
    if (i === 0) {
      acc.push(currResident.name);
      acc.push(currResident.sex);
      acc.push(currResident.age);
    }
    return acc;
  }, []);
}

function increasePrices(percentage) {
  const { Child, Adult, Senior } = data.prices;
  const updatedPrices = {
    Child: Math.round((Child * ((percentage / 100) + 1)) * 100) / 100,
    Adult: Math.round((Adult * ((percentage / 100) + 1)) * 100) / 100,
    Senior: Math.round((Senior * ((percentage / 100) + 1)) * 100) / 100,
  };
  data.prices = updatedPrices;
}

function getEmployeeCoverage(idOrName) {
  if (!idOrName) {
    return data.employees.reduce((acc, currEmployee) => {
      const employeeFullName = `${currEmployee.firstName} ${currEmployee.lastName}`;
      acc[employeeFullName] = currEmployee.responsibleFor
        .map((specieId) => data.species.find(({ id }) => id === specieId).name);
      return acc;
    }, {});
  }
  const findEmployee = data.employees
    .find(({ id, firstName, lastName }) => id === idOrName
      || firstName === idOrName
      || lastName === idOrName);
  return { [`${findEmployee.firstName} ${findEmployee.lastName}`]: findEmployee
    .responsibleFor.map((specieId) => data.species.find(({ id }) => id === specieId).name),
  };
}

module.exports = {
  calculateEntry,
  getSchedule,
  countAnimals,
  getAnimalMap,
  getSpeciesByIds,
  getEmployeeByName,
  getEmployeeCoverage,
  addEmployee,
  isManager,
  getAnimalsOlderThan,
  getOldestFromFirstSpecies,
  increasePrices,
  createEmployee,
};
