const Appointment = require("../models/appointment");
const { format } = require("../util/database");
const utilDate = require("../util/date");

exports.getAppointmentByDate = (req, res, next) => {
    if (utilDate.isValidDate(new Date(req.query.date))) {
        res.status(400).send({ message: "invalid format" });
    }

    // check if in holiday
    Appointment.checkIsHoliday(req.query.date).then(isHoliday => {
        if (isHoliday) {
            res.status(422).send({
                message: "cannot get appointment at holiday",
            });
            return;
        }
        // fetch data from database
        Appointment.fetchAllAvailableAppointment(req.query.date).then(
            ([appointments]) => {
                listAppointment = [];
                appointments.forEach(function (result) {
                    listAppointment.push({
                        date: result.date,
                        time: result.time,
                        available: result.available,
                    });
                });
                res.status(200).send(listAppointment);
                return;
            }
        );
    });
};

exports.postAppointment = (req, res, next) => {
    if (utilDate.isValidDate(new Date(req.body.date))) {
        res.status(400).send({ message: "invalid format" });
        return;
    }
    // create appointment
    const appointment = new Appointment(
        req.body.date,
        req.body.time,
        req.body.duration
    );

    // check if holiday
    Appointment.checkIsHoliday(appointment.date).then(isHoliday => {
        if (isHoliday) {
            res.status(422).send({
                message: "cannot set appointment at holiday",
            });
            return;
        }

        // check if appointment available
        appointment.checkIfAvailable().then(isAvailable => {
            if (!isAvailable) {
                res.status(409).send({ message: "appointment not available" });
                return;
            }

            // book appointment
            appointment
                .book()
                .then(() => {
                    res.status(200).send({
                        message: "appointment success booked",
                    });
                    return;
                })
                .catch(err => {
                    console.log(err);
                    res.status(500).send({ message: "internal server error" });
                });
        });
    });
};

function checkValidConfiguration(duration, slot) {
    // duration min 5 minutes
    if (duration < 5) {
        return "duration min 5 minutes";
    }
    // available_slot 1 -5 slot
    if (slot < 1 || slot > 5) {
        return "available_slot must between 1 and 5";
    }
    return "";
}

exports.putConfiguration = (req, res, next) => {
    // validate request
    checkConfigurationError = checkValidConfiguration(
        req.body.duration,
        req.body.available_slot
    );
    if (checkConfigurationError != "") {
        res.status(400).send({
            message: `cannot update configuration error : ${checkConfigurationError}`,
        });
        return;
    }

    // check date is holiday
    Appointment.checkIsHoliday(req.body.date).then(isHoliday => {
        if (isHoliday) {
            res.status(422).send({
                message: `cannot update configuration error : inputed date is holiday`,
            });
            return;
        }
        // get break time

        // delete all appointment
        Appointment.deleteAllByDate(req.body.date).then(() => {
            // TODO : delete all booked

            // create all the available booking for that time as array
            const ListNewAppointments =
                Appointment.getListOfAvailabeAppointmentByDate(
                    req.body.date,
                    req.body.duration,
                    req.body.available_slot,
                    req.body.start_time,
                    req.body.end_time
                );

            Appointment.saveBulk(ListNewAppointments)
                .then(() => {
                    res.status(200).send({
                        message: "success update configuration",
                    });
                    return;
                })
                .catch(err => {
                    res.status(500).send({
                        message: "internal server error: ",
                        err,
                    });
                    return;
                });
        });
    });
};
