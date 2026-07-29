const sheetService = require("./sheetService");
const emailService = require("./emailService");

async function sendAutomaticReminders() {

    try {

        console.log("Automatic Reminder Started...");

        const invoices = await sheetService.getInvoices();

        const customers = [...new Set(
            invoices
                .filter(inv => Number(inv.outstanding) > 0)
                .map(inv => inv.customer)
        )];

        for (const customer of customers) {

            const customerInvoices = invoices.filter(inv =>
                inv.customer === customer &&
                Number(inv.outstanding) > 0
            );

            if (customerInvoices.length === 0)
                continue;

            const firstInvoice = customerInvoices[0];

            if (!firstInvoice.email)
                continue;

            await emailService.sendReminder(
                firstInvoice.customer,
                customerInvoices,
                firstInvoice.email
            );

            for (const inv of customerInvoices) {
                await sheetService.updateLastReminder(inv.rowNumber);
            }

            console.log(`Reminder Sent : ${customer}`);

        }

        console.log("Automatic Reminder Completed");

    } catch (err) {

        console.error(err);

    }

}

module.exports = {
    sendAutomaticReminders
};