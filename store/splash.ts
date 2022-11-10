import { action, makeObservable, observable } from 'mobx';
import { createContext } from 'react';

export class SplashStore {
    firstRun = true
    constructor() {
        makeObservable(this, {
            firstRun: observable,
            setFirstRun: action
        })
    }

    setFirstRun = (value: boolean) => {
        this.firstRun = value;
    };
}

export const SplashContext = createContext(new SplashStore());
