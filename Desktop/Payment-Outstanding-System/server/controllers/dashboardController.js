const sheetService = require("../services/sheetService");

async function getDashboard(req, res) {

    try {

        const invoices = await sheetService.getInvoices();

        let totalOutstanding = 0;
        let totalInvoices = invoices.length;
        let pendingInvoices = 0;
        let paidInvoices = 0;
        let paidInvoiceAmount = 0;

        const ageing = {
            "0-30": 0,
            "31-60": 0,
            "61-90": 0,
            "90+": 0
        };

        const outstandingByBucket = {
            "0-30": 0,
            "31-60": 0,
            "61-90": 0,
            "90+": 0
        };

        invoices.forEach(invoice => {

            const invoiceAmount = Number(invoice.amount || 0);
            const paidAmount = Number(invoice.paidAmount || 0);
            const outstanding = Number(invoice.outstanding || 0);

            // Dashboard Totals
            totalOutstanding += outstanding;

            // Total Amount Received
            paidInvoiceAmount += paidAmount;

            // Invoice Counts
            if ((invoice.status || "").trim() === "Paid") {
                paidInvoices++;
            } else {
                pendingInvoices++;
            }

            // Ageing Bucket
            switch (invoice.ageingBucket) {

                case "0-30":
                    ageing["0-30"]++;
                    outstandingByBucket["0-30"] += outstanding;
                    break;

                case "31-60":
                    ageing["31-60"]++;
                    outstandingByBucket["31-60"] += outstanding;
                    break;

                case "61-90":
                    ageing["61-90"]++;
                    outstandingByBucket["61-90"] += outstanding;
                    break;

                case "90+":
                    ageing["90+"]++;
                    outstandingByBucket["90+"] += outstanding;
                    break;

                default:
                    break;
            }

        });

        res.json({

            success: true,

            data: {

                totalOutstanding,
                totalInvoices,
                pendingInvoices,
                paidInvoices,
                paidInvoiceAmount,
                ageing,
                outstandingByBucket

            }

        });

    } catch (err) {

        console.error(err);

        res.status(500).json({

            success: false,
            message: err.message

        });

    }

}

module.exports = {
    getDashboard
};