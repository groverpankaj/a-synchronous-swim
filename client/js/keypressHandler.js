
$('body').on('keydown', (event) => {
  var arrowPress = event.key.match(/Arrow(Up|Down|Left|Right)/);
  if (arrowPress) {
    var direction = arrowPress[1];
    SwimTeam.move(direction.toLowerCase());
  }
});

const serverUrl = 'http://127.0.0.1:3000';

const getCommands = () => {

  $.ajax({
    type: 'GET',
    url: serverUrl,
    // data: JSON.stringify([]),
    success: (response) => {
      console.log("RES" , response);
      if(response) {
        let command = JSON.parse(response);
        SwimTeam.move(command.toLowerCase());
      }
    }
  });


}

setInterval( function() {

  getCommands();

}, 1000);

console.log('Client is running in the browser!');
