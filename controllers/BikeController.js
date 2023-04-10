
const Bike = require('../models/bike')

const getPagination = (page, size) => {
    const limit = size ? +size : 3;
    const offset = page ? page * limit : 0;
  
    return { limit, offset };
  };

exports.getAllBikes = async (req, res) => {
    try {
        const bikes_may = await Bike.find()
        // console.log('response', bikes_may)
    } catch (err) {
        console.log(err)
    }
};

