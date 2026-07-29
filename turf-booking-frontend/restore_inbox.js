const fs = require('fs');

let inboxPath = 'src/app/core/services/inbox.service.ts';
let inbox = fs.readFileSync(inboxPath, 'utf8');
if (!inbox.includes('addNotification')) {
    inbox = inbox.replace(
        "markAsRead(id: number) {",
        "addNotification(notification: Omit<InboxNotification, 'id' | 'time' | 'isRead'> & { time?: string }) {\n    const newNotification: InboxNotification = {\n      id: Math.floor(Math.random() * 1000000),\n      time: new Date().toISOString(),\n      isRead: false,\n      ...notification\n    };\n    this._notifications.update(n => [newNotification, ...n]);\n  }\n\n  markAsRead(id: number) {"
    );
    fs.writeFileSync(inboxPath, inbox);
    console.log('Restored inbox.service.ts');
}
