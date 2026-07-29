// function calculateAgeing(dueDate) {

//     const today = new Date();

//     const parts = dueDate.split("-");

//     const due = new Date(
//         parts[2],
//         parts[1] - 1,
//         parts[0]
//     );


//     const diff = today - due;

//     const days = Math.floor(
//         diff / (1000 * 60 * 60 * 24)
//     );


//     if (days <= 0) {
//         return {
//             days: 0,
//             bucket: "Not Due"
//         };
//     }


//     if (days <= 30) {
//         return {
//             days,
//             bucket: "0-30 Days"
//         };
//     }


//     if (days <= 60) {
//         return {
//             days,
//             bucket: "31-60 Days"
//         };
//     }


//     if (days <= 90) {
//         return {
//             days,
//             bucket: "61-90 Days"
//         };
//     }


//     return {
//         days,
//         bucket: ">90 Days"
//     };

// }


// module.exports = calculateAgeing;

function calculateAgeing(dueDate) {

    if (!dueDate) {
        return {
            days: 0,
            bucket: "0-30"
        };
    }

    // Due date format: DD-MM-YYYY
    const [day, month, year] = dueDate.split("-").map(Number);

    const due = new Date(year, month - 1, day);
    const today = new Date();

    // Remove time portion
    due.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    const diff = today - due;

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days <= 30) {
        return {
            days: Math.max(days, 0),
            bucket: "0-30"
        };
    }

    if (days <= 60) {
        return {
            days,
            bucket: "31-60"
        };
    }

    if (days <= 90) {
        return {
            days,
            bucket: "61-90"
        };
    }

    return {
        days,
        bucket: "90+"
    };
}

module.exports = calculateAgeing;