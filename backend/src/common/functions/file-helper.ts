export function fileParser(file: string) {
  const fs = require('fs');
  const data = fs.readFileSync(file);
  const res = data.toString().split('\n').length - 3;
  console.log(res);
}
