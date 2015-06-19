// Description:
//   Traffic lights on a Raspberry Pi
//
// Commands:
//   hubot cross - press the button to cross

var gpio = require("pi-gpio");
var statemachine = require("javascript-state-machine");

var redLed = 33;
var amberLed = 35;
var greenLed = 37;

var timeout = function(fsm, interval) {
  setTimeout( function() { fsm.timer(); }, interval );
};

var lights = statemachine.create({
  initial: 'setup',

  events: [
    { name: 'ready',  from: 'setup',    to: 'red' },
    { name: 'timer',  from: 'red',      to: 'redamber' },
    { name: 'timer',  from: 'redamber', to: 'green' },
    { name: 'button', from: 'green',    to: 'amber' },
    { name: 'timer',  from: 'amber',    to: 'red' },
  ],

  callbacks: {
    onsetup: function(ev, f, t) {
      gpio.open(redLed, "output", function(err) {
        gpio.open(amberLed, "output", function(err) {
          gpio.open(greenLed, "output", function(err) {
            lights.ready();
          });
        });
      });
    },
    onred: function(ev, f, t) { 
      gpio.write(redLed, 1);
      gpio.write(amberLed, 0);
      gpio.write(greenLed, 0);
      timeout(lights, 5000);

      if (lights.context) {
        lights.context.send("Green man! Beep, beep, beep...");
      }
    },
    onredamber: function(ev, f, t) {
      gpio.write(redLed, 1);
      gpio.write(amberLed, 1);
      gpio.write(greenLed, 0);
      timeout(lights, 2000);

      if (lights.context) {
        lights.context.send("Red man!");
      }
    },
    ongreen: function(ev, f, t) {
      gpio.write(redLed, 0);
      gpio.write(amberLed, 0);
      gpio.write(greenLed, 1);

      if (lights.context) {
        lights.context = undefined;
      }
    },
    onamber: function(ev, f, t) {
      gpio.write(redLed, 0);
      gpio.write(amberLed, 1);
      gpio.write(greenLed, 0);
      timeout(lights, 2500);
    }
  }
});


module.exports = function(robot) {
  robot.respond(/cross/i, function(res){
    lights.context = res;
    lights.button();
  });
}
