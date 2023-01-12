class DateTimeService {
    constructor() {

    }

    getLocalDateTime(dateTime) {
        var date = new Date(dateTime);
        var userTimezoneOffset = date.getTimezoneOffset() * 60000;
        var localDateTime = new Date(date.getTime() - userTimezoneOffset);
        return localDateTime;
    }
}

module.exports = DateTimeService;
