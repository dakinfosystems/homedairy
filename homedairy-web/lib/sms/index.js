/**
 * It sends specifically OTP to users
 * 
 * @param {string} to 
 * @param {string} otp 
 * @param {string} reason 
 * @param {function} resolve 
 * @param {function} reject 
 */
function sendOtpExecutor(to, otp, reason, resolve, reject) {
    let verifyOtpMsg = "{{OTP}} is your One Time Password for {{REASON}}. Never share OTPs with anyone verbally."
    let otpRegex = /{{OTP}}/g;
    let reasonRegex = /{{REASON}}/g;
    // Action to be performed

    verifyOtpMsg = verifyOtpMsg.replace(otpRegex, otp);
    verifyOtpMsg = verifyOtpMsg.replace(reasonRegex, reason ? reason : "verification");
    console.log("SMS otp to: " +to+ " msg: " +verifyOtpMsg);

    // TODO: implement to send sms
    
    resolve();
}

/**
 * It sends custom msg to users
 * 
 * @param {string} to 
 * @param {string} msg 
 * @param {function} resolve 
 * @param {function} reject 
 */
function sendMsgExecutor(to, msg, resolve, reject) {
    // Action to be performed
    console.log("SMS to: " +to+ " msg: " +msg);
    // TODO: implement to send sms

    resolve();
}

/*============================================================================*/
/**
 * Exports api which are related to sending messages
 */
exports.send = {
    /**
     * It will send otp to user
     * 
     * @param {string} to mobile number of user
     * @param {string} otp otp number in string form to be sent
     * @returns returns a Promise
     */
    otp: (to, otp, reason) => {
        return new Promise((resolve, reject) => {
            sendOtpExecutor(to, otp, reason, resolve, reject);
        });
    },

    /**
     * It will send message to user
     * 
     * @param {string} to mobile number of user
     * @param {string} otp custom message to be sent
     * @returns returns a Promise
     */
    msg: (to, msg) => {
        return new Promise((resolve, reject) => {
            sendMsgExecutor(to, msg, resolve, reject);
        });
    }
};
