import Toast from 'react-native-toast-message';

export const toastError = (message, text2) => {
  Toast.show({
    type: 'error',
    text1: message,
    text2,
  });
};

export const toastSuccess = (message, text2) => {
  Toast.show({
    type: 'success',
    text1: message,
    text2,
  });
};
