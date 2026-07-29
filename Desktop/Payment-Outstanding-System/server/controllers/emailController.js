// const sheetService = require("../services/sheetService");
// const emailService = require("../services/emailService");

// exports.sendTestEmail = async (req, res) => {

//     try {

//         const invoices = await sheetService.getInvoices();

//         if (invoices.length === 0) {
//             return res.status(404).json({
//                 success: false,
//                 message: "No invoices found."
//             });
//         }

//         const invoice = invoices[0];

//         const info = await emailService.sendReminder(invoice);

//         res.json({
//             success: true,
//             message: "Email sent successfully.",
//             messageId: info.messageId
//         });

//     } catch (err) {

//         res.status(500).json({
//             success: false,
//             message: err.message
//         });

//     }

// };

const sheetService = require("../services/sheetService");
const emailService = require("../services/emailService");

exports.sendTestEmail = async (req, res) => {

    try {

        const invoices = await sheetService.getInvoices();

        if (invoices.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No invoices found."
            });
        }

        // First invoice
        const invoice = invoices[0];

        // Check email exists
        if (!invoice.email) {
            return res.status(400).json({
                success: false,
                message: "Customer email missing in Google Sheet."
            });
        }

        // All outstanding invoices for this customer
        const customerInvoices = invoices.filter(inv =>
            inv.customer === invoice.customer &&
            Number(inv.outstanding) > 0
        );

        console.log("Customer:", invoice.customer);
        console.log("Email:", invoice.email);

        const info = await emailService.sendReminder(
            invoice.customer,
            customerInvoices,
            invoice.email
        );

        res.json({
            success: true,
            message: "Test email sent successfully.",
            messageId: info.messageId
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

};