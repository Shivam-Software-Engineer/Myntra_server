const { orderModel } = require("../../Models/Cleint/orderModel");
const userModel = require("../../Models/Cleint/userModel");


// =====================================================
// GET DASHBOARD OVERVIEW
// =====================================================

const getDashboardOverview = async (req, res) => {

    try {

        // =====================================================
        // DATE SETUP
        // =====================================================

        const now = new Date();


        // =====================================================
        // TODAY START
        // Example:
        // 2026-07-27 00:00:00
        // =====================================================

        const todayStart = new Date(now);

        todayStart.setHours(
            0,
            0,
            0,
            0
        );


        // =====================================================
        // TOMORROW START
        // =====================================================

        const tomorrowStart = new Date(
            todayStart
        );

        tomorrowStart.setDate(
            tomorrowStart.getDate() + 1
        );


        // =====================================================
        // LAST 7 DAYS START
        // =====================================================

        const sevenDaysAgo = new Date(
            todayStart
        );

        sevenDaysAgo.setDate(
            sevenDaysAgo.getDate() - 6
        );


        // =====================================================
        // COMPLETED PAYMENT FILTER
        // 
        // Sirf successful payments ki sales count hongi
        // =====================================================

        const completedPaymentFilter = {

            paymentStatus: "COMPLETED"

        };


        // =====================================================
        // 1. TODAY SALES
        // =====================================================

        const todaySalesResult =
            await orderModel.aggregate([

                {
                    $match: {

                        paymentStatus:
                            "COMPLETED",

                        createdAt: {

                            $gte:
                                todayStart,

                            $lt:
                                tomorrowStart

                        }

                    }

                },

                {
                    $group: {

                        _id: null,

                        totalSales: {

                            $sum:
                                "$orderAmount"

                        }

                    }

                }

            ]);


        const todaySales =
            todaySalesResult[0]?.totalSales ||
            0;


        // =====================================================
        // 2. TOTAL SALES
        // =====================================================

        const totalSalesResult =
            await orderModel.aggregate([

                {
                    $match:
                        completedPaymentFilter
                },

                {
                    $group: {

                        _id: null,

                        totalSales: {

                            $sum:
                                "$orderAmount"

                        }

                    }

                }

            ]);


        const totalSales =
            totalSalesResult[0]?.totalSales ||
            0;


        // =====================================================
        // 3. TODAY ORDERS
        // =====================================================

        const todayOrders =
            await orderModel.countDocuments({

                createdAt: {

                    $gte:
                        todayStart,

                    $lt:
                        tomorrowStart

                }

            });


        // =====================================================
        // 4. TOTAL ORDERS
        // =====================================================

        const totalOrders =
            await orderModel.countDocuments();


        // =====================================================
        // 5. TODAY REGISTERED USERS
        // =====================================================

        const todayUsers =
            await userModel.countDocuments({

                createdAt: {

                    $gte:
                        todayStart,

                    $lt:
                        tomorrowStart

                }

            });


        // =====================================================
        // 6. TOTAL USERS
        // =====================================================

        const totalUsers =
            await userModel.countDocuments();


        // =====================================================
        // 7. PENDING ORDERS
        // =====================================================

        const pendingOrders =
            await orderModel.countDocuments({

                orderStatus:
                    "PENDING"

            });


        // =====================================================
        // 8. PROCESSING ORDERS
        // =====================================================

        const processingOrders =
            await orderModel.countDocuments({

                orderStatus:
                    "PROCESSING"

            });


        // =====================================================
        // 9. COMPLETED ORDERS
        // =====================================================

        const completedOrders =
            await orderModel.countDocuments({

                orderStatus:
                    "COMPLETED"

            });


        // =====================================================
        // 10. CANCELLED ORDERS
        // =====================================================

        const cancelledOrders =
            await orderModel.countDocuments({

                orderStatus:
                    "CANCELLED"

            });


        // =====================================================
        // 11. LAST 7 DAYS SALES + ORDERS
        // =====================================================

        const weeklyData =
            await orderModel.aggregate([

                {
                    $match: {

                        paymentStatus:
                            "COMPLETED",

                        createdAt: {

                            $gte:
                                sevenDaysAgo,

                            $lt:
                                tomorrowStart

                        }

                    }

                },

                {
                    $group: {

                        _id: {

                            $dateToString: {

                                format:
                                    "%Y-%m-%d",

                                date:
                                    "$createdAt"

                            }

                        },

                        sales: {

                            $sum:
                                "$orderAmount"

                        },

                        orders: {

                            $sum:
                                1

                        }

                    }

                },

                {
                    $sort: {

                        _id:
                            1

                    }

                }

            ]);


        // =====================================================
        // 12. CREATE COMPLETE LAST 7 DAYS DATA
        // 
        // Agar kisi din order nahi hua to:
        // sales = 0
        // orders = 0
        // =====================================================

        const chartData = [];


        for (
            let i = 0;
            i < 7;
            i++
        ) {

            const currentDate =
                new Date(
                    todayStart
                );


            currentDate.setDate(

                currentDate.getDate()
                - (6 - i)

            );


            // Local date ko YYYY-MM-DD me convert

            const year =
                currentDate.getFullYear();


            const month =
                String(
                    currentDate.getMonth() + 1
                ).padStart(
                    2,
                    "0"
                );


            const day =
                String(
                    currentDate.getDate()
                ).padStart(
                    2,
                    "0"
                );


            const dateString =
                `${year}-${month}-${day}`;


            // Aggregation me same date search

            const foundData =
                weeklyData.find(

                    (item) =>
                        item._id ===
                        dateString

                );


            chartData.push({

                date:
                    dateString,

                sales:
                    foundData?.sales ||
                    0,

                orders:
                    foundData?.orders ||
                    0

            });

        }


        // =====================================================
        // RESPONSE
        // =====================================================

        return res.status(200).json({

            status:
                1,

            message:
                "Dashboard data fetched successfully.",

            data: {

                // ==========================================
                // SALES
                // ==========================================

                sales: {

                    today:
                        todaySales,

                    total:
                        totalSales

                },


                // ==========================================
                // ORDERS
                // ==========================================

                orders: {

                    today:
                        todayOrders,

                    total:
                        totalOrders,

                    pending:
                        pendingOrders,

                    processing:
                        processingOrders,

                    completed:
                        completedOrders,

                    cancelled:
                        cancelledOrders

                },


                // ==========================================
                // USERS
                // ==========================================

                users: {

                    today:
                        todayUsers,

                    total:
                        totalUsers

                },


                // ==========================================
                // LAST 7 DAYS CHART
                // ==========================================

                chart:
                    chartData

            }

        });


    } catch (error) {

        console.log(
            "Dashboard Controller Error:",
            error
        );


        return res.status(500).json({

            status:
                0,

            message:
                "Something went wrong while fetching dashboard data.",

            error:
                error.message

        });

    }

};


// =====================================================
// EXPORT
// =====================================================

module.exports = {

    getDashboardOverview

};