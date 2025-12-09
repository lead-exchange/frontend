import { action, makeObservable, observable } from 'mobx';

class TabStore<T extends string> {
  tab: T;

  constructor(init: T) {
    makeObservable(this, {
      tab: observable,
      setTab: action,
    });

    this.tab = init;
  }

  setTab(tab: T) {
    this.tab = tab;
  }
}

export const indexTabStore = new TabStore<'leads' | 'objects'>('leads');
