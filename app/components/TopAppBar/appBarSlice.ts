import { createSlice } from '@reduxjs/toolkit';
// eslint-disable-next-line import/no-cycle
import { AppThunk, RootState } from '../../store';

const appBarSlice = createSlice({
  name: 'topappbar',
  initialState: { open: true },
  reducers: {
    setDrawerState: (state, action) => {
      state.open = action.payload;
    },
  },
});

export const { setDrawerState } = appBarSlice.actions;

export const toggleDrawerOpen = (): AppThunk => {
  return (dispatch, getState) => {
    const state = getState();
    dispatch(setDrawerState(!state.topappbar.open));
  };
};

export default appBarSlice.reducer;

export const selectOpen = (state: RootState) => state.topappbar.open;
