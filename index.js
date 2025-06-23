// server/index.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { createClient } = require('@supabase/supabase-js');

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// ✅ Configure CORS to allow only your S3 frontend
const corsOptions = {
  origin: 'http://project-node.s3-website.ap-south-1.amazonaws.com',
  methods: ['GET', 'POST', 'DELETE'],
  allowedHeaders: ['Content-Type']
};

app.use(cors(corsOptions));
app.use(express.json());

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// API to get tasks
app.get('/tasks', async (req, res) => {
  const { data, error } = await supabase
    .from('tasks')
    .select('*');

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// API to add a task
app.post('/tasks', async (req, res) => {
  const { text } = req.body;
  const { data, error } = await supabase
    .from('tasks')
    .insert([{ text, completed: false }]);

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// API to delete a task
app.delete('/tasks/:id', async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', id);

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

console.log("🚀 Auto-deploy works!");