const express = require("express");
const { Expo } = require("expo-server-sdk");
const User = require("../models/userModel"); // Import User model
const userModel = require("../models/userModel");
const router = express.Router();
const cron = require("node-cron");
const expo = new Expo();



router.post("/save-token", async (req, res) => {
  const { email, token } = req.body;

  if (!Expo.isExpoPushToken(token)) {
    return res.status(400).json({ error: "Invalid Expo push token" });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    
    user.pushToken = token;
    await user.save();

    res.status(200).json({ message: "Push token saved successfully" });
  } catch (error) {
    console.error("Error saving token:", error);
    res.status(500).json({ error: "Failed to save token" });
  }
});

const custommsg = {
  "Sun": {
    "lunch": "Default",
    "dinner": "Chhole Bhature 😍"
  },
  "Mon": {
    "lunch": "Default",
    "dinner": "Default"
  },
  "Tue": {
    "lunch": "Default",
    "dinner": "Paneer 😍, Par ye to Aunty ka panner hai 😒"
  },
  "Wed": {
    "lunch": "Kadhi, Chawal khana hai kya aaj? 🤔",
    "dinner": "Kheer - Poori 🙂 kahaya jaa sakta hai "
  },
  "Thu": {
    "lunch": "Default",
    "dinner": "Aaj to Rajma Chawal 😒 hai"
  },
  "Fri": {
    "lunch": "Default",
    "dinner": "Default"
  },
  "Sat": {
    "lunch": "Default",
    "dinner": "Paneer 😍 , Par ye to Aunty ka panner hai 😒"
  }
};

const customMessages = {
  "lunch": [
    "Hope you're hungry! 🍴",
    "What's cooking for lunch? 😋",
    "Lunchtime already! 🕒",
    "Tasty lunch waiting for you! 🍽️",
    "Lunch break! Time to recharge! 🥪",
    "Delicious lunch ahead! 🤩",
    "Grab a bite and power up! 💪",
    "Lunchtime joy is here! 🌞",
    "Don't skip lunch today, it's too good! 😄",
    "What’s your lunch mood today? 🍴",
    "Mouth-watering lunch ready for you! 😍",
    "Lunch hour vibes are the best! 🕛",
    "Fill up your plate with goodness! 🍲",
    "Feeling hungry? Lunch is served! 🍛",
    "Let's make this lunch unforgettable! 🌟",
    "Lunch: the most important meal of the day! 🍽️",
    "Treat yourself to a hearty lunch! 🥗",
    "Lunchtime = happiness time! 😊",
    "Bon appétit! Time for lunch! 🍝",
    "Enjoy your break with a delicious lunch! 🥪"
  ],
  "dinner": [
    "Dinner time! Enjoy! 🍛",
    "Ready for a delicious dinner? 🍴",
    "What’s for dinner tonight? 🍲",
    "Dinner’s served! 😄",
    "Treat yourself to a lovely dinner! 🍽️",
    "Let’s end the day with a satisfying dinner! 🍛",
    "Don’t miss out on a scrumptious dinner! 🍴",
    "Dinner is calling your name! 🥘",
    "A delightful dinner awaits you! 😋",
    "Savor the flavors of tonight's dinner! 🍝",
    "Wrap up your day with a perfect dinner! 🥗",
    "Dinner’s ready, and it’s going to be amazing! 🍲",
    "Can’t wait to dig into this dinner! 🍛",
    "End your day with a full stomach and happy heart! 😄",
    "Time for a delicious dinner to relax! 🍴",
    "A satisfying dinner is just what you need now! 🥘",
    "Dinner time: Eat, relax, repeat! 🍽️",
    "Delicious flavors await you at dinner tonight! 🥗",
    "Dinner is the highlight of your day! 🍲",
    "Time to refuel with a yummy dinner! 🍛"
  ]
};


const getMessageForTime = () => {
  const currentTime = new Date();
  const currentHour = currentTime.getHours();
  const currentDayIndex = currentTime.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const currentDayName = daysOfWeek[currentDayIndex];

  let messageBody;
  if (currentHour >= 3 && currentHour < 15) {
    
    if (custommsg[currentDayName]?.lunch === "Default") {
      messageBody = "Wahi purana boring khaana hai aaj bhi 🙄";
    } else {
      
      const randomMessage = customMessages.lunch[Math.floor(Math.random() * customMessages.lunch.length)];
      messageBody = `${randomMessage} Enjoy your lunch!`;
    }
  } else {
    // Dinnertime
    if (custommsg[currentDayName]?.dinner === "Default") {
      messageBody = "Wahi purana boring khaana hai aaj bhi 🙄";
    } else {
      
      const randomMessage = customMessages.dinner[Math.floor(Math.random() * customMessages.dinner.length)];
      messageBody = `${randomMessage} ${custommsg[currentDayName]?.dinner}`;
    }
  }
  return messageBody;
};

cron.schedule("9  0 * * *", async () => {
  const body = getMessageForTime();

  await sendNotifications("Good Night 🌄 ", body);
});

cron.schedule("0 15 * * *", async () => {
  const body = getMessageForTime();

  await sendNotifications("Good Afternoon 🌞", body);
});

cron.schedule("26 20 * * *", async () => {
  const body = getMessageForTime();

  await sendNotifications("Have you updated your tiffin count? 😊");
});


const sendNotifications = async (title, body) => {
  try {
    const users = await User.find({ pushToken: { $exists: true } });

    const messages = users.map((user) => ({
      to: user.pushToken,
      sound: "default",
      title,
      body,
    }));

    const chunks = expo.chunkPushNotifications(messages);
    const tickets = [];
    for (const chunk of chunks) {
      try {
        const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
        tickets.push(...ticketChunk);
      } catch (error) {
        console.error("Error sending notification chunk:", error);
      }
    }

  } catch (error) {
    console.error("Error sending notifications:", error);
  }
};


router.post("/remove-token", async (req, res) => {
  const { email } = req.body;
  try {
    const result = await userModel.findOneAndUpdate(
      { email: email }, 
      { $unset: { pushToken: "" } },
      { new: true } 
    );

    if (!result) {
      return res.status(404).send({ message: "No user found with that email." });
    }

    return res.status(200).send({ message: "Push token removed successfully." });
  } catch (error) {
    console.error("Error removing push token:", error);
    return res.status(500).send({ message: "Failed to remove push token." });
  }
});


module.exports = router;
