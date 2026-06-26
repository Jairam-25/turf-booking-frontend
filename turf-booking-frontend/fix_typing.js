const fs = require('fs');

let c = fs.readFileSync('src/styles.css', 'utf8');

const regex = /\.typing-container \{\s*overflow: hidden;\s*white-space: nowrap;\s*border-right: 3px solid #38bdf8;\s*animation: typing 1\.5s steps\(30, end\), blink-caret \.75s step-end infinite;\s*margin: 0 auto;\s*\}\s*@keyframes typing \{\s*from \{ width: 0 \}\s*to \{ width: 100% \}\s*\}\s*@keyframes blink-caret \{\s*from, to \{ border-color: transparent \}\s*50% \{ border-color: #38bdf8; \}\s*\}/;

const replacement = `.typing-container {
  overflow: hidden;
  white-space: nowrap;
  border-right: 3px solid #38bdf8;
  animation: typing 1.5s steps(20, end) forwards, blink-caret .75s step-end infinite;
  margin: 0 auto;
  display: inline-block;
  max-width: 0;
  width: fit-content;
}
@keyframes typing {
  from { max-width: 0; }
  to { max-width: 100vw; }
}
@keyframes blink-caret {
  from, to { border-color: transparent }
  50% { border-color: #38bdf8; }
}`;

c = c.replace(regex, replacement);
fs.writeFileSync('src/styles.css', c, 'utf8');
