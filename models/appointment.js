const db = require("../util/database");
const time = require("../util/time");

module.exports = class appointment {
    constructor(date, time, duration, available_slot) {
        this.date = date;
        this.time = time;
        this.duration = duration;
        this.available_slot = available_slot;
    }

    book() {
        return db.query(
            `UPDATE appointment SET available = available - 1 WHERE date = ? and time = ?`,
            [this.date, this.time]
        );
    }

    static checkIsHoliday(date) {
        return db
            .execute("SELECT id FROM holiday WHERE date = ? LIMIT 1", [date])
            .then(([result]) => {
                if (result.length == 0) {
                    return false;
                }
                return true;
            });
    }

    checkIfAvailable() {
        return db
            .execute(
                "SELECT available FROM appointment WHERE date = ? and time = ?",
                [this.date, this.time]
            )
            .then(([result]) => {
                if (result[0] == undefined) {
                    return false;
                }
                return result[0].available > 0;
            });
    }

    static fetchAllAvailableAppointment(date) {
        return db.execute(
            "SELECT DATE_FORMAT(date, '%Y-%m-%d') AS date, time, available FROM appointment WHERE date = ?",
            [date]
        );
    }

    static deleteAllByDate(date) {
        return db
            .query("DELETE FROM appointment WHERE date = ?", [date])
            .then(([result]) => {
                return;
            });
    }

    static getListOfAvailabeAppointmentByDate(
        date,
        duration,
        available_slot,
        startTime,
        endTime,
        breakTimeLists
    ) {
        // list generated appointment
        const listAppointments = [];

        const startTimeDate = new Date();
        const endTimeDate = new Date();

        const startTimeHour = startTime.split(":")[0];
        const startTimeMinute = startTime.split(":")[1];
        const endTimeHour = endTime.split(":")[0];
        const endTimeMinute = endTime.split(":")[1];
        endTimeDate.setHours(endTimeHour, endTimeMinute, 0, 0);
        let currBreakTime = breakTimeLists.shift();

        for (
            startTimeDate.setHours(startTimeHour, startTimeMinute, 0, 0);
            startTimeDate <= endTimeDate;
            startTimeDate.setMinutes(startTimeDate.getMinutes() + duration)
        ) {
            while (
                currBreakTime != undefined &&
                time.isBetweenWithDuration(
                    startTimeDate,
                    duration,
                    currBreakTime.start_time,
                    currBreakTime.end_time
                )
            ) {
                const afterBreakHour = currBreakTime.end_time.split(":")[0];
                const afterBreakMinute = currBreakTime.end_time.split(":")[1];
                startTimeDate.setHours(afterBreakHour, afterBreakMinute, 0, 0);
                currBreakTime = breakTimeLists.shift();
            }
            listAppointments.push(
                new appointment(
                    date,
                    startTimeDate.toTimeString().slice(0, 5),
                    duration,
                    available_slot
                )
            );
        }

        return listAppointments;
    }

    static saveBulk(listAppointments) {
        let insertQuery = `
            INSERT INTO appointment(date, time, available)
            VALUES
        `;
        const params = [];

        listAppointments.forEach(function (appointment, index) {
            if (index != 0) {
                insertQuery += ",";
            }
            insertQuery += "(?,?,?)";
            params.push(appointment.date);
            params.push(appointment.time);
            params.push(appointment.available_slot);
        });
        insertQuery += ";";

        return db.query(insertQuery, params);
    }
};
