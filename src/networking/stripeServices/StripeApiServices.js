import { ShowToast } from '../../utils/ShowToast'
import { callGetApiWithToken, callPostApiWithToken, callPostApi } from '../Networking'
import { URL } from '../../constants'


export const createPaymentIntentApi = async (data) => {
    try{
        const result = await callPostApiWithToken(URL.createPaymentIntent, data);
        console.log('result',result)
        return result;
    }catch(error){
        ShowToast(error.message)
    }
}

export const capturePaymentIntent = async (data) => {
    try{
        const result = await callPostApiWithToken(URL.capturePaymentIntent, data);
        return result;
    }catch(error){
        ShowToast(error.message)
    }
}

export const captureManualPayment = async (data) => {
    try{
        const result = await callPostApiWithToken(URL.captureManualPayment, data);
        return result;
    }catch(error){
        ShowToast(error.message)
    }
}