import fs from 'fs';
import http from 'http';

const url = 'http://localhost:8787/doc';
const outputPath = './cite-met-app-frontend/openapi.yml';

http.get(url, (res) => {
  let data = '';
  res.on('data', chunk => { data += chunk; });
  res.on('end', () => {
    fs.writeFileSync(outputPath, data, 'utf8');
    console.log(`OpenAPI spec written to ${outputPath}`);
  });
}).on('error', (err) => {
  console.error('Error fetching OpenAPI spec:', err.message);
});
