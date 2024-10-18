const neo4j = require('neo4j-driver');
const driver = neo4j.driver(
'bolt://localhost:XXXX',
neo4j.auth.basic('neo4j', '1234abcd')
);
const session = driver.session();
const createNodeQuery = `CREATE (p:Person {name: $name, age: $age}) RETURN p`;
const parameters = { name: 'John Doe', age: 30 };
session.run(createNodeQuery, parameters).then((result) => {result.records.forEach((record) => {console.log(record.get('p').properties);});}).catch((error) => console.error(error)).finally(() => {
session.close();
driver.close();
});