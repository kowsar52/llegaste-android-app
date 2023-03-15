import Toast from 'react-native-simple-toast';

export const ShowToast = message => {
  message !== undefined && Toast.show(message, Toast.LONG);
};
