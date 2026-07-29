// const express = require("express");
// const router = express.Router();

// const sheetService = require("../services/sheetService");
// const generateExcel = require("../reports/excelReport");
// const generatePDF = require("../reports/pdfReport");


// // ===========================
// // Export Excel
// // ===========================
// router.get("/excel", async (req, res) => {

//     try {

//         const invoices = await sheetService.getInvoices();

//         await generateExcel(invoices, res);

//     } catch (err) {

//         console.error(err);

//         res.status(500).json({
//             success: false,
//             message: err.message
//         });

//     }

// });

// // ===========================
// // Export PDF
// // ===========================
// router.get("/pdf", async (req, res) => {

//     try {

//         const invoices = await sheetService.getInvoices();

//         generatePDF(invoices, res);

//     } catch (err) {

//         console.error(err);

//         res.status(500).json({
//             success: false,
//             message: err.message
//         });

//     }

// });

// module.exports = router;

const express = require("express");
const router = express.Router();

const sheetService = require("../services/sheetService");
const generateExcel = require("../reports/excelReport");
const generatePDF = require("../reports/pdfReport");

// ===========================
// Export Excel
// ===========================
router.get("/excel", async (req, res) => {

        try {

            const invoices = await sheetService.getInvoices();

            await generateExcel(invoices, res);

        } catch (err) {

            console.error(err);

            res.status(500).json({
                success: false,
                message: err.message
            });

        }

    }
);

// ===========================
// Export PDF
// ===========================
router.get("/pdf", async (req, res) => {

        try {

            const invoices = await sheetService.getInvoices();

            generatePDF(invoices, res);

        } catch (err) {

            console.error(err);

            res.status(500).json({
                success: false,
                message: err.message
            });

        }

    }
);

module.exports = router;