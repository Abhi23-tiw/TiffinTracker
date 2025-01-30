const express = require('express');
const { requireSingIn } = require('../controllers/userControllers');
const { createTiffinController, getTiffinController, getTiffinsByDate, getTotalTiffinsByMonth } = require('../controllers/tiffinControllers');
// router object 
const router = express.Router()

// create tiffin  || POST
router.post('/create-tiffin', createTiffinController)
// get tiffin || GET
router.get("/get-tiffin", getTiffinController);
// total tiffin || GET 
router.get('/total-tiffins', getTotalTiffinsByMonth);
// get tiffin for a specific date
router.get('/tiffins-by-date' , getTiffinsByDate)
// export
module.exports  = router;