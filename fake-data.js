"use strict";

const { faker } = require("@faker-js/faker");
const dataUglifyService = require("./data-uglify.service");
dataUglifyService.randomizeFn = faker.mersenne.rand;

const setSeed = seed => faker.mersenne.seed(seed);
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
  // building: faker.address.buildingNumber()
});

const getPhone = () => faker.phone.phoneNumber();

const getNextPage = () => {
  const rows = [];

  for (let i = 0; i < 20; i++) {
    const id = faker.mersenne.rand(1_000_000, 100_000);
    const fullName = Object.values(getFullName()).join(" ");
    const address = Object.values(getAddress()).join(", ");
    const phone = getPhone();

    const row = {
      index: i + 1,
      id,
      fullName,
      address,
      phone
    };

    [row.fullName, row.address, row.phone] =
      dataUglifyService.uglify([row.fullName, row.address, row.phone]);

    rows.push(row);
  }

  return rows;
};

module.exports = {
  setSeed,
  setLocale,
  setErrors,
  getNextPage,
};
