const Orders = require('../../api/v1/orders/model');

const getAllOrders = async (req) => {
  const { limit = 10, page = 1, startDate, endDate } = req.query;
  let condition = {};

  if (startDate && endDate) {
    const start = new Date(startDate);
    start.setHours(0, 0, 0);
    const end = new Date(startDate);
    end.setHours(0, 0, 0);
    condition = {
      ...condition,
      date: {
        $gte: start,
        $lt: end,
      },
    };
  }

  const result = await Orders.find(condition)
    .limit(limit)
    .skip(limit * (page - 1));

  const count = await Orders.coundDocuments(condition);

  return {
    data: result,
    // ceil untuk membulatkan ke atas.
    pages: Math.ceil(count / limit),
    total: count,
  };
};

module.exports = {
  getAllOrders,
};
