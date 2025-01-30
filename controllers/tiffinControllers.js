const { default: mongoose } = require("mongoose");
const tiffinModel = require("../models/tiffinModel");
const userModel = require("../models/userModel");
const moment = require('moment');

const createTiffinController = async (req, res) => {
  try {
    const { tiffins, date, email } = req.body;

    if (tiffins === undefined || !date || !email) {
      return res.status(400).send({
        success: false,
        message: 'Please provide tiffins, date, and email fields.',
      });
    }

    const tiffinsCount = Number(tiffins);

    if (isNaN(tiffinsCount) || tiffinsCount < 0) {
      return res.status(400).send({
        success: false,
        message: 'Tiffins must be a non-negative number.',
      });
    }

    const formattedDate = new Date(date);
    if (isNaN(formattedDate.getTime())) {
      return res.status(400).send({
        success: false,
        message: 'Please provide a valid date.',
      });
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: 'User not found.',
      });
    }

    const tiffin = await tiffinModel.findOneAndUpdate(
      { date: formattedDate, updatedBy: user._id }, 
      { tiffins: tiffinsCount, date: formattedDate, updatedBy: user._id }, 
      { upsert: true, new: true, runValidators: true } 
    );

    return res.status(201).send({
      success: true,
      message: 'Tiffins created/updated successfully.',
      tiffin,
    });
  } catch (error) {
    console.error('Error in createTiffinController:', error);
    return res.status(500).send({
      success: false,
      message: 'Error in creating/updating tiffin.',
      error: error.message,
    });
  }
};


const getTiffinController = async (req, res) => {
  try {
    const { date, email } = req.query;

    
    if (!date || !email) {
      return res.status(400).send({
        success: false,
        message: "Please provide both date and email fields.",
      });
    }

    const formattedDate = new Date(date);
    if (isNaN(formattedDate.getTime())) {
      return res.status(400).send({
        success: false,
        message: "Invalid date format.",
      });
    }

    
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found.",
      });
    }

    
    const tiffin = await tiffinModel.findOne({
      date: formattedDate.toISOString(),
      updatedBy: user._id, 
    });

    if (!tiffin) {
      return res.status(404).send({
        success: false,
        message: "No tiffin record found for the specified date.",
      });
    }

    
    return res.status(200).send({
      success: true,
      message: "Tiffin record retrieved successfully.",
      tiffin,
    });
  } catch (error) {
    console.error("Error in getTiffinController:", error);
    return res.status(500).send({
      success: false,
      message: "Error retrieving tiffin record.",
      error: error.message,
    });
  }
};


const getTiffinsByDate = async (req, res) => {
  try {
    const { date, email } = req.query;

    if (!date || !email) {
      return res.status(400).json({ success: false, message: 'Date and email are required' });
    }

    if (!moment(date, 'YYYY-MM-DD', true).isValid()) {
      return res.status(400).json({ success: false, message: 'Invalid date format. Use YYYY-MM-DD' });
    }
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const startOfDay = moment(date).startOf('day').toDate();
    const endOfDay = moment(date).endOf('day').toDate();

    const tiffin = await tiffinModel.findOne({
      updatedBy: user._id,
      date: { $gte: startOfDay, $lte: endOfDay },
    });

    if (!tiffin) {
      return res.status(404).json({ success: false, message: 'No tiffin data found for this date' });
    }

    res.status(200).json({ success: true, data: { tiffins: tiffin.tiffins } });
  } catch (error) {
    console.error('Error fetching tiffin data:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

const getTotalTiffinsByMonth = async (req, res) => {
  try {
      const { email, month, year } = req.query;

      if (!email || !month || !year) {
          return res.status(400).json({ error: "Email, month, and year are required" });
      }

      
      const user = await userModel.findOne({ email });
      if (!user) {
          return res.status(404).json({ error: "User not found" });
      }

      const formattedMonth = String(month).padStart(2, "0");

      const startDate = new Date(`${year}-${formattedMonth}-01T00:00:00.000Z`);
      const endDate = new Date(startDate);
      endDate.setUTCMonth(endDate.getUTCMonth() + 1); 
      
      const totalTiffins = await tiffinModel.aggregate([
          {
              $match: {
                  updatedBy: new mongoose.Types.ObjectId(user._id), 
                  date: { $gte: startDate, $lt: endDate }
              }
          },
          {
              $group: {
                  _id: null,
                  totalTiffins: { $sum: "$tiffins" } 
              }
          }
      ]);

      res.json({
          email,
          month: formattedMonth,
          year,
          totalTiffins: totalTiffins.length ? totalTiffins[0].totalTiffins : 0
      });

  } catch (error) {
      res.status(500).json({ error: error.message });
  }
};


module.exports = { createTiffinController, getTiffinController, getTotalTiffinsByMonth, getTiffinsByDate };
