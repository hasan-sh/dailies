import { collection, DocumentData, Firestore, getDocs, query, QueryDocumentSnapshot, where, onSnapshot, Unsubscribe } from 'firebase/firestore';
// import { onSnapshot } from 'firebase/firestore'
import { action, makeObservable, observable } from 'mobx';
import { createContext } from 'react';

export class DailiesStore {
    dailies: QueryDocumentSnapshot<DocumentData>[]
    selectedDaily: any
    firstRun: boolean = true
    constructor() {
        this.dailies = []
        this.selectedDaily = {}
        makeObservable(this, {
            firstRun: observable,
            dailies: observable,
            selectedDaily: observable,
            setFirstRun: action,
            setDailies: action,
            setSelectedDaily: action,
        })
    }

    setDailies = (dailies: QueryDocumentSnapshot<DocumentData>[]) => {
        this.dailies = dailies
    }

    setSelectedDaily = (daily: any) => {
        this.selectedDaily = daily
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