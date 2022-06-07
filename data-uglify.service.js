"use strict";

class UglifyService {
  constructor() {
    this.errorsCount = 0;
    this.remainder = 0;
    this.possibleError = 0;
    this.randomizeFn = Math.random;
    this.uglifyMethods = [
      this.addRandomSymbol,
      this.deleteRandomSymbol,
      this.swapNearSymbols
    ];

    this.symbols = [].concat(
      getCharsByCodes(48, 57),
      getCharsByCodes(65, 90),
      getCharsByCodes(97, 122),
    );
  }

  set ErrorsCount(realNumber) {
    this.errorsCount = Math.floor(realNumber);
    this.remainder = realNumber - this.errorsCount;
  }

  set PossibleError(probability) {
    this.possibleError = probability <= this.remainder ? 1 : 0;
  }

  addRandomSymbol(str) {
    const indexToAddFrom = this.randomizeFn(str.length - 1, 0);
    const symbolToAdd =
      this.symbols[this.randomizeFn(this.symbols.length, 0)];
    const strArr = str.split("");
    strArr.splice(indexToAddFrom, 0, symbolToAdd);
    return strArr.join("");
  }

  deleteRandomSymbol(str) {
    const indexToRemove = this.randomizeFn(str.length - 1, 0);
    const strArr = str.split("");
    strArr.splice(indexToRemove, 1);
    return strArr.join("");
  }

  swapNearSymbols(str) {
    const firstIndexToSwap = this.randomizeFn(str.length - 1, 0);
    const strArr = str.split("");
    const nearSymbols = strArr.splice(firstIndexToSwap, 2).reverse();
    strArr.splice(firstIndexToSwap, 0, ...nearSymbols);
    return strArr.join("");
  }

  uglifyString(str) {
    const uglifyMethodIndex = this.randomizeFn(3, 0);
    return this.uglifyMethods[uglifyMethodIndex].call(this, str);
  }

  uglify(data) {
    const result = [...data];
    this.PossibleError = this.randomizeFn(101, 0) / 100;
    for (let i = 0; i < this.errorsCount + this.possibleError; i++) {
      const indexToUglify = this.randomizeFn(result.length, 0);
      result[indexToUglify] = this.uglifyString(result[indexToUglify]);
    }

    return result;
  }
}

function getCharsByCodes(min, max) {
  const chars = [];
  for (let i = min; i < max + 1; i++)
    chars.push(String.fromCharCode(i));
  return chars;
}

module.exports = new UglifyService();
