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

function getSchedule(dayName) {
  // seu código aqui
}

function getOldestFromFirstSpecies(id) {
  // seu código aqui
}

function increasePrices(percentage) {
  // seu código aqui
}

function getEmployeeCoverage(idOrName) {
  // seu código aqui
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
