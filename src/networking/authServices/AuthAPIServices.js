import {ResponseType, URL} from '../../constants'
import { ShowToast } from '../../utils/ShowToast'
import { callGetApiWithToken, callPostApiWithToken, callPostApi } from '../Networking'

export const loginUser = async (data) => {
    try{
        const result = await callPostApi(URL.login, data);
        ShowToast(
            result.success === true
              ? result.message
              : result.errors
              ? `${result.errors.email ? result.errors.email[0] : ''}  ${
                  result.errors.password ? result.errors.password[0] : ''
                }`
              : result.message,
          );
          return result;
    }catch(error){
        console.log("error",error)
        ShowToast(error.message)
    }
}

export const logoutUser = async () => {
    try{
        const result = await callPostApiWithToken(
            URL.logout,
            null,
          );
      
          ShowToast(result.success === true ? result.message : `${result.message}`);
            return result;
    }catch(error){
        ShowToast(error.message)
    }
}

export const stripeSetting = async () => {
    try{
        const result = await callGetApiWithToken(URL.userTerminalSetting);
        return result.data;
    }catch(error){
        ShowToast(error.message)
    }
}

export const updateStripeSetting = async (data) => {
    try{
        console.log('data', data)
        const result = await callPostApiWithToken(URL.userTerminalSettingUpdate, data);
        console.log('result', result)
        ShowToast(result.success === true ? result.message : `${result.message}`);
        return result;
    }catch(error){
        ShowToast(error.message)
    }
}

export const checkAdminPin = async (data) => {
    try{
        const result = await callPostApiWithToken(URL.checkAdminPin, data);
        ShowToast(result.success === true ? result.message : `${result.message}`);
        return result;
    }catch(error){
        ShowToast(error.message)
    }
}
