exports.genRandomString = (length, chars) => {
    let mask = '';
    let result = '';

    if (chars.indexOf('a') > -1) mask += 'abcdefghijklmnopqrstuvwxyz';
    if (chars.indexOf('A') > -1) mask += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (chars.indexOf('0') > -1) mask += '0123456789';
    if (chars.indexOf('!') > -1) mask += '~`!@#$%^&*()_+-={}[]:";\'<>?,./|\\';
    
    for (let i = length; i > 0; --i) {
        result += mask[Math.round(Math.random() * (mask.length - 1))];
    }
    return result;
}

exports.getMilliCount= () => {
    return "";
}