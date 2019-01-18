class Base_Command {

    constructor() {
      if (this.constructor == Base_Command) {
        throw new Error("Can't initiate an abstract class! Please extend this base class.");
      }
    }
  
    execute() {
      throw new Error('You need to implement an execute() function');
    }

  
}

module.exports = {
    Base_Command
};