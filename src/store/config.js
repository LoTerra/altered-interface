import { createSlice } from '@reduxjs/toolkit'
// Slice
const slice = createSlice({
    name: 'config',
    initialState: {
        ticketPrice: '',
        balanceOf: '',
        bonded: '',
        unBounded: '',
        rewards: '',
    },
    reducers: {
        _ticketPrice: (state, action) => {
            state.ticketPrice = action.payload;
        },
        _balanceOf: (state, action) =>  {
            state.balanceOf = action.payload;
        },
        _bonded: (state, action) =>  {
            state.bonded = action.payload;
        },
        _unBounded: (state, action) =>  {
            state.unBounded = action.payload;
        },
        _rewards: (state, action) =>  {
            state.rewards = action.payload;
        },
    },
});
export default slice.reducer
// Actions
const { _ticketPrice, _balanceOf, _bonded, _rewards, _unBounded } = slice.actions

export const ticketPrice = ({price}) => async dispatch => {
    try {
        // dispatch(_ticketPrice({price}));
        console.log(contractInfo)
    } catch (e) {
        return console.error(e.message);
    }
}
