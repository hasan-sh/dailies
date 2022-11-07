import { action, makeObservable, observable } from 'mobx';
import { createContext } from 'react';

export class DateStore {
    date = new Date()
    constructor() {
        makeObservable(this, {
            date: observable,
            setDate: action
        })
    }

    setDate = (date: Date) => {
        this.date = date;
    };
}

export const DateContext = createContext(new DateStore());

// import { useReducer } from 'react';

// interface DateState {
//     date: Date
// }

// interface ActionState {
//     type: string
//     date: Date
// }

// export function dateReducer(state: DateState, action: ActionState) {
//   switch (action.type) {
//     case 'changed_date': {
//       return {
//         date: action.date,
//       };
//     }
//   }
//   throw Error('Unknown action: ' + action.type);
// }