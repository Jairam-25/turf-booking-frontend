const fs = require('fs');
let c = fs.readFileSync('src/app/features/dashboard/dashboard.component.ts', 'utf8');

const startStr = '.search-bar { \r\n flex-direction: column;';
const altStartStr = '.search-bar { \n flex-direction: column;';
let startIndex = c.indexOf(startStr);
if (startIndex === -1) startIndex = c.indexOf(altStartStr);

if (startIndex !== -1) {
  const endStr = ".btn-filter::after {\r\n content: 'Filters';\r\n margin-left: 8px;\r\n font-weight: 600;\r\n }";
  const altEndStr = ".btn-filter::after {\n content: 'Filters';\n margin-left: 8px;\n font-weight: 600;\n }";
  let endIndex = c.indexOf(endStr);
  let offset = endStr.length;
  if (endIndex === -1) {
      endIndex = c.indexOf(altEndStr);
      offset = altEndStr.length;
  }
  
  if (endIndex !== -1) {
      const replacement = `.search-bar { 
 flex-direction: row; 
 flex-wrap: wrap;
 align-items: center; 
 gap: 8px; 
 padding: 8px; 
 border-radius: 20px; 
 }
 .divider { display: none; }
 .custom-select-container { width: 100%; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 4px; }
 .custom-select-value { justify-content: space-between; padding: 4px 8px; font-size: 0.85rem; }
 .search-input { flex: 1; padding: 8px 12px; font-size: 0.85rem; min-width: 0; background: rgba(0,0,0,0.2); border-radius: 12px; height: 40px; }
 .btn-search { width: 40px; height: 40px; padding: 0; border-radius: 12px; font-size: 0; display: flex; align-items: center; justify-content: center; }
 .btn-search::after {
   content: '';
   width: 18px;
   height: 18px;
   background: url('data:image/svg+xml;utf8,<svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>') no-repeat center;
   display: block;
 }
 .btn-filter { 
 width: 40px; 
 height: 40px;
 border-radius: 12px; 
 padding: 0; 
 background: rgba(123, 57, 252, 0.15); 
 display: flex;
 align-items: center;
 justify-content: center;
 }
 .btn-filter svg { width: 18px; height: 18px; }
 .btn-filter::after { display: none; }`;
      
      c = c.substring(0, startIndex) + replacement + c.substring(endIndex + offset);
      fs.writeFileSync('src/app/features/dashboard/dashboard.component.ts', c, 'utf8');
      console.log('Successfully replaced CSS block.');
  } else {
      console.log('End string not found.');
  }
} else {
  console.log('Start string not found.');
}
