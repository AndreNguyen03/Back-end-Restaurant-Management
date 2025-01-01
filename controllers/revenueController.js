import {invoice} from '../models/invoice.model.js';

export const getRevenue = async (req, res) => {
    try {
      const { month } = req.query;
  
      const today = new Date();
      const startOfToday = new Date(today.setHours(0, 0, 0, 0));
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  
      const dayOfMonth = today.getDate();
      const currentWeek = Math.ceil(dayOfMonth / 7);
  
      const startOfWeek = new Date(
        today.getFullYear(),
        today.getMonth(),
        (currentWeek - 1) * 7 + 1
      );
      const endOfWeek = new Date(
        today.getFullYear(),
        today.getMonth(),
        currentWeek * 7
      );
  
      const invoices = await invoice.aggregate([
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: '$total' },
            todayRevenue: {
              $sum: {
                $cond: [{ $gte: ['$createdAt', startOfToday] }, '$total', 0],
              },
            },
            weeklyRevenue: {
              $sum: {
                $cond: [
                  {
                    $and: [
                      { $gte: ['$createdAt', startOfWeek] },
                      { $lt: ['$createdAt', endOfWeek] },
                    ],
                  },
                  '$total',
                  0,
                ],
              },
            },
            monthlyRevenue: {
              $sum: {
                $cond: [
                  {
                    $and: [
                      { $gte: ['$createdAt', startOfMonth] },
                      { $lt: ['$createdAt', endOfMonth] },
                    ],
                  },
                  '$total',
                  0,
                ],
              },
            },
          },
        },
      ]);
  
      
  
      if (!invoices.length) {
        return res.status(404).json({ message: 'No invoice data found.' });
      }
  
      const totalRevenue =
        (invoices[0]?.totalRevenue || 0);
      const todayRevenue = invoices[0]?.todayRevenue || 0;
      const weeklyRevenue = invoices[0]?.weeklyRevenue || 0;
      const monthlyRevenue = invoices[0]?.monthlyRevenue || 0;
  
      const selectedMonth = month ? new Date(`${month}-01`) : startOfMonth;
      const chartData = [];
  
      for (let week = 1; week <= 4; week++) {
        const startOfChartWeek = new Date(
          selectedMonth.getFullYear(),
          selectedMonth.getMonth(),
          (week - 1) * 7 + 1
        );
        const endOfChartWeek = new Date(
          selectedMonth.getFullYear(),
          selectedMonth.getMonth(),
          week * 7
        );
  
        const weeklyChartRevenue = await invoice.aggregate([
          {
            $match: {
              createdAt: {
                $gte: startOfChartWeek,
                $lt: endOfChartWeek,
              },
            },
          },
          {
            $group: {
              _id: null,
              revenue: { $sum: '$total' },
            },
          },
        ]);
  
        chartData.push({
          week: `Week ${week}`,
          revenue: weeklyChartRevenue[0]?.revenue || 0,
        });
      }
  
      res.status(200).json({
        totalRevenue,
        todayRevenue,
        weeklyRevenue,
        monthlyRevenue,
        chartData,
      });
    } catch (error) {
      console.error('Error fetching revenue data:', error);
      res
        .status(500)
        .json({ message: 'Internal Server Error', error: error.message });
    }
  };
  