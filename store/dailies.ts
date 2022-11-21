import { collection, DocumentData, Firestore, getDocs, query, QueryDocumentSnapshot, where, onSnapshot, Unsubscribe } from 'firebase/firestore';
// import { onSnapshot } from 'firebase/firestore'
import { action, makeObservable, observable } from 'mobx';
import { createContext } from 'react';

export class DailiesStore {
    dailies: QueryDocumentSnapshot<DocumentData>[]
    firstRun: boolean = true
    constructor() {
        this.dailies = []
        makeObservable(this, {
            firstRun: observable,
            dailies: observable,
            setFirstRun: action,
            setDailies: action,
        })
    }

    setDailies = (dailies: QueryDocumentSnapshot<DocumentData>[]) => {
        this.dailies = dailies
    }

    setFirstRun = (v: boolean) => {
        this.firstRun = v
    }
}

export const DailiesContext = createContext(new DailiesStore());

function sortByDate(docs: QueryDocumentSnapshot<DocumentData>[]) {
  return docs.sort((a, b) => {
    const aData = a.data()
    const bData = b.data()
    return aData.createdAt.seconds - bData.createdAt.seconds
  })
}