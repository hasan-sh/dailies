import { collection, DocumentData, Firestore, getDocs, query, QueryDocumentSnapshot, where } from 'firebase/firestore/lite';
import { action, makeObservable, observable } from 'mobx';
import { createContext } from 'react';

export class DailiesStore {
    dailies: QueryDocumentSnapshot<DocumentData>[]
    constructor() {
        this.dailies = []
        makeObservable(this, {
            dailies: observable,
            addDaily: action,
            getDailies: action.bound
        })
    }

    async getDailies(db: Firestore, userId: string) {
        if (this.dailies.length) {
            return this.dailies
        }
        const colRef = collection(db, 'dailies');
        // const docRef = getDocs(colRef, userId)
        const q = query(colRef, where('uid', '==', userId))//orderBy('createdAt', 'asc'))
        const dailySnapshot = await getDocs(q);
        
        const docs = sortByDate(dailySnapshot.docs)
        this.dailies = docs
        return docs;
    }


    addDaily = (daily: QueryDocumentSnapshot<DocumentData>) => {
        this.dailies.push(daily)
    };
}

export const DailiesContext = createContext(new DailiesStore());

function sortByDate(docs: QueryDocumentSnapshot<DocumentData>[]) {
  return docs.sort((a, b) => {
    const aData = a.data()
    const bData = b.data()
    return aData.createdAt.seconds - bData.createdAt.seconds
  })
}