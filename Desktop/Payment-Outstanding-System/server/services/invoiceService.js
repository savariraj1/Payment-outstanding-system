const db = require("../config/db");
const calculateAgeing = require("./ageing");

exports.getCustomerOutstanding = async(customer)=>{

    const [rows]=await db.query(

        `

        SELECT *

        FROM invoices

        WHERE company_name=?

        AND outstanding_amount>0

        `,

        [customer]

    );

    console.log("Rows from DB:");
console.log(rows);

    return rows.map(r=>{

        const ageing=calculateAgeing(r.due_date);

        return{

            invoiceNo:r.invoice_number,

            customer:r.customer_name,

            company:r.company_name,

            invoiceDate:r.invoice_date,

            dueDate:r.due_date,

            outstanding:Number(r.outstanding_amount),

            email:r.email,

            ageingBucket:ageing.bucket

        };

    });

}