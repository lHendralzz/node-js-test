const db = require("../util/database");

module.exports = class booked {
    constructor(username, password) {
        this.username = username;
        this.password = password;
    }

    static fetchAllAvailableAppointment(date) {
        return db.execute(
            "SELECT DATE_FORMAT(date, '%Y-%m-%d') AS date, time, available FROM appointment"
        );
    }
};
