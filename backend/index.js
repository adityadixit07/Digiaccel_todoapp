const express = require("express");
const path = require("path");
const cors = require("cors");
const todoRoutes = require("./routes/todoRoutes");

const app = express();

// Serve static files from the frontend/dist folder
app.use(express.static(path.join(__dirname, "../frontend/dist")));

// Serve the index.html file on the root route
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});

// Define the port for your server
const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: ["http://localhost:3000", "*"],
    credentials: true,
  })
);

app.use("/api.todo", todoRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
