const mongoose = require('mongoose');

const tiffinSchema = new mongoose.Schema(
  {
    tiffins: {
      type: Number,
      required: [true, 'Please add the number of tiffins'],
      min: [0, 'Tiffins must be at least 0']
    },
    date: {
      type: Date,
      required: [true, 'Please add a valid date']
    },
    updatedBy: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true
    }
  },
  { timestamps: true }
);

tiffinSchema.index({ date: 1, updatedBy: 1 }, { unique: true });

module.exports = mongoose.model('Tiffin', tiffinSchema);
