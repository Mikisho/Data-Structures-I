/* eslint-disable no-unused-vars */
/* eslint-disable class-methods-use-this */
const { LimitedArray, getIndexBelowMax } = require('./hash-table-helpers');

class HashTable {
  constructor(limit = 8) {
    this.limit = limit;
    this.storage = new LimitedArray(this.limit);
    // Do not modify anything inside of the constructor
  }
  capacity() {
    let allStorage = 1;
    this.storage.each((newBucket) => {
      if (newBucket !== undefined) allStorage++;
    });
    this.limit *= 2;
    const prevStorage = this.storage;
    this.storage = new LimitedArray(this.limit);
    prevStorage.each((newBucket) => {
      if (newBucket === undefined) return;
      newBucket.forEach((element) => {
        this.insert(element[0], element[1]);
      });
    });
    return allStorage / this.limit >= 0.75;
  }
  // Adds the given key, value pair to the hash table
  // Fetch the bucket associated with the given key using the getIndexBelowMax function
  // If no bucket has been created for that index, instantiate a new bucket and add the key, value pair to that new bucket
  // If the key already exists in the bucket, the newer value should overwrite the older value associated with that key
  insert(key, value) {
    const index = getIndexBelowMax(key, this.limit);
    const newBucket = this.storage.get(index);
    if (newBucket === undefined) {
      this.storage.set(index, [[key, value]]);
      return;
    }
    for (let i = 0; i < newBucket.length; i++) {
      const tuple = newBucket[i];
      if (tuple[0] === key) {
        tuple[1] = value;
        this.storage.set(index, newBucket);
        return;
      }
    }
    newBucket.push([key, value]);
    this.storage.set(index, newBucket);
  }
  // Removes the key, value pair from the hash table
  // Fetch the bucket associated with the given key using the getIndexBelowMax function
  // Remove the key, value pair from the bucket
  remove(key) {
    const index = getIndexBelowMax(key, this.limit);
    const newBucket = this.storage.get(index);
    if (newBucket === undefined) {
      this.storage.set(index, undefined);
      return;
    }
    newBucket.forEach((element, i) => {
      if (element[0] === key) newBucket.splice(i, 1);
      this.storage.set(index, newBucket);
    });
  }
  // Fetches the value associated with the given key from the hash table
  // Fetch the bucket associated with the given key using the getIndexBelowMax function
  // Find the key, value pair inside the bucket and return the value
  retrieve(key) {
    const index = getIndexBelowMax(key, this.limit);
    const newBucket = this.storage.get(index);
    if (newBucket === undefined) return undefined;
    for (let i = 0; i < newBucket.length; i++) {
      if (newBucket[i][0] === key) return newBucket[i][1];
    }
  }
}

module.exports = HashTable;
