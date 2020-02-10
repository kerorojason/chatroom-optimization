const fs = require('fs');
let comments = JSON.parse(fs.readFileSync('raw.json'));
comments = comments.map(({ _id, commenter, message }) => ({
  name: commenter.display_name,
  logo: commenter.logo,
  message: message.body,
  color: message.user_color,
  _id: _id
}));

fs.writeFileSync('comments.json', JSON.stringify(comments));
