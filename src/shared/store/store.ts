/* eslint-disable no-param-reassign */
import { data, observers } from './data';
import { Observer } from './observer';
import { s8 } from '../uuid';

export class Store {
  data: any = {};
  observers: any = {};

  get(key?: string) {
    return Store.get(key, this.data);
  }

  set(key: string, value: any) {
    Store.set(key, value, this.data, this.observers);
  }

  updated(key: string) {
    Store.updated(key, this.data, this.observers);
  }

  subscribe(key: string, fn: (data: any) => void) {
    return Store.subscribe(key, fn, this.data, this.observers);
  }

  static get(key?: string, store?: any) {
    if (!store) {
      store = data;
    }

    if (key === undefined) {
      return store;
    }

    const props = key.split('.');
    for (const prop of props) {
      store = store[prop];
      if (store === undefined) {
        break;
      }
    }

    return store;
  }

  static set(key: string, value: any, store?: any, obs?: any) {
    if (!store) {
      store = data;
    }
    if (!obs) {
      obs = observers;
    }

    const props = key.split('.');
    let _store = store;
    for (let i = 0; i < props.length - 1; ++i) {
      if (!_store[props[i]]) {
        _store[props[i]] = {};
      }
      _store = _store[props[i]];
    }
    _store[props[props.length - 1]] = value;

    for (const id in obs) {
      if (key.indexOf(obs[id].key) === 0) {
        obs[id].fn(Store.get(obs[id].key, store));
      }
    }
  }

  static updated(key: string, store?: any, obs?: any) {
    if (!obs) {
      obs = observers;
    }

    for (const id in obs) {
      if (key.indexOf(obs[id].key) === 0) {
        obs[id].fn(Store.get(obs[id].key, store));
      }
    }
  }

  static subscribe(key: string, fn: (data: any) => void, store?: any, obs?: any) {
    if (!obs) {
      obs = observers;
    }

    const id = s8();
    const observer = new Observer(id, key, fn);
    obs[id] = observer;

    const value = Store.get(key, store);
    if (value !== undefined) {
      fn(value);
    }

    return observer;
  }
}
