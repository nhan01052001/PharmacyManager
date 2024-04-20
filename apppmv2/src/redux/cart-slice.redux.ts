import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './store.redux';

type InitialStateType = {

}

interface IinitialState {
    data: {
        listItemCart: any[],
        dataCount: {
            countCart?: number,
            coutnBillWaitingConfirm?: number,
            countBillConfirmed?: number,
            countBillDelivering?: number,
            countBillCanceled?: number,
            totalCountInBill?: number,
        }
    }
}

export const initialState: IinitialState = {
    data: {
        listItemCart: [],
        dataCount: {
            countCart: 0,
            coutnBillWaitingConfirm: 0,
            countBillConfirmed: 0,
            countBillDelivering: 0,
            countBillCanceled: 0,
            totalCountInBill: 0,
        }
    }
};

export const CartSlice = createSlice({
    name: 'listItemCart',
    initialState,
    reducers: {
        addItemIntoCart: (state, action: PayloadAction<any[]>) => {
            state.data.listItemCart = [...state.data.listItemCart, ...action.payload];
        },

        deleteItemIntoCart: (state, action: PayloadAction<any[]>) => {
            let arrayItem: any[] = action.payload;
            let rs: any[] = state.data.listItemCart.filter(item1 => !arrayItem.some(item2 => item2?.id === item1?.id));
            state.data.listItemCart = rs;
        },

        setDataCount: (state, action: PayloadAction<{}>) => {
            state.data.dataCount = {
                ...state.data.dataCount,
                ...action.payload
            };
        }

    }
});

export const CartStore = (state: RootState) => state.listItemCart.data; // get state
export const { addItemIntoCart, deleteItemIntoCart, setDataCount } = CartSlice.actions;
export default CartSlice.reducer;