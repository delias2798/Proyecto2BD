const express = require('express');
const neo4j = require('neo4j-driver');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

app.use(cors({ origin: 'http://localhost:4200' }));
app.use(express.json());

const importDir = 'C:/Users/DELIA/.Neo4jDesktop/relate-data/dbmss/dbms-4ac5dd47-a351-4527-a712-ad36668ea694/import';

const driver = neo4j.driver(
  'bolt://localhost:7687',
  neo4j.auth.basic('neo4j', '1234abcd')
);

// Function to create indexes
async function createIndexes() {
  const session = driver.session();
  const indexQueries = [
    "CREATE INDEX IF NOT EXISTS FOR (p:Proyecto) ON (p.titulo)",
    "CREATE INDEX IF NOT EXISTS FOR (e:EquipoTrabajo) ON (e.numeroMiembros)",
    "CREATE TEXT INDEX IF NOT EXISTS FOR (p:Proyecto) ON (p.titulo)",
    "CREATE TEXT INDEX IF NOT EXISTS FOR (p:Proyecto) ON (p.whatItDoes)",
    "CREATE TEXT INDEX IF NOT EXISTS FOR (t:Tecnologia) ON (t.nombreAplicacion)",
    "CREATE TEXT INDEX IF NOT EXISTS FOR (u:Ubicacion) ON (u.location)",
    "CREATE TEXT INDEX IF NOT EXISTS FOR (d:Desarrollador) ON (d.nombre)"
  ];

  try {
    for (const query of indexQueries) {
      await session.run(query);
    }
    console.log("Indexes created successfully.");
  } catch (error) {
    console.error("Error creating indexes:", error);
  } finally {
    await session.close();
  }
}

// Call the createIndexes function once when starting the server
createIndexes();

// API route to load CSV data
app.post('/api/loadCsv', async (req, res) => {
  const csvFile = path.join(importDir, 'archivo_filtrado_normalizado_final.csv');

  if (!fs.existsSync(csvFile)) {
    return res.status(404).json({ message: 'CSV file not found' });
  }

  const session = driver.session();
  const loadCsvQuery = `
    LOAD CSV WITH HEADERS FROM 'file:///archivo_filtrado_normalizado_final.csv' AS row
    MERGE (proyecto:Proyecto { 
      titulo: row.Title,  
      whatItDoes: row.\`What it Does\`, 
      builtWith: row.\`Built With\`, 
      by: row.By, 
      location: row.Location 
    }) 
    MERGE (ubicacion:Ubicacion {location: row.Location}) 
    WITH row, proyecto, ubicacion 
    UNWIND SPLIT(row.\`Built With\`, ",") AS tecnologiaNombre 
    MERGE (tecnologia:Tecnologia {nombreAplicacion: TRIM(tecnologiaNombre)}) 
    MERGE (proyecto)-[:USO_TECNOLOGIA]->(tecnologia) 

    WITH row, proyecto, ubicacion // Reutilizar el proyecto y ubicación
    UNWIND SPLIT(row.By, ",") AS desarrolladorNombre 
    MERGE (desarrollador:Desarrollador {nombreD: TRIM(desarrolladorNombre)}) 
    MERGE (equipo:EquipoTrabajo {nombre: row.By}) 
    MERGE (equipo)-[:CONFORMADO_POR]->(desarrollador)
    MERGE (desarrollador)-[:FORMA_PARTE]->(equipo)
    MERGE (proyecto)-[:CREADO_POR]->(equipo)
    MERGE (equipo)-[:CREA]->(proyecto) 
    MERGE (proyecto)-[:UBICADO_EN]->(ubicacion)
  `;

  // LOAD CSV WITH HEADERS FROM 'file:///archivo_filtrado_normalizado_final.csv' AS row 
  // MERGE (proyecto:Proyecto { 
  //     titulo: row.Title, 
  //     whatItDoes: row["What it Does"], 
  //     builtWith: row["Built With"], 
  //     by: row.By, 
  //     location: row.Location 
  // }) 
  // MERGE (ubicacion:Ubicacion {location: row.Location}) 

  // // Pasar el proyecto y ubicación a la siguiente cláusula WITH
  // WITH row, proyecto, ubicacion 

  // // Descomponer la lista de tecnologías
  // UNWIND SPLIT(row["Built With"], ",") AS tecnologiaNombre 
  // MERGE (tecnologia:Tecnologia {nombreAplicacion: TRIM(tecnologiaNombre)}) 
  // MERGE (proyecto)-[:USO_TECNOLOGIA]->(tecnologia) 

  // // Descomponer la lista de desarrolladores
  // WITH row, proyecto, ubicacion // Reutilizar el proyecto y ubicación
  // UNWIND SPLIT(row.By, ",") AS desarrolladorNombre 
  // MERGE (desarrollador:Desarrollador {nombreD: TRIM(desarrolladorNombre)}) 
  // MERGE (equipo:EquipoTrabajo {nombre: row.By}) 
  // MERGE (equipo)-[:CONFORMADO_POR]->(desarrollador)
  // MERGE (desarrollador)-[:FORMA_PARTE]->(equipo)
  // MERGE (proyecto)-[:CREADO_POR]->(equipo)
  // MERGE (equipo)-[:CREA]->(proyecto) 
  // MERGE (proyecto)-[:UBICADO_EN]->(ubicacion)

  try {
    await session.run(loadCsvQuery);
    res.json({ message: 'CSV data successfully loaded into Neo4j' });
  } catch (error) {
    console.error("Error loading CSV data:", error);
    res.status(500).json({ message: 'Error loading CSV data into Neo4j', error });
  } finally {
    await session.close();
  }
});

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

// app.get('/api/nodes', async (req, res) => {
//   const session = driver.session();
//   const getNodesQuery = `MATCH (p:Proyecto) RETURN p`;

//   try {
//     const result = await session.run(getNodesQuery);
//     const nodes = result.records.map(record => record.get('p').properties);
//     res.json(nodes); // Envia los nodos al cliente
//   } catch (error) {
//     console.error("Error fetching nodes:", error);
//     res.status(500).json({ message: 'Error fetching nodes', error });
//   } finally {
//     session.close();
//   }
// });

app.get('/api/nodes', async (req, res) => {
  const session = driver.session();
  const getGraphQuery = `
    MATCH (n)-[r]->(m)
    RETURN n, r, m
    LIMIT 50
  `;

  try {
    const result = await session.run(getGraphQuery);
    const nodes = [];
    const edges = [];

    result.records.forEach(record => {
      const startNode = record.get('n');
      const relationship = record.get('r');
      const endNode = record.get('m');

      // Añadir nodos únicos
      if (!nodes.some(node => node.id === startNode.identity.toString())) {
        nodes.push({
          id: startNode.identity.toString(),
          label: startNode.labels[0],
          properties: startNode.properties
        });
      }
      if (!nodes.some(node => node.id === endNode.identity.toString())) {
        nodes.push({
          id: endNode.identity.toString(),
          label: endNode.labels[0],
          properties: endNode.properties
        });
      }

      // Añadir relación
      edges.push({
        from: startNode.identity.toString(),
        to: endNode.identity.toString(),
        label: relationship.type
      });
    });

    res.json({ nodes, edges });
  } catch (error) {
    console.error("Error fetching graph data:", error);
    res.status(500).json({ message: 'Error fetching graph data', error });
  } finally {
    session.close();
  }
});

const session = driver.session();

// Obtener todos los nodos de un tipo específico
app.get('/api/nodes/:type', async (req, res) => {
  const { type } = req.params;
  try {
    const result = await session.run(`MATCH (n:${type}) RETURN n`);
    const nodes = result.records.map(record => record.get('n').properties);
    res.json(nodes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching nodes' });
  }
});

// Obtener un nodo específico por su ID y tipo
app.get('/api/node/:type/:id', async (req, res) => {
  const { type, id } = req.params;
  try {
    const result = await session.run(`MATCH (n:${type} {id: $id}) RETURN n`, { id });
    const node = result.records[0]?.get('n').properties;
    if (node) {
      res.json(node);
    } else {
      res.status(404).json({ error: 'Node not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching node' });
  }
});

// Crear un nuevo nodo de un tipo específico
app.post('/api/node/:type', async (req, res) => {
  const { type } = req.params;
  const properties = req.body;
  try {
    const result = await session.run(
      `CREATE (n:${type} $properties) RETURN n`,
      { properties }
    );
    const node = result.records[0].get('n').properties;
    res.status(201).json(node);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error creating node' });
  }
});

// Actualizar un nodo específico por su ID y tipo
app.put('/api/node/:type/:id', async (req, res) => {
  const { type, id } = req.params;
  const properties = req.body;
  const setString = Object.keys(properties)
    .map(key => `n.${key} = $${key}`)
    .join(', ');

  try {
    const result = await session.run(
      `MATCH (n:${type} {id: $id}) SET ${setString} RETURN n`,
      { id, ...properties }
    );
    const node = result.records[0]?.get('n').properties;
    if (node) {
      res.json(node);
    } else {
      res.status(404).json({ error: 'Node not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error updating node' });
  }
});

// Eliminar un nodo específico por su ID y tipo (si no tiene relaciones)
app.delete('/api/node/:type/:id', async (req, res) => {
  const { type, id } = req.params;
  try {
    const result = await session.run(
      `MATCH (n:${type} {id: $id}) 
       WITH n, size((n)--()) AS relCount
       WHERE relCount = 0 
       DELETE n RETURN n`,
      { id }
    );
    if (result.records.length > 0) {
      res.json({ message: 'Node deleted' });
    } else {
      res.status(404).json({ error: 'Node not found or has relationships' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error deleting node' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
