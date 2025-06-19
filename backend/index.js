const express = require('express');
const cors = require('cors');
//const connectDB = require('./db.js');
const mongoose = require("mongoose");
mongoose.connect('mongodb://localhost:27017/mydb3');

const connection = mongoose.connection;

const app = express();
app.use(cors());
app.get('/', (req, res) => {
  res.send('Welcome to the CPE API');
});

app.get('/api/cpes', async (req, res) => {
  try {
    const CPE = connection.db.collection("CPE");
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const totalCount = await CPE.countDocuments({});
    const cpes = await CPE.find({})
      .skip(skip)
      .limit(limit)
      .toArray();

    const formatted = cpes.map((cpe1, index) => ({
      id: skip + index + 1,
      title: cpe1.title,
      cpe23_url: cpe1.cpe23_url,
      references: cpe1.references,
      deprecation_date: cpe1.deprecation_date
    }));

    res.json({
      page,
      limit,
      totalCount,
      data: formatted,
    });
  } catch (err) {
    console.error('Error fetching cpes:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// ...existing code...
app.get("/api/cpes/search", async (req, res) => {
  try {
    const CPE = connection.db.collection("CPE");
    const { cpe_title, cpe23_url, deprecation_date } = req.query;
    console.log(res2);
    const query = {};
    if (cpe_title) {
      query.title = { $regex: cpe_title, $options: "i" };
    }
    if (cpe23_url) {
      query.cpe23_url = { $regex: cpe23_url, $options: "i" };
    }
    if (deprecation_date) {

      const depDate = new Date(deprecation_date);
      query.deprecation_date = { $lt: depDate };
    }

    const results = await CPE.find(query).toArray();
    console.log("Search results:", results.length, "found");
    res.json({ count: results.length, data: results });
  } catch (err) {
    console.error("Error searching CPEs:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});
// ...existing code...

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
