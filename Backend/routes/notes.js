const express = require("express");
const router = express.Router();
const Notes = require("../models/Notes");
var fetchuser = require("../middleware/fetchuser");
const { body, validationResult } = require("express-validator");
const { getByTitle } = require("@testing-library/react");
const mongoose = require("mongoose");
const moment = require('moment');


async function getTotalNotesForUser(user) {
  try {
    const totalNotes = await Notes.countDocuments({ user });

    return totalNotes;
  } catch (error) {
    console.error('Error retrieving notes:', error);
    throw error;
  }
}

async function getTotalUniqueDatesForUser(userId) {
  try {
    const pipeline = [
      // Match documents for the specific user
      {
        $match: { user: mongoose.Types.ObjectId(userId) }
      },
      // Group documents by the 'date' field and count the occurrences
      {
        $group: {
          _id: "$date",
          count: { $sum: 1 }
        }
      },
      // Count the total number of unique dates
      {
        $group: {
          _id: null,
          totalUniqueDates: { $sum: 1 }
        }
      }
    ];

    const result = await Notes.aggregate(pipeline).exec();

    if (result.length > 0) {
      return result[0].totalUniqueDates;
    } else {
      // If the user has no notes or no unique dates, return 0
      return 0;
    }
  } catch (error) {
    // Handle any errors that might occur during the database query
    console.error('Error retrieving unique dates:', error);
    throw error;
  }
}



async function getTotalImagesForUser(userId) {
  try {
    const pipeline = [
      // Match documents for the specific user
      {
        $match: { user: mongoose.Types.ObjectId(userId) }
      },
      // Project only the 'image' field to work with
      {
        $project: {
          _id: 0,
          image: 1
        }
      },
      // Unwind the 'image' array to transform it into separate documents
      {
        $unwind: "$image"
      },
      // Group all documents back and count the total number of images
      {
        $group: {
          _id: null,
          totalImages: { $sum: 1 }
        }
      }
    ];

    const result = await Notes.aggregate(pipeline).exec();

    if (result.length > 0) {
      return result[0].totalImages;
    } else {
      // If the user has no notes or no images, return 0
      return 0;
    }
  } catch (error) {
    // Handle any errors that might occur during the database query
    console.error('Error retrieving images:', error);
    throw error;
  }
}


router.post("/fetchallnotes", fetchuser, async (req, res) => {
  try {
    const notes = await Notes.find({ user: req.user.id, date: req.body.date, tag: { $ne: "DIARY" } });
    res.json(notes);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

router.post("/fetchDiary", fetchuser, async (req, res) => {
  try {
    const note = await Notes.findOne({ user: req.user.id, date: req.body.date, tag:"DIARY" });
    res.json(note);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

router.put("/updateDiary", fetchuser, async (req, res) => {
  try {

    const {description, image, date } = req.body;

    const newnote = {};

    newnote.title = "DIARY";
    newnote.tag = "DIARY";
    newnote.date = date;
    newnote.description = description;

    if(image.length>0){
      newnote.image = image;
    }

    let note = await Notes.findOne({ user: req.user.id, date: req.body.date, tag:"DIARY" });

    if(!note){

       let note = new Notes({
        title: newnote.title,
        description: newnote.description,
        tag: "DIARY", 
        user: req.user.id,
        image: newnote.image,
        date: newnote.date
      });

      const savedNote = await note.save();

      res.json(savedNote);

    }
    else{
      if (note && note.user.toString() !== req.user.id) {
        return res.status(401).send("Not Allowed");
      }

      note = await Notes.findOneAndUpdate(
        { user: req.user.id, date: req.body.date, tag:"DIARY" },
        { $set: newnote },
        { new: true }
      );
      res.json(note);
    }

    
    
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});


router.post("/fetchnote", fetchuser, async (req, res) => {
  try {
    const note = await Notes.findById(req.body.id);
    res.json(note);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

router.post("/getAllNotes", fetchuser, async (req, res) => {
  try {
    // const tagsArray = ['note', 'Casual'];
    let notes;
    if(req.body.tags.length==0){
      notes = await Notes.find({ user: req.user.id, tag: { $ne: "DIARY" } }).sort({ date: -1 });
      res.json(notes);
    }
    else{
      tagnotes = await Notes.find({ user: req.user.id, tag: { $in: req.body.tags } }).sort({ date: -1 });
      res.json(tagnotes);
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/getTags", fetchuser, async (req, res) => {
  try {
    const allNotes = await Notes.find({ user: req.user.id });
    const allTags = allNotes.map(note => note.tag);
    const flattenedTags = allTags.flat();
    const uniqueTags = [...new Set(flattenedTags)];
    const filteredTags = uniqueTags.filter(tag => tag !== "DIARY");
    const tagsArray = filteredTags.map(tag => ({ value: tag, label: tag }));

    res.json(tagsArray);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

router.post("/fetchSharedNotes", fetchuser, async (req, res) => {
  try {
    const notes = await Notes.find({ shared: { $elemMatch: { value: req.user.id } } }).populate('user', 'email name',);
    res.json(notes);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

router.post("/addnote", fetchuser,[
    body("title", "Title Must be Atleast 3 Characters").isLength({ min: 3 }),
    body("description", "Description Must be Atleast 5 Characters").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      var currentDate = new Date();
      var day = String(currentDate.getDate()).padStart(2, "0");
      var month = String(currentDate.getMonth() + 1).padStart(2, "0");
      var year = currentDate.getFullYear();

      var formattedDate = `${day}/${month}/${year}`;

      const { title, description, tag, image } = req.body;

      const note = new Notes({
        title,
        description,
        tag, 
        user: req.user.id,
        image,
        date: formattedDate
      });

      const savedNote = await note.save();

      res.json(savedNote);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Some error Occured");
    }
  }
);

router.put("/updatenote/:id", fetchuser, async (req, res) => {
  try {
    const { title, description, tag, shared } = req.body;

    const newnote = {};
    if (title) {
      newnote.title = title;
    }
    if (description) {
      newnote.description = description;
    }
    if (tag) {
      newnote.tag = tag;
    }
    if(shared.length !== 0){
      newnote.shared = shared;
    }

    let note = await Notes.findById(req.params.id);
    if (!note) {
      return res.status(404).send("Not Found");
    }
    if (note.user.toString() !== req.user.id) {
      return res.status(401).send("Not Allowed");
    }

    note = await Notes.findByIdAndUpdate(
      req.params.id,
      { $set: newnote },
      { new: true }
    );

    res.json(note);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Some error Occured");
  }
});

router.delete("/deletenote/:id", fetchuser, async (req, res) => {
  try {
    let note = await Notes.findById(req.params.id);
    if (!note) {
      return res.status(404).send("Not Found");
    }
    if (note.user.toString() !== req.user.id) {
      return res.status(401).send("Not Allowed");
    }

    note = await Notes.findByIdAndDelete(req.params.id);

    res.json({ Success: "Note deleted", Note: note });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Some error Occured");
  }
});

router.post("/tagsData", fetchuser, async (req, res) => {
  try {
    
    let user;
    if(req.body.userid.length!=0){
      user = req.body.userid;
    }
    else{
      user = req.user.id;
    }
    const pipeline = [
      {
        $match: {
          user: mongoose.Types.ObjectId(user)
        }
      },
      {
        $group: {
          _id: "$tag",
          count: { $sum: 1 }
        }
      },
      {
        $match: {
          count: { $gt: 0 }
        }
      },
      {
        $project: {
          _id: 0,
          tag: "$_id",
          count: 1
        }
      }
    ];

    const tagCounts = await Notes.aggregate(pipeline);

    const data = tagCounts.map((entry) => ({
      name: entry.tag,
      value: entry.count,
    }));

    res.json(data);
    
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Some error Occured");
  }
});

router.post("/datesData", fetchuser, async (req, res) => {
  try {
    const startMoment = moment(`${req.body.year}-${req.body.month}-01`);
    const endMoment = moment(`${req.body.year}-${req.body.month}-30`);

    let user;
    if(req.body.userid.length!=0){
      user = req.body.userid;
    }
    else{
      user = req.user.id;
    }

    // Generate an array of dates within the specified range
    const dateRange = [];
    while (startMoment.isSameOrBefore(endMoment, 'day')) {
      dateRange.push(startMoment.format('DD/MM/YYYY'));
      startMoment.add(1, 'day');
    }

    const pipeline = [
      {
        $match: {
          user: mongoose.Types.ObjectId(user), // Convert req.user.id to ObjectId for matching
          date: { $gte: `01/${req.body.month}/${req.body.year}`, $lte: `30/${req.body.month}/${req.body.year}` } // Date strings in the correct format
        }
      },
      {
        $group: {
          _id: "$date",
          count: { $sum: 1 }
        }
      },
      {
        $sort: {
          _id: 1 // Sort the result by date in ascending order
        }
      },
      {
        $project: {
          _id: 0,
          date: "$_id",
          count: 1,
          // user: 0
        }
      }
    ];

    const notesCountByDate = await Notes.aggregate(pipeline);

    // Create a map of dates with counts for faster lookup
    const dateCountMap = new Map();
    for (const entry of notesCountByDate) {
      dateCountMap.set(entry.date, entry.count);
    }

    // Create the final result with count as 0 for dates with no notes
    const result = dateRange.map(date => ({
      name: date.substr(0,2),
      Notes: dateCountMap.get(date) || 0
    }));

    res.json(result);

  } catch (error) {
    console.error(error.message);
    res.status(500).send("Some error Occured");
  }
});

router.post('/getstats', fetchuser, async(req,res)=>{
    
  try {
    let user;
    if(req.body.userid.length!=0){
      user = req.body.userid;
    }
    else{
      user = req.user.id;
    }
    
    const totalNotes = await getTotalNotesForUser(user);
    const totalImages = await getTotalImagesForUser(user);
    const totalUniqueDates = await getTotalUniqueDatesForUser(user);
    res.json({totalNotes, totalImages, totalUniqueDates})
    

  } catch (error) {
      res.status(400).json({ error: "Invalid Details", error })
  }
});

module.exports = router;
