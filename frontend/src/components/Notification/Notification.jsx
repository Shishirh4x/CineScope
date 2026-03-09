// src/components/Notification/Notification.jsx
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { hideNotification } from '../../features/notification/notificationSlice';
import './Notification.css';

export default function Notification() {
  const dispatch = useDispatch();
  const { message, type, visible } = useSelector((state) => state.notification);

  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => {
        dispatch(hideNotification());
      }, 3000); // Hide after 3 seconds
      return () => clearTimeout(timer);
    }
  }, [visible, dispatch]);

  if (!visible) return null;

  return (
    <div className={`notification notification--${type}`}>
      <p className="notification__message">{message}</p>
      <button className="notification__close" onClick={() => dispatch(hideNotification())}>
        ×
      </button>
    </div>
  );
}