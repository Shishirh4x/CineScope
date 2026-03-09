import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './app/store';
import AppRouter from './routes/AppRouter';
import Notification from './components/Notification/Notification';

export default function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <AppRouter />
        <Notification />
      </BrowserRouter>
    </Provider>
  );
}
