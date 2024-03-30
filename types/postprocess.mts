import { readFileSync, writeFileSync } from 'fs';

// get file path from argument
const filePath = process.argv[2];

let file = readFileSync(filePath, 'utf-8');

file = `declare global {
${file.replace(/^export default /gm, 'export ')}
}
export {};
`;

writeFileSync(filePath, file.replace(/\r\n/g, '\n'));

export {};
