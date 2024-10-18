const express = require('express');
const neo4j = require('neo4j-driver');
const cors = require('cors'); // Import the CORS middleware

const app = express();
const port = 3000; // Use any available port

// Enable CORS to allow requests from the Angular frontend
app.use(cors({
  origin: 'http://localhost:4200' // Allow requests from your Angular app
}));

// Middleware to parse JSON request bodies
app.use(express.json());

// Neo4j connection setup
const driver = neo4j.driver(
  'bolt://localhost:7687', // Replace with the correct port for Neo4j
  neo4j.auth.basic('neo4j', '1234abcd') // Replace with your actual credentials
);

// API route to create a Neo4j node
app.post('/api/createNode', async (req, res) => {
  const session = driver.session();
  const { name, age } = req.body; // Extract name and age from the request body

  const createNodeQuery = `CREATE (p:Person {name: $name, age: $age}) RETURN p`;
  const parameters = { name, age };

  try {
    const result = await session.run(createNodeQuery, parameters);
    const node = result.records[0].get('p').properties; // Get created node properties
    res.json(node); // Send node data back to the client
  } catch (error) {
    console.error(error);
    res.status(500).send('Error creating node'); // Send error response
  } finally {
    session.close(); // Ensure the session is closed
  }
});

// Start the Express server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
