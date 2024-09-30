const db = require("../util/database");

module.exports = class breakTime {
    constructor() {}

    static async fetchByDate(date) {
        return db.query("SELECT * FROM break_time WHERE date = ?", [date]);
    }
};
