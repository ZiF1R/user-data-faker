"use strict";

const { faker } = require("@faker-js/faker");
const dataUglifyService = require("./data-uglify.service");
dataUglifyService.randomizeFn = faker.mersenne.rand;

const setSeed = seed => faker.seed(seed);
const setLocale = locale => faker.setLocale(locale);
const setErrors = errorsPercentage =>
  dataUglifyService.ErrorsCount = errorsPercentage;

const getFullName = () => ({
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),
  middleName: faker.name.middleName(),
});

const getAddress = () => ({
  city: faker.address.city(),
  street: faker.address.streetAddress(true),
});

const getPhone = () => faker.phone.phoneNumber();

const getNextPage = () => {
  const rows = [];

  for (let i = 0; i < 20; i++) {
    const id = faker.mersenne.rand(1_000_000, 100_000);
    let fullName = faker.name.findName();
    let address = Object.values(getAddress()).join(", ");
    let phone = getPhone();

    const row = {
      index: i + 1,
      id,
      fullName,
      address,
      phone
    };

    rows.push(row);
  }

  // uglify data in different loops
  // because if it will be in one loop
  // it will produce unexpected behavior
  rows.map(row => {
    [row.fullName, row.address, row.phone] =
      dataUglifyService.uglify([row.fullName, row.address, row.phone]);
    return row;
  });

  return rows;
};

module.exports = {
  setSeed,
  setLocale,
  setErrors,
  getNextPage,
};
