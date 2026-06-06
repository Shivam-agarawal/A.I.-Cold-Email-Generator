const express = require("express");
const cors = require("cors");
const app = express();
const authRoutes = require('.routes/authRoutes');
const aiRoutes = require('.routes/aiRoutes');
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('api/auth', authRoutes);
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
