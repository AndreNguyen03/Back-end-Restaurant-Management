import { invoice } from '../models/invoice.model.js';
import moment from 'moment-timezone';

export const getRevenue = async (req, res) => {
  try {
    const { month } = req.query;

    const today = moment.tz('Asia/Ho_Chi_Minh');
    const startOfToday = today.clone().startOf('day');
    const startOfMonth = today.clone().startOf('month');
    const endOfMonth = today.clone().endOf('month');

    // Calculate the start and end of the week
    const startOfWeek = today.clone().startOf('isoWeek'); // Monday as the start of the week
    const endOfWeek = today.clone().endOf('isoWeek'); // Sunday as the end of the week

    const invoices = await invoice.aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$total' },
          todayRevenue: {
            $sum: {
              $cond: [{ $gte: ['$createdAt', startOfToday.toDate()] }, '$total', 0],
            },
          },
          weeklyRevenue: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $gte: ['$createdAt', startOfWeek.toDate()] },
                    { $lt: ['$createdAt', endOfWeek.toDate()] },
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
                    { $gte: ['$createdAt', startOfMonth.toDate()] },
                    { $lt: ['$createdAt', endOfMonth.toDate()] },
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

    const totalRevenue = invoices[0]?.totalRevenue || 0;
    const todayRevenue = invoices[0]?.todayRevenue || 0;
    const weeklyRevenue = invoices[0]?.weeklyRevenue || 0;
    const monthlyRevenue = invoices[0]?.monthlyRevenue || 0;

    const selectedMonth = month ? moment.tz(`${month}-01`, 'Asia/Ho_Chi_Minh') : startOfMonth;
    const chartData = [];

    for (let week = 1; week <= 4; week++) {
      const startOfChartWeek = selectedMonth.clone().startOf('month').add((week - 1) * 7, 'days');
      const endOfChartWeek = startOfChartWeek.clone().add(6, 'days').endOf('day');

      const weeklyChartRevenue = await invoice.aggregate([
        {
          $match: {
            createdAt: {
              $gte: startOfChartWeek.toDate(),
              $lt: endOfChartWeek.toDate(),
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
        week: `Tuần ${week}`,
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
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};