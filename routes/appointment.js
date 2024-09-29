const express = require("express");

const router = express.Router();
const appointmentController = require("../controllers/appointment");

router.use(express.json());
router.get("/", appointmentController.getAppointmentByDate);
router.post("/", appointmentController.postAppointment);

router.put("/configuration", appointmentController.putConfiguration);

// TODO : INSERT HOLIDAY [for now only by database insert]
// TODO : INSERT BREAK

module.exports = router;
