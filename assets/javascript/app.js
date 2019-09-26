// Initialize Firebase
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

// Button for adding trains
$("#add-train-btn").on("click", function (event) {
  event.preventDefault();

  // Grabs user input
  var trainName = $("#train-name-input").val().trim();
  var trainDestination = $("#destination-input").val().trim();
  var firstTrainTime = $("#first-train-input").val().trim();
  var trainFrequency = $("#frequency-input").val().trim();
  var firstTimeConverted = moment(firstTrainTime, 'LT');
  
  // Current Time
  var currentTime = moment();
  console.log("CURRENT TIME: " + moment(currentTime).format('LT'));

  // Difference between the times
  var diffTime = moment().diff(moment(firstTimeConverted), 'minutes');
  console.log("DIFFERENCE IN TIME: " + diffTime);

  // Time apart (remainder)
  var tRemainder = diffTime % trainFrequency;
  console.log("tRemainder: " + tRemainder);

  // Minute Until Train
  var tMinutesTillTrain = trainFrequency - tRemainder;
  console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

  // Next Train
  // var nextTrain = moment().add(tMinutesTillTrain, 'minutes');
  var nextTrain = (moment().add(tMinutesTillTrain, 'minutes')).format('LT');

  console.log("ARRIVAL TIME: " + nextTrain);

    // Creates local "temporary" object for holding train data
    var newTrain = {
      name: trainName,
      destination: trainDestination,
      firsttime: firstTrainTime,
      frequency: trainFrequency,
      nextarrival: nextTrain,
      minstillnext: tMinutesTillTrain
    };
  
  // Uploads train data to the database
  database.ref().push(newTrain);

  // Clears all of the text-boxes
  $("#train-name-input").val("");
  $("#destination-input").val("");
  $("#first-train-input").val("");
  $("#frequency-input").val("");
});

// Create Firebase event for adding train to the database and a row in the html when a user adds an entry
database.ref().on("child_added", function (childSnapshot) {

  // Store everything into a variable.
  var trainName = childSnapshot.val().name;
  var trainDestination = childSnapshot.val().destination;
  var trainFrequency = childSnapshot.val().frequency;
  var trainNextArrival = childSnapshot.val().nextarrival;
  var minsTillNextTrain = childSnapshot.val().minstillnext;


  // Create the new row
  var newRow = $("<tr>").append(
    $("<td>").text(trainName),
    $("<td>").text(trainDestination),
    $("<td>").text(trainFrequency),
    $("<td>").text(trainNextArrival),
    $("<td>").text(minsTillNextTrain),
  );

  // Append the new row to the table
  $("#train-table > tbody").append(newRow);
});
