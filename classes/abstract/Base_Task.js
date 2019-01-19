const eoswrapper = require('../eoswrapper.js');

class Base_Task {

    constructor() {
      console.log(`Task loaded.`);
    }
  
    start() {
      throw new Error('You need to implement a start() function.');
    } 
}

module.exports = {
  Base_Task
};