const fs = require('fs');

let c = fs.readFileSync('src/styles.css', 'utf8');

const regex = /\.typing-container \{\s*overflow: hidden;\s*white-space: nowrap;\s*border-right: 3px solid #38bdf8;\s*animation: typing 1\.8s steps\(12, end\) forwards, blink-caret \.75s step-end infinite;\s*margin: 0 auto;\s*display: inline-block;\s*width: 0;\s*\}\s*@keyframes typing \{\s*from \{ width: 0; \}\s*to \{ width: 9\.8ch; \}\s*\}/;

const replacement = `.typing-container {
  overflow: hidden;
  white-space: nowrap;
  border-right: 3px solid #38bdf8;
  animation: typing 1.8s steps(10, end) forwards, blink-caret .75s step-end infinite;
  margin: 0 auto;
  display: inline-block;
  max-width: 0;
  width: fit-content;
}
@keyframes typing {
  from { max-width: 0; }
  to { max-width: 210px; }
}`;

c = c.replace(regex, replacement);
fs.writeFileSync('src/styles.css', c, 'utf8');
console.log('Fixed typing width');
