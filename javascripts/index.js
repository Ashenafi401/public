$(document).ready(function () {
  var timeData = [],
    collisionData = []; /* My Modification */
  var data = {
    labels: timeData,
    datasets: [
      {
        fill: false,
        label: 'Collision',
        yAxisID: 'Collision',
        showLine: false,
        borderColor: "rgba(24, 120, 240, 1)",
        pointBorderColor: "rgba(24, 120, 240, 1)",
        backgroundColor: "rgba(24, 120, 240, 0.4)",
        pointHoverBackgroundColor: "rgba(24, 120, 240, 1)",
        pointHoverBorderColor: "rgba(24, 120, 240, 1)",
        data: collisionData
      }
    ]
  }

  var basicOption = {
    title: {
      display: true,
      text: 'Collision Severity and Time of Collision',
      fontSize: 36
    },
    scales: {
      yAxes: [{
        id: 'Collision',
        type: 'linear',
        scaleLabel: {
          labelString: 'Collision Severity',
          display: true
        },
        position: 'left',
      }]
    }
  }

  //Get the context of the canvas element we want to select
  var ctx = document.getElementById("myChart").getContext("2d");
  var optionsNoAnimation = { animation: false }
  var myLineChart = new Chart(ctx, {
    type: 'line',
    data: data,
    options: basicOption
  });

  var ws = new WebSocket('wss://' + location.host);
  ws.onopen = function () {
    console.log('Successfully connect WebSocket');
  }
  ws.onmessage = function (message) {
    console.log('receive message' + message.data);
    try {
      var obj = JSON.parse(message.data);
      console.log(obj);
      if(!obj.time || !obj.collision) {
	  //if(!obj.time || !obj.temperature || !obj.tempAlert) { /* My Modification */
        return;
      }
      timeData.push(obj.time);
      collisionData.push(obj.collision);
      // only keep no more than 50 points in the line chart
      const maxLen = 50;
      var len = timeData.length;
      if (len > maxLen) {
        timeData.shift();
        collisionData.shift();
      }      
    
      myLineChart.update();    
    } catch (err) {
      console.error(err);
    }
  }
});