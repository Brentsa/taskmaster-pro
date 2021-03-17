
var tasks = {
  toDo: [],
  inProgress: [],
  inReview: [],
  done: []
};


var createTask = function(taskText, taskDate, taskList) {
  // create elements that make up a task item
  var taskLi = $("<li>").addClass("list-group-item");
  var taskSpan = $("<span>")
    .addClass("badge badge-primary badge-pill")
    .text(taskDate);
  var taskP = $("<p>")
    .addClass("m-1")
    .text(taskText);

  // append span and p element to parent li
  taskLi.append(taskSpan, taskP);


  // append to ul list on the page
  $("#list-" + taskList).append(taskLi);
};

var loadTasks = function() {
  tasks = JSON.parse(localStorage.getItem("tasks"));

  // if nothing in localStorage, create a new object to track all task status arrays
  if (!tasks) {
    tasks = {
      toDo: [],
      inProgress: [],
      inReview: [],
      done: []
    };
  }

  // loop over object properties
  $.each(tasks, function(list, arr) {
    console.log(list, arr);
    // then loop over sub-array

    Array.from(arr).forEach(function(task) {
      createTask(task.text, task.date, list);
    });
    
  });
};

var saveTasks = function() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
};

//When clicking a paragraph in a list group, call the function
$(".list-group").on("click", "p", function(){
  var text = $(this).text().trim();
  var textInput = $("<textarea>").addClass("form-control").val(text);
  $(this).replaceWith(textInput);
  textInput.trigger("focus");
});

//When clicking outside a textarea within a list group, call the function
$(".list-group").on("blur", "textarea", function(){
  var text = $(this).val().trim();
  var status = $(this).closest(".list-group").attr("id").replace("list-", "");
  var index = $(this).closest(".list-group-item").index();

  console.log(text, status, index);
  console.log(tasks[status]);

  tasks[status][index].text = text;
  saveTasks();

  var taskP = $("<p>").addClass("m-1").text(text);
  $(this).replaceWith(taskP);
})

$(".list-group").on("click", "span", function(){
  //Get the current text of the date
  var text = $(this).text().trim();

  //Create a new input area and give it class and text vale
  var dateInput = $("<input>").attr("type", "text").addClass("form-control").val(text);

  //Replace the current span with the date input and set it as focus
  $(this).replaceWith(dateInput);
  dateInput.trigger("focus");
});

$(".list-group").on("blur", "input[type='text']", function(){
  //Get current text
  var date = $(this).val().trim();

  //Get the parent ul's id attribute
  var status = $(this).closest(".list-group").attr("id").replace("list-", "");

  //Get the tasks position in the list of other ul elements
  var index = $(this).closest(".list-group-item").index();

  //Update task in the array and re-save to localStorage
  tasks[status][index].date = date;
  saveTasks();

  //Recreate span with bootstrap classes
  var dateSpan = $("<span>").addClass("badge badge-primary badge-pill").text(date);

  //Replace input with span
  $(this).replaceWith(dateSpan);
});

// modal was triggered
$("#task-form-modal").on("show.bs.modal", function() {
  // clear values
  $("#modalTaskDescription, #modalDueDate").val("");
});

// modal is fully visible
$("#task-form-modal").on("shown.bs.modal", function() {
  // highlight textarea
  $("#modalTaskDescription").trigger("focus");
});

// save button in modal was clicked
$("#task-form-modal .btn-primary").click(function() {
  // get form values
  var taskText = $("#modalTaskDescription").val();
  var taskDate = $("#modalDueDate").val();

  if (taskText && taskDate) {
    createTask(taskText, taskDate, "toDo");

    // close modal
    $("#task-form-modal").modal("hide");

    // save in tasks array
    tasks.toDo.push({
      text: taskText,
      date: taskDate
    });

    saveTasks();
  }
});

// remove all tasks
$("#remove-tasks").on("click", function() {
  for (var key in tasks) {
    tasks[key].length = 0;
    $("#list-" + key).empty();
  }
  saveTasks();
});

//Sort tasks within and between the 4 list types 
$(".card .list-group").sortable({
  connectWith: $(".card .list-group"),
  scroll: false,
  tolerance: "pointer",
  helper: "clone",
  activate: function(event){
    //console.log("activate", this);
  },
  deactivate: function(event){
    //console.log("deactivate", this);
  },
  over: function(event){
    //console.log("over", this);
  },
  out: function(event){
    //console.log("out", this);
  },
  update: function(event){
    //temp array to store the task data in
    var tempArray = [];

    //loop through each task object in the lists and push them into our temp array
    console.log("update", $(this).children());
    $(this).children().each(function(){
      var text = $(this).find("p").text().trim();
      var date = $(this).find("span").text().trim();
      tempArray.push({text: text, date: date});
    });

    //find the id of the list and then save our temp array into the tasks array so we can save the data
    var arrName = $(this).attr("id").replace("list-", "");
    tasks[arrName] = tempArray;
    saveTasks();
  }
});

$("#trash").droppable({
  accept: ".card .list-group-item",
  tolerance: "touch",
  drop: function(event,ui){
    ui.draggable.remove();
  },
  over: function(event, ui){
    console.log("over");
  },
  out: function(event, ui){
    console.log("out");
  }
});

// load tasks for the first time
loadTasks();