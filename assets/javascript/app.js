// 1. Initialize Firebase
var firebaseConfig = {
  apiKey: "AIzaSyATLQKNzaxazlo0sGV8-MbppJeQZv6VXvo",
  authDomain: "njib-train-scheduler.firebaseapp.com",
  databaseURL: "https://njib-train-scheduler.firebaseio.com",
  projectId: "njib-train-scheduler",
  storageBucket: "",
  messagingSenderId: "631313123386",
  appId: "1:631313123386:web:042936bc0d88bacf594d03"
};

firebase.initializeApp(firebaseConfig);

var database = firebase.database();

// 2. Button for adding Trainloyees
$("#add-train-btn").on("click", function (event) {
  event.preventDefault();

  // Grabs user input
  var trainName = $("#train-name-input").val().trim();
  var trainDestination = $("#destination-input").val().trim();
  var trainFrequency = moment($("#frequency-input").val().trim(), "HH:mm").format("X");
  var trainNextArrival = $("#nextarrival-input").val().trim();
  // var minutesAway = 

  // Creates local "temporary" object for holding train data
  var newTrain = {
    name: trainName,
    destination: trainDestination,
    frequency: trainFrequency,
    nextarrival: trainNextArrival
  };

  // Uploads train data to the database
  database.ref().push(newTrain);

  // Logs everything to console
  console.log("newTrain.name: " + newTrain.name);
  console.log("newTrain.destination: " + newTrain.destination);
  console.log("newTrain.frequency: " + newTrain.frequency);
  console.log("newTrain.nextarrival: " + newTrain.nextarrival);

  alert("Train successfully added");

  // Clears all of the text-boxes
  $("#train-name-input").val("");
  $("#destination-input").val("");
  $("#frequency-input").val("");
  $("#nextarrival-input").val("");
});

// 3. Create Firebase event for adding train to the database and a row in the html when a user adds an entry
database.ref().on("child_added", function (childSnapshot) {
  console.log("childSnapshot.val():" + childSnapshot.val());

  // Store everything into a variable.
  var trainName = childSnapshot.val().name;
  var trainDestination = childSnapshot.val().destination;
  var trainFrequency = childSnapshot.val().frequency;
  var trainNextArrival = childSnapshot.val().nextarrival;

  // Train Info
  console.log(trainName);
  console.log(trainDestination);
  console.log(trainFrequency);
  console.log(trainNextArrival);

  // Calculate the minutes away
  var minutesAway = moment().diff(moment(trainFrequency, "X"), "minutes");
  console.log(minutesAway);

  // Create the new row
  var newRow = $("<tr>").append(
    $("<td>").text(trainName),
    $("<td>").text(trainDestination),
    $("<td>").text(trainFrequency),
    $("<td>").text(trainNextArrival),
    $("<td>").text(minutesAway),
  );

  // Append the new row to the table
  $("#train-table > tbody").append(newRow);
});
