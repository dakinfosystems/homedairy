/*
 * Date time library
 */
function getMonth(time, format) {
    let months = [
        'JANUARY',
        'FEBUARY',
        'MARCH',
        'APRIL',
        'MAY',
        'JUNE',
        'JULY',
        'AUGUST',
        'SEPTEMBER',
        'OCTOBER',
        'NOVEMBER',
        'DECEMBER',
    ];

    let month = '';
    if (!time.getMonth || typeof (format) !== 'string') {
        return '';
    }

    if ('MM' === format) {
        month = '0' + (time.getMonth() + 1);
        month = month.substring(month.length - 2);
    } else if ('MMM' === format) {
        month = months[time.getMonth()];
        month = month.substr(0, 3);
    }
    return month;
}

function getYear(time, format) {
    let year = ''
    if (!time.getFullYear || typeof (format) !== 'string') {
        return year;
    }
    //console.log(format);
    if ('YY' === format) {
        year = '' + (time.getFullYear());
        year = year.substring(year.length - 2);
    } else if ('YYYY' === format) {
        year = '' + time.getFullYear();
    }
    return year;
}

function getDate(time, format) {
    let date = ''
    if (!time.getDate || typeof (format) !== 'string') {
        return date;
    }

    date = '0' + (time.getDate());
    date = date.substring(date.length - 2);

    return date;
}

function getHour(time, format) {
    let hour = ''

    if (!time.getHours || typeof (format) !== 'string') {
        return hour;
    }

    if ('hh' === format) {
        hour = '0' + (time.getHours() > 12 ? time.getHours() - 12 : time.getHours());
        hour = hour.substring(hour.length - 2);
    } else if ('HH' === format) {
        hour = '0' + time.getHours();
        hour = hour.substring(hour.length - 2);
    }
    return hour;
}

function getMinutes(time, format) {
    let minute = ''

    if (!time.getMinutes || typeof (format) !== 'string') {
        return minute;
    }

    minute = '0' + time.getMinutes()
    minute = minute.substring(minute.length - 2)

    return minute;
}

function getSeconds(time, format) {
    let second = ''

    if (!time.getSeconds || typeof (format) !== 'string') {
        return second;
    }

    second = '0' + time.getSeconds()
    second = second.substring(second.length - 2);

    return second;
}

function getMilliSeconds(time, format) {
    let msec = '';

    if (!time.getMilliseconds || typeof (format) !== 'string') {
        return msec;
    }

    msec = "00" + time.getMilliseconds();
    msec = msec.substring(msec.length - 3);

    return msec;
}

function getDay(time, format) {
    let days = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
    ];
    let day = '';
    if (!time.getDay || typeof (format) !== 'string') {
        return '';
    }

    if ('d' === format) {
        day = days[time.getDay()].substr(0,3);
    } else if ('dd' === format) {
        day = days[time.getDay()];
    }

    return day;
}

function getUnit(time, match) {
    let retDate = '';
    switch (match) {
        case 'YY':
        case 'YYYY':
            retDate += getYear(time, match);
            break;
        case 'MMM':
        case 'MM':
            retDate += getMonth(time, match);
            break;
        case 'DD':
            retDate += getDate(time, match);
            break;
        case 'HH':
        case 'hh':
            retDate += getHour(time, match);
            break;
        case 'mm':
            retDate += getMinutes(time, match);
            break;
        case 'SS':
            retDate += getSeconds(time, match);
            break;
        case 'ss':
            retDate += getMilliSeconds(time, match);
            break;
        case 'd':
        case 'dd':
            reDate += getDay(time, match);
            break;
        default:
            break;
    }

    return retDate;
}

function formatfn(now, format) {
    let retDate = '';
    let match = '';

    while ('' != format) {
        if (-1 !== (['Y', 'M', 'D', 'H', 'h', 'm', 'S', 's', 'd'].indexOf(format[0]))) {
            if ('' === match) {
                match = format[0];
                format = format.substring(1);
            }
            else if (format[0] === match[0]) {
                match += format[0];
                format = format.substring(1);
            }
            else {
                retDate += getUnit(now, match);
                match = ''
            }

        } else {
            if ('' !== match) {
                retDate += getUnit(now, match);
                match = '';
            }
            retDate += format[0];
            format = format.substring(1);
        }
    }

    if ('' !== match) {
        retDate += getUnit(now, match);
    }

    return retDate;
}

module.exports = {
    getNow: function (format) {
        let now = new Date();
        return formatfn(now, format);
    },
    toFormat: function (time, format) {
        return formatfn(time, format);
    }
}
