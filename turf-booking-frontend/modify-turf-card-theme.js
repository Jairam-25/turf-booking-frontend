const fs = require('fs');
let c = fs.readFileSync('src/app/features/dashboard/ui/turf-card.component.ts', 'utf8');

c = c.replace(
  /\.turf-card-mobile \{[\s\S]*?\}/,
  `.turf-card-mobile {
      display: flex;
      flex-direction: column;
      background: #ffffff;
      border-radius: 24px;
      overflow: hidden;
      border: 1px solid #e2e8f0;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
    }
    :host-context(body.dark) .turf-card-mobile {
      background: rgba(30, 41, 59, 0.4);
      border: 1px solid rgba(255, 255, 255, 0.05);
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
    }`
);

c = c.replace(
  /\.turf-name-mobile \{[\s\S]*?\}/,
  `.turf-name-mobile {
      font-size: 15px;
      font-weight: 800;
      color: #121212;
      margin-bottom: 4px;
      line-height: 1.3;
    }
    :host-context(body.dark) .turf-name-mobile {
      color: white;
    }`
);

c = c.replace(
  /\.price-val-mobile \{[\s\S]*?\}/,
  `.price-val-mobile {
      font-size: 14px;
      font-weight: 800;
      color: #121212;
    }
    :host-context(body.dark) .price-val-mobile {
      color: white;
    }`
);

c = c.replace(
  /\.like-btn-mobile \{[\s\S]*?\}/,
  `.like-btn-mobile {
      position: absolute;
      bottom: 12px;
      right: 12px;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.8);
      backdrop-filter: blur(8px);
      border: 1px solid rgba(0, 0, 0, 0.1);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #94a3b8;
      cursor: pointer;
      z-index: 10;
    }
    :host-context(body.dark) .like-btn-mobile {
      background: rgba(0, 0, 0, 0.4);
      border: 1px solid rgba(255, 255, 255, 0.2);
      color: white;
    }`
);

c = c.replace(
  /\.btn-book-mobile \{[\s\S]*?\}/,
  `.btn-book-mobile {
      display: none; /* User's image has no book button on the card! */
    }`
);

fs.writeFileSync('src/app/features/dashboard/ui/turf-card.component.ts', c);
