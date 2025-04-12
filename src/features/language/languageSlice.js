// features/language/languageSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentLanguage: localStorage.getItem('preferredLanguage') || 'FR',
};

const languageSlice = createSlice({
  name: 'language',
  initialState,
  reducers: {
    setLanguage: (state, action) => {
      state.currentLanguage = action.payload;
      localStorage.setItem('preferredLanguage', action.payload);
    },
  },
});

export const { setLanguage } = languageSlice.actions;
export default languageSlice.reducer;
