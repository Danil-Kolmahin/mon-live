'use strict';

const initialOptions = {
  url: 'http://localhost:3000/counter',
  pyFlag: 'simple',
  command: 'node main',
  watching: ['./main.js'],
  without: ['./node_modules'],
  browserTab: -1,
  _command_executor: undefined,
  _session_id: undefined,
};

const optionsArr = Object.keys(initialOptions);

const options = process.argv.reduce((acc, cur) => {
  for (const string of optionsArr) {
    if (cur.startsWith(string))
      acc[string] = JSON.parse(
        cur.split('=')[1]
          .replaceAll('\'', '\"'),
      );
  }
  return acc;
}, initialOptions);

console.log(options);

import { spawn } from 'child_process';
import fs from 'fs';

const PY = 'python.py';

const getPy = () => {
  const { pyFlag, url, _command_executor, _session_id } = options;
  const result = [PY, pyFlag, url];
  if (_command_executor) result.push(_command_executor, _session_id);
  return result;
};

const watch = (path, callback) => {
  fs.watch(path, (event, file) => {
    // console.dir({ event, file });
    callback(path);
  });
};

const [command, ...commandArgs] = options.command.split(' ');
let child = spawn(command, commandArgs);
let frontChild = spawn('python', getPy());

frontChild.stdout.once('data',
  (buf) => {
    [
      options._command_executor,
      options._session_id,
    ] = buf.toString().split('\r\n');
    console.log(options._command_executor, options._session_id);
  });

watch(options.watching[0], () => {
  child.kill();
  child = spawn(command, commandArgs);
  frontChild.kill();
  frontChild = spawn('python', getPy());
  // frontChild.stdout.on('data',
  //   (buf) => console.log(buf.toString()));
});

process.on('SIGINT', () => {
  child.kill();
  frontChild.kill();
  process.exit();
});
