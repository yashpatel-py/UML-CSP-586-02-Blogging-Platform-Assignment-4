const express = require('express');
const bodyParser = require('body-parser');
const { Client } = require('@elastic/elasticsearch');
const cors = require('cors');

const app = express();
// Increase the limit if needed
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
const port = 3001; // Ensure this port is different from your React app's port

// Replace with your Elasticsearch configuration
const esClient = new Client({ node: 'http://localhost:9200' });

app.use(cors());
app.use(bodyParser.json());

// Route to handle post creation
app.post('/api/posts', async (req, res) => {
  try {
    const { id, title, content, author, category, imageUrl } = req.body;
    // Perform validation or transformation as needed
    const doc = {
      id,
      title,
      content,
      author,
      category,
      imageUrl,
      createdAt: new Date().toISOString(),
    };

    // Index document into Elasticsearch
    const esResponse = await esClient.index({
      index: 'blogposts',
      body: doc,
    });

    await esClient.indices.refresh({ index: 'blogposts' });

    res.status(200).json({ message: 'Post created successfully', esResponse });
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ message: 'Error creating post', error: error.message });
  }
});

// Blog Headers
app.post('/api/sections', async (req, res) => {
  try {
    const { sections } = req.body;
    const promises = sections.map((section) =>
      esClient.index({
        index: 'blogsections',
        body: section,
      })
    );

    await Promise.all(promises);

    await esClient.indices.refresh({ index: 'blogsections' });

    res.status(200).json({ message: 'Sections created successfully' });
  } catch (error) {
    console.error('Error creating sections:', error);
    res.status(500).json({ message: 'Error creating sections', error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
