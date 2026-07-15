const fs = require('fs');
const path = 'src/app/features/dashboard/dashboard.component.ts';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(
  "import { Component, OnInit, signal, OnDestroy } from '@angular/core';",
  "import { Component, OnInit, signal, OnDestroy, inject } from '@angular/core';"
);

fs.writeFileSync(path, content);
console.log('Fixed import');
