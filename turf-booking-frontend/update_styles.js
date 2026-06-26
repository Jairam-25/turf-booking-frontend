const fs = require('fs');

let c = fs.readFileSync('src/styles.css', 'utf8');

const regex = /\.typing-container \{\s*overflow: hidden;\s*white-space: nowrap;\s*border-right: 3px solid #38bdf8;\s*animation: typing 1\.5s steps\(20, end\) forwards, blink-caret \.75s step-end infinite;\s*margin: 0 auto;\s*display: inline-block;\s*max-width: 0;\s*width: fit-content;\s*\}\s*@keyframes typing \{\s*from \{ max-width: 0; \}\s*to \{ max-width: 100vw; \}\s*\}\s*@keyframes blink-caret \{\s*from, to \{ border-color: transparent \}\s*50% \{ border-color: #38bdf8; \}\s*\}/;

const replacement = `.typing-container {
  overflow: hidden;
  white-space: nowrap;
  border-right: 3px solid #38bdf8;
  animation: typing 1.8s steps(12, end) forwards, blink-caret .75s step-end infinite;
  margin: 0 auto;
  display: inline-block;
  width: 0;
}
@keyframes typing {
  from { width: 0; }
  to { width: 9.8ch; }
}
@keyframes blink-caret {
  from, to { border-color: transparent }
  50% { border-color: #38bdf8; }
}

/* Background Bubbles */
.bubbles-container {
  overflow: hidden;
}
.bubble {
  position: absolute;
  bottom: -100px;
  background: radial-gradient(circle at 30% 30%, rgba(123, 57, 252, 0.4), rgba(56, 189, 248, 0.1));
  border-radius: 50%;
  animation: floatUp 8s infinite ease-in;
  opacity: 0.6;
  backdrop-filter: blur(2px);
}
.bubble:nth-child(1) { width: 60px; height: 60px; left: 10%; animation-duration: 6s; }
.bubble:nth-child(2) { width: 40px; height: 40px; left: 25%; animation-duration: 7s; animation-delay: 2s; }
.bubble:nth-child(3) { width: 80px; height: 80px; left: 50%; animation-duration: 9s; animation-delay: 1s; }
.bubble:nth-child(4) { width: 30px; height: 30px; left: 70%; animation-duration: 5s; animation-delay: 3s; }
.bubble:nth-child(5) { width: 90px; height: 90px; left: 85%; animation-duration: 10s; animation-delay: 0.5s; }
.bubble:nth-child(6) { width: 50px; height: 50px; left: 40%; animation-duration: 6.5s; animation-delay: 4s; }
.bubble:nth-child(7) { width: 70px; height: 70px; left: 60%; animation-duration: 8.5s; animation-delay: 2.5s; }
.bubble:nth-child(8) { width: 35px; height: 35px; left: 15%; animation-duration: 5.5s; animation-delay: 1.5s; }

@keyframes floatUp {
  0% { transform: translateY(0) scale(1) rotate(0deg); opacity: 0; }
  10% { opacity: 0.6; }
  90% { opacity: 0.4; }
  100% { transform: translateY(-100vh) scale(1.5) rotate(360deg); opacity: 0; }
}`;

c = c.replace(regex, replacement);
fs.writeFileSync('src/styles.css', c, 'utf8');
console.log('Styles updated.');
