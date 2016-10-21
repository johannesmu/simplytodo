
var todo = [];

window.addEventListener("load",function(){
  addCordovaEvents();
  loadList(todo);
  showButton("remove",todo);
  //listener for touch on the list of tasks
  document.getElementById("task-list").addEventListener("touchend",function(event){
    id=event.target.getAttribute("id");
    document.getElementById(id).setAttribute("class","done");
    for(i=0;i<todo.length;i++){
      taskitem = todo[i];
      if(taskitem.id == id){
        taskitem.status = 1;
        saveList(todo);
      }
    }
    showButton("remove",todo);
  });
  document.getElementById("remove").addEventListener("touchend",function(){
    //todo.forEach(removeDone(item,index,arr));
    var len = todo.length-1;
    for(i=len;i>=0;i--){
      var item = todo[i];
      if(item.status==1){
        todo.splice(i,1);
        saveList(todo);
        renderList("task-list",todo);
      }
    }
    showButton("remove",todo);
  });
});



var inputform = document.getElementById("input-form");
inputform.addEventListener("submit",function(event){
  event.preventDefault();
  //get task input value
  task = document.getElementById("task-input").value;
  createTask(task);
  inputform.reset();
});

function createTask(task){
  id = new Date().getTime();
  name = task;
  taskitem ={id:id,name:name,status:0};
  todo.push(taskitem);
  renderList("task-list",todo);
}

function saveList(list_array){
  if(window.localStorage){
    localStorage.setItem("tasks",JSON.stringify(list_array));
  }
}

function loadList(list_array){
  if(window.localStorage){
    try{
      if(JSON.parse(localStorage.getItem("tasks"))){
        todo = JSON.parse(localStorage.getItem("tasks"));
        //console.log(todo);
      }
    }
    catch(error){
      console.log("error"+error);
    }
  }
    renderList("task-list",todo);
}

function renderList(elm,list_array){
  var container = document.getElementById(elm);
  saveList(list_array);
  container.innerHTML="";
  itemstotal = list_array.length;
  for(i=0;i<itemstotal;i++){
    item = list_array[i];
    listitem = document.createElement('LI');
    listtext = document.createTextNode(item.name);
    listitem.appendChild(listtext);
    listitem.setAttribute("id",item.id);
    listitem.setAttribute("data-status",item.status);
    if(item.status==1){
      listitem.setAttribute("class","done");
    }
    container.appendChild(listitem);
  }
}

function showButton(element,arr){
  var show=false;
  var len=arr.length;
  for(i=0;i<len;i++){
    var item = arr[i];
    if(item.status == 1){
      show = true;
    }
  }
  if(show==true){
    document.getElementById(element).setAttribute("class","show");
  }
  else{
    document.getElementById(element).removeAttribute("class");
  }
}

function changeStatus(id,status,arr){
  for(i=0;i<arr.length;i++){
    taskitem = arr[i];
    if(taskitem.id == id){
      taskitem.status = 1;
      saveList(todo);
    }
  }
}

function addCordovaEvents(){
  document.addEventListener("deviceready",onDeviceReady,false);
}
function onDeviceReady(){
  document.addEventListener("pause",function(){
    saveList(todo);
  },false);
  document.addEventListener("resume",function(){
    loadList(todo);
  },false);
  document.addEventListener("backbutton",function(){
    saveList(todo);
    navigator.app.exitApp();
  },false);
}
