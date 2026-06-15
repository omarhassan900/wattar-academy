const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('wattar.db');
const seq = 'fd:4:0:q,fd:4:0:q,fd:0:3:q,fd:0:3:q,fd:0:0:q,fd:0:0:q,fd:0:3:h,fd:0:1:q,fd:0:1:q,fd:0:0:q,fd:0:0:q,fd:0:2:q,fd:0:2:q,fd:0:0:h,fd:0:3:q,fd:0:3:q,fd:0:1:q,fd:0:1:q,fd:0:0:q,fd:0:0:q,fd:1:2:h,fd:0:3:q,fd:0:3:q,fd:0:1:q,fd:0:1:q,fd:0:0:q,fd:0:0:q,fd:1:2:h,fd:4:0:q,fd:4:0:q,fd:0:3:q,fd:0:3:q,fd:0:0:q,fd:0:0:q,fd:0:3:h,fd:0:1:q,fd:0:1:q,fd:0:0:q,fd:0:0:q,fd:0:2:q,fd:0:2:q,fd:0:0:h';
db.run('INSERT OR IGNORE INTO assignment_templates (title,instrument,notes_sequence,instructions,bpm,created_by) VALUES (?,?,?,?,?,?)',
  ['Twinkle Twinkle Little Star','guitar',seq,'Beginner melody. Quarter notes + half notes at phrase endings.',90,1],
  function(e){console.log(e?e.message:'Done! Template ID: '+this.lastID);db.close();});
