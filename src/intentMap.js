const { show, register } = require("./controllers/intents/patient");
const { specialties, plan, doctor,calendarDay, calendarShift, finish } = require("./controllers/intents/medicalAppointment");

const intentMap = new Map();

intentMap.set("Default Welcome Intent", show);
intentMap.set("Register",register);
intentMap.set("Specialty", specialties)
intentMap.set("Finish", finish);
intentMap.set("Doctor", doctor);
intentMap.set("CalendarDay", calendarDay);
intentMap.set("CalendarShift", calendarShift);
intentMap.set("Plan", plan);

module.exports = intentMap;
