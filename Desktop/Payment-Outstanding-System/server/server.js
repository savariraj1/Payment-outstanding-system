    // require("dotenv").config();

    // const app = require("./app");

    // const startScheduler = require("./cron/scheduler");

    // const PORT = process.env.PORT || 5000;

    // app.listen(PORT, () => {

    //     console.log(`Server Running on ${PORT}`);

    //     startScheduler();

    // });

require("dotenv").config();

const app = require("./app");

// ===========================
// Start Scheduler
// ===========================
require("./scheduler/scheduler");

const PORT = process.env.PORT || 5000;

console.log("================================");
console.log("SERVER STARTING...");
console.log("================================");

app.listen(PORT, () => {
    console.log(`Server Running on Port ${PORT}`);
});