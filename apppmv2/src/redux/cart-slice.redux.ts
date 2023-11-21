import { createSlice } from '@reduxjs/toolkit';
import { RootState } from './store.redux';

const initialState = {
    listItemCart: {}
};

export const CartSlice = createSlice({
    name: 'add-list-cart',
    initialState,
    reducers: {
        addItemIntoCart: (state) => {

        }
    }
});

export const CartStore = (state: RootState) => state.listItemCart; // get state
export const { addItemIntoCart } = CartSlice.actions; 
export default CartSlice;