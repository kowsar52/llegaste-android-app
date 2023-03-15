const productionUrl = 'https://llegaste.clevpro.com/public/api/';
// const developementUrl = 'https://api.https://llegaste.tech/api/';

export const BaseUrl = productionUrl;
export const ImageUrl = 'https://api.https://llegaste.tech/';

export const URL = {
    login: `${BaseUrl}login`,
    register: `${BaseUrl}register`,
    forgotPassword: `${BaseUrl}forgot-password`,
    resetPassword: `${BaseUrl}reset-password`,
    logout: `${BaseUrl}logout`,
    profile: `${BaseUrl}profile`,
    stripeConnectionToken: `${BaseUrl}terminal/connection_token`,
    userTerminalSetting: `${BaseUrl}user/terminal-setting`,
    userTerminalSettingUpdate: `${BaseUrl}user/terminal-setting-update`,
    checkAdminPin: `${BaseUrl}user/check-admin-pin`,
    createPaymentIntent: `${BaseUrl}terminal/create_payment_intent`,
    capturePaymentIntent: `${BaseUrl}terminal/capture_payment_intent`,
    captureManualPayment: `${BaseUrl}terminal/capture_manual_payment`,
}; 