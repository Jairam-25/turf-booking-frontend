const fs = require('fs');
let path = 'src/app/features/auth/login/login.component.ts';
let content = fs.readFileSync(path, 'utf8');

if (!content.includes('this.route.queryParams.subscribe')) {
    content = content.replace(
        "this.activeSport.set(sports[Math.floor(Math.random() * sports.length)]);",
        "this.activeSport.set(sports[Math.floor(Math.random() * sports.length)]);\n\n    this.route.queryParams.subscribe(params => {\n      if (params['email']) this.initialEmail = params['email'];\n      if (params['password']) this.initialPassword = params['password'];\n    });"
    );
    fs.writeFileSync(path, content);
    console.log('Fixed login query params subscriber');
}
