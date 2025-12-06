import { Alert, Platform, ToastAndroid } from 'react-native';

const isAndroid = Platform.OS === 'android';
const defaultDuration = ToastAndroid.SHORT;

const showAndroidToast = (message, duration = defaultDuration) => {
  ToastAndroid.showWithGravity(message, duration, ToastAndroid.BOTTOM);
};

const showAlertDialog = (title, message) => {
  Alert.alert(title, message);
};

const normalizeMessage = (message, fallback) =>
  typeof message === 'string' && message.trim().length > 0 ? message : fallback;

export const showSuccess = message => {
  const text = normalizeMessage(message, 'Berhasil diproses');
  if (isAndroid) {
    showAndroidToast(text);
  } else {
    showAlertDialog('Sukses', text);
  }
};

export const showError = message => {
  const text = normalizeMessage(message, 'Terjadi kesalahan');
  if (isAndroid) {
    showAndroidToast(text);
  } else {
    showAlertDialog('Kesalahan', text);
  }
};

export const showInfo = message => {
  const text = normalizeMessage(message, 'Informasi');
  if (isAndroid) {
    showAndroidToast(text);
  } else {
    showAlertDialog('Info', text);
  }
};
