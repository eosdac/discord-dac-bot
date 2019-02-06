
class Base_Command {

    constructor( name, description) {
      if (this.constructor == Base_Command) {
        throw new Error("Can't initiate an abstract class! Please extend this base class.");
      }

      if(!name || !description){
        throw new Error('You need to pass a command name and description in the constructor.');
      }

      this.name = name;
      this.description = description;
      this.parameters = '';
      this.required_roles = [];
      console.log(`Command ${this.name} loaded.`);
    }
  
    execute() {
      throw new Error('You need to implement an execute() function');
    } 
}

module.exports = {
    Base_Command
};