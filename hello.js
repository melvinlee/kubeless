module.exports.handler = (event,context) => {
      console.log(event);
      let greeting = `hello, ${event.data}!`
      return JSON.stringify(greeting);
}