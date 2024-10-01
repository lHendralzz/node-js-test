const db = require("../util/database");

module.exports = class breakTime {
    constructor() {}

    static async fetchByDate(date) {
        return db.query(
            "SELECT id, start_time, end_time FROM break_time WHERE date = ? order by start_time",
            [date]
        );
    }
};
