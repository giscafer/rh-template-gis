export default class HashTable {
  count = 0;
  entry: Record<string, any> = new Object();

  getHashTable() {
    return this.entry;
  }
  add(key: string, value: any) {
    if (!this.containsKey(key)) {
      this.count++;
    }
    this.entry[key] = value;
  }
  getValue(key: string) {
    return this.containsKey(key) ? this.entry[key] : null;
  }
  getKeys() {
    let keys = new Array();

    for (let key in this.entry) {
      if (Object.prototype.hasOwnProperty.call(this.entry, key)) {
        keys.push(key);
      }
    }
    return keys;
  }
  getCount() {
    return this.count;
  }
  remove(key: string) {
    if (this.containsKey(key) && delete this.entry[key]) {
      this.count--;
    }
  }
  containsKey(key: string) {
    return key in this.entry;
  }
  containsValue(value: any) {
    for (let prop in this.entry) {
      if (this.entry[prop] == value) {
        return true;
      }
    }
    return false;
  }
  getValues() {
    let values = new Array();
    for (let key in this.entry) {
      if (Object.prototype.hasOwnProperty.call(this.entry, key)) {
        values.push(this.entry[key]);
      }
    }
    return values;
  }
  clear() {
    this.count = 0;
    this.entry = new Object();
  }
}
