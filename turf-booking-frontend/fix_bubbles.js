const fs = require('fs');
let c = fs.readFileSync('src/styles.css', 'utf8');

const regex = /\/\* Background Bubbles \*\/(.|\n)*?@keyframes fadeOut/m;

const replacement = `/* Background Bubbles */
.bubbles-container {
  overflow: hidden;
  position: absolute;
  inset: 0;
}
.bubble {
  position: absolute;
  bottom: -150px;
  background: radial-gradient(circle at 30% 30%, rgba(123, 57, 252, 0.25), rgba(56, 189, 248, 0.05));
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 0 30px rgba(123, 57, 252, 0.3), inset 0 0 15px rgba(255, 255, 255, 0.08);
  border-radius: 50%;
  opacity: 0;
}
.bubble:nth-child(1) { width: 80px; height: 80px; left: 10%; animation: floatUpLeft 7s infinite linear; }
.bubble:nth-child(2) { width: 45px; height: 45px; left: 25%; animation: floatUpRight 8s infinite linear 1s; }
.bubble:nth-child(3) { width: 110px; height: 110px; left: 50%; animation: floatUpLeft 10s infinite linear 2s; }
.bubble:nth-child(4) { width: 35px; height: 35px; left: 75%; animation: floatUpRight 6s infinite linear 0.5s; }
.bubble:nth-child(5) { width: 90px; height: 90px; left: 85%; animation: floatUpLeft 9s infinite linear 3s; }
.bubble:nth-child(6) { width: 55px; height: 55px; left: 35%; animation: floatUpRight 7.5s infinite linear 4s; }
.bubble:nth-child(7) { width: 75px; height: 75px; left: 65%; animation: floatUpLeft 8.5s infinite linear 2.5s; }
.bubble:nth-child(8) { width: 40px; height: 40px; left: 15%; animation: floatUpRight 6.5s infinite linear 1.5s; }

@keyframes floatUpLeft {
  0% { transform: translateY(0) translateX(0) scale(0.8); opacity: 0; }
  15% { opacity: 1; }
  50% { transform: translateY(-50vh) translateX(-25px) scale(1); }
  85% { opacity: 0.8; }
  100% { transform: translateY(-110vh) translateX(15px) scale(1.1); opacity: 0; }
}
@keyframes floatUpRight {
  0% { transform: translateY(0) translateX(0) scale(0.8); opacity: 0; }
  15% { opacity: 1; }
  50% { transform: translateY(-50vh) translateX(25px) scale(1.05); }
  85% { opacity: 0.8; }
  100% { transform: translateY(-110vh) translateX(-20px) scale(1.15); opacity: 0; }
}

.custom-splash-screen {
  animation: fadeOut 0.5s ease-in-out 2.5s forwards;
}
@keyframes fadeOut`;

c = c.replace(regex, replacement);
fs.writeFileSync('src/styles.css', c, 'utf8');
console.log("Bubbles updated.");
