const fs = require('fs');
const path = 'src/app/features/dashboard/turf-detail/turf-detail.component.ts';
let content = fs.readFileSync(path, 'utf8');

// 1. Fix .summary-row overriding flex-direction to column
content = content.replace(/ \.summary-row \{\s+flex-direction: column;\s+gap: 4px;\s+\}/g, 
`      .summary-row {
        flex-direction: row;
        gap: 8px;
        align-items: center;
      }`);

// 2. Fix .payment-options-grid block
content = content.replace(/ \.payment-options-grid \{\s+grid-template-columns: 1fr;\s+\}\s+\.payment-option-card \{\s+padding: 1rem;\s+\}/g,
`      .payment-options-grid {
        grid-template-columns: 1fr;
        gap: 8px;
      }
      .payment-option-card {
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        padding: 0.85rem 1rem;
        gap: 8px;
      }
      .payment-option-card .option-header {
        margin-bottom: 0;
      }
      .payment-option-card .option-description {
        display: none;
      }
      .payment-option-card .option-price {
        margin-top: 0;
        font-size: 1.15rem;
      }`);

fs.writeFileSync(path, content);
console.log('Fixed turf-detail.component.ts compact layouts using regex!');
