import { createSlice } from '@reduxjs/toolkit';

const notificationSlice = createSlice({
  name: 'notification',
  initialState: { message: '', type: '', visible: false },
  reducers: {
    showNotification: (state, { payload }) => {
      state.message = payload.message;
      state.type = payload.type || 'info';
      state.visible = true;
    },
    hideNotification: (state) => {
      state.visible = false;
    },
  },
});

export const { showNotification, hideNotification } = notificationSlice.actions;

export default notificationSlice.reducer;