// Add current dir to the module path so we can import from root
require('app-module-path').addPath(__dirname);

import { Clink } from './src/services/clink';

const clink = new Clink();

clink.getAllUsers()
.then((res) => res.members)
.then((users) => users.map((user) => ({ id: user.id, name: user.name, real_name: user.real_name })))
.then((users) => {
    console.log(users);
});
