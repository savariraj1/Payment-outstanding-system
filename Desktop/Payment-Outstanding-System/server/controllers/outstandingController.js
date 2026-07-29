// const sheetService = require("../services/sheetService");

// exports.getOutstanding = async (req, res) => {
//     try {
//         const invoices = await sheetService.getInvoices();

//         res.json({
//             success: true,
//             count: invoices.length,
//             data: invoices
//         });

//     } catch (error) {
//         res.status(500).json({
//             success: false,
//             message: error.message
//         });
//     }
// };

const sheetService = require("../services/sheetService");

exports.getOutstanding = async (req, res) => {
    try {

        const invoices = await sheetService.getInvoices();

        const customers = {};

        invoices.forEach(inv => {

            if (!customers[inv.customer]) {

                customers[inv.customer] = {
                    invoiceNo: [],
                    customer: inv.customer,
                    dueDate: inv.dueDate,
                    days0to30: 0,
                    days31to60: 0,
                    days61to90: 0,
                    days90Plus: 0,
                    status: inv.status
                };

            }

            customers[inv.customer].invoiceNo.push(inv.invoiceNo);

            switch (inv.ageingBucket) {

                case "0-30":
                    customers[inv.customer].days0to30 += Number(inv.outstanding);
                    break;

                case "31-60":
                    customers[inv.customer].days31to60 += Number(inv.outstanding);
                    break;

                case "61-90":
                    customers[inv.customer].days61to90 += Number(inv.outstanding);
                    break;

                default:
                    customers[inv.customer].days90Plus += Number(inv.outstanding);
                    break;

            }

        });

        const result = Object.values(customers).map(c => ({
            invoiceNo: c.invoiceNo.join("/"),
            customer: c.customer,
            dueDate: c.dueDate,
            days0to30: c.days0to30,
            days31to60: c.days31to60,
            days61to90: c.days61to90,
            days90Plus: c.days90Plus,
            status: c.status
        }));

        res.json({
            success: true,
            data: result
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            message: err.message
        });

    }
};