const express = require("express");
const router = express.Router();

const emailController = require("../controllers/emailController");
const sheetService = require("../services/sheetService");
const emailService = require("../services/emailService");

const {
    authenticateToken,
    authorizeRoles
} = require("../middleware/auth");

console.log("Email Routes Loaded");

// Test Email
router.get("/test", emailController.sendTestEmail);

router.post(
    "/send",
    authenticateToken,
    authorizeRoles("Admin", "Manager"),
    async (req, res) => {

    try {

        console.log("Request Body:", req.body);
        const { customer } = req.body;

const invoices = await sheetService.getInvoices();

// Get ALL outstanding invoices for the selected customer
const customerInvoices = invoices.filter(inv =>
    inv.customer === customer &&
    Number(inv.outstanding) > 0
);

if (customerInvoices.length === 0) {
    return res.status(404).json({
        success: false,
        message: "No outstanding invoices found."
    });
}

// Use the first invoice only to get customer details
const invoice = customerInvoices[0];

if (!invoice.email) {
    return res.status(400).json({
        success: false,
        message: "Customer email missing"
    });
}

        console.log("=================================");
        console.log("Invoice Selected:");
        console.log(invoice);

        console.log("Customer:", invoice.customer);
        console.log("Customer Email:", invoice.email);
        console.log("Outstanding Invoices:", customerInvoices.length);
        console.log("=================================");


        // Send one email with all invoices
        const info = await emailService.sendReminder(
            invoice.customer,
            customerInvoices,
            invoice.email
        );

        console.log("===== CUSTOMER INVOICES =====");
        console.log(JSON.stringify(customerInvoices, null, 2));
        console.log("=============================");

        console.log("Email Sent:", info.messageId);

        // Update reminder date for each invoice
        for (const inv of customerInvoices) {
            await sheetService.updateLastReminder(inv.rowNumber);
        }

        res.json({
            success: true,
            message: "Reminder sent successfully."
        });
    }catch (err) {

    console.log("====================================");
    console.log("EMAIL ERROR");
    console.log("Message:", err.message);
    console.log("Stack:");
    console.log(err.stack);
    console.log("====================================");

    res.status(500).json({
        success: false,
        message: err.message
    });

}

});

module.exports = router;