var ws;
var isFlipped = false;

function setup() {
    ws = new WebSocket('ws://localhost:3000');
    ws.onopen = function() {
      const name = document.querySelector('#message').value;

      const newUser = {
          name,
          process: 'newUser',
      }
      ws.send(JSON.stringify(newUser));

      document.querySelector('#message').disabled = true;
      document.querySelector('#send').disabled = true;
      document.querySelector('#card').disabled = false;
      document.querySelector('#flip').disabled = false;
      document.querySelector('#reset').disabled = false;
    };

    ws.onmessage = function(msg) {
      const data = JSON.parse(msg.data);

      switch(data.process) {
          case 'newUsers':
              const ifHasUser =  document.getElementById(data.user);
              if (!ifHasUser) {
                  document.querySelector('#result').innerHTML += `
                  <div id='${data.user}' class='user'>
                      <h2>${data.user}</h2>
                      <div id="vote"></div>
                  </div>`;
              }
              break;

          case 'vote':
              if(!isFlipped) {
                  document.getElementById(data.user).querySelector('#vote').innerHTML = `
                      <div id="voteValue" style="color: transparent">
                          ${data.value}
                      </div>
                      <div id="square"></div>
                  `;
              } else {
                  document.getElementById(data.user).querySelector('#vote').innerHTML = `
                      <div id="voteValue" style="color: red">
                          ${data.value}
                      </div>
                  `;
              }
              break;

          case 'flip':
              console.log('flip')
              document.querySelector('#flip').disabled = true;
              isFlipped = true;
              const votes = document.querySelectorAll('#vote');
              votes.forEach((vote) => {
                  vote.querySelector('#square').style.background = "transparent";
                  vote.querySelector('#voteValue').style.color = "blue";
              })
              break;
          
          case 'reset':
              isFlipped = false;
              document.querySelector('#flip').disabled = false;
              const votesRemove = document.querySelectorAll('#vote');
              votesRemove.forEach((vote) => {
                  while (vote.firstChild) {
                      vote.removeChild(vote.lastChild);
                  }
              })
              break;

          case 'removeUser':
              document.getElementById(data.user).remove();
              break;
      }
  }
};

function vote(value) {
    const vote = {
        value,
        process: 'vote'
    }
    ws.send(JSON.stringify(vote));
}

function flip() {
    ws.send(JSON.stringify({ process: 'flip' }));
}

function reset() {
    ws.send(JSON.stringify({ process: 'reset' }));
}
