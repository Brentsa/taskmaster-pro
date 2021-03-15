var tasks = {};

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
  console.log("clicked elsewhere");
  var text = $(this).val().trim();
  var status = $(this).closest(".list-group").attr("id").replace("list-", "");
  var index = $(this).closest(".list-group-item").index();

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

// load tasks for the first time
loadTasks();


