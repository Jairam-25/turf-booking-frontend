const fs = require('fs');
const path = 'src/app/features/dashboard/turf-detail/turf-detail.component.ts';
let content = fs.readFileSync(path, 'utf8');

// 1. Fix .summary-row overriding flex-direction to column
content = content.replace(
`      .summary-row {
        flex-direction: column;
        gap: 4px;
      }`,
`      .summary-row {
        flex-direction: row;
        gap: 8px;
        align-items: center;
      }`
);

// 2. Fix .payment-option-card to be horizontal on mobile
// First, find the block inside the media query
content = content.replace(
`      .payment-options-grid {
        grid-template-columns: 1fr;
      }
      .payment-option-card {
        padding: 1rem;
      }`,
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
      }`
);

fs.writeFileSync(path, content);
console.log('Fixed turf-detail.component.ts compact layouts!');
