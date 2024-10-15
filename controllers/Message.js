const Message = require("../models/Messages");
const User = require("../models/User");
const Announcement = require("../models/Announcement");

exports.getMessages = async (req, res) => {
  //console.log(req.body);

  try {
    const messages = await Message.find({
      user1Id: req.auth.userId,
      user2Id: req.body.user2,
    })
      .sort({ date: -1 })
      .skip(req.body.startAt)
      .limit(10);

    const user = await User.findOne({ _id: req.body.user2 });

    const count = await Announcement.countDocuments({
      userId: req.body.user2,
      active: true,
    });

    res
      .status(200)
      .json({
        status: 0,
        messages,
        user,
        startAt:
          messages.length === 10 ? parseInt(req.body.startAt) + 10 : null,
        count,
      });
  } catch (e) {
    console.log(e);
    res.status(505).json({ e });
  }
};

exports.getMessagesById = async (req, res) => {
  //console.log(req.body);

  try {
    // Étape 1 : Récupérer les messages
    const messages = await Message.find({ user1Id: req.auth.userId })
      .sort({ date: -1 })
      .skip(req.body.startAt)
      .limit(10);

    // Étape 2 : Extraire les identifiants user2Id des messages sans doublon
    const user2Ids = [...new Set(messages.map((message) => message.user2Id))];

    // Étape 3 : Rechercher les utilisateurs correspondants
    const users = await User.find({ _id: { $in: user2Ids } });

    //const count = await Announcement.countDocuments({userId: req.body.user2, active: true})

    res.status(200).json({ messages, user2Ids, users, status: 0});

    //res.status(200).json({status: 0, messages, user, startAt: messages.length === 10 ? parseInt(req.body.startAt) + 10 : null, count})
  } catch (e) {
    console.log(e);
    res.status(505).json({ e });
  }
};

exports.addMessage = async (req, res) => {
  console.log(req.body);
  const newMessage = new Message({
    date: new Date(),
    text: req.body.text,
    user1Id: req.auth.userId,
    user2Id: req.body._id,
  });

  try {
    await newMessage.save();

    const messages = await Message.find({
      user1Id: req.auth.userId,
      user2Id: req.body._id,
    })
      .sort({ date: -1 })
      .skip(req.body.startAt)
      .limit(10);

    res
      .status(200)
      .json({
        status: 0,
        messages,
        startAt:
          messages.length === 10 ? parseInt(req.body.startAt) + 10 : null,
      });
  } catch (e) {
    console.log(e);
    res.status(505).json({ e });
  }
};
