
(function(){
// 插入 <ul> 之 <li> 樣板
var tmpEmp = '<li><input type="text" placeholder="New task..."><span></span></li>',
    addButton = $('#add'),
    connected = $('.connected'),      // 三個 <ul>
    placeholder = $('#placeholder'),  // 三個 <ul> 的容器
    mainUl = $('.main'),              // main <ul>
    deleteUl = $('.delete'),          // delete <ul>
    doneUl = $('.done');              // done <ul>
    selectedTodo = '';
    API =''; //'http:/54.64.186.0:3000';
    reposit = true;

// 點擊按鈕時，插入新項目
addButton.on('click', function(){
  $(tmpEmp).prependTo(mainUl).addClass('is-editing').find('input').focus();
});

// 按 Enter 鍵時完成編輯並存檔
mainUl.on('keyup', 'input', function(e){
  // 若目前的鍵是「enter」
  if(e.which === 13){
    var input = $(this), li = input.parents('li');

    // 把 <input> 的值複製到 <span> 裡
    li.find('span').text( input.val() );

    li.addClass('is-todo');
    // 取消 <li> 的編輯模式（is-editing class）
    li.removeClass('is-editing');

    //using Ajax to add a new todo item 
    addItem(input.val());
  }
});

// Using Ajax to load todo list
//
fetchTodoList();

// 把 ul 初始化為 sortable
doneUl.sortable({
  tolerance: "pointer"
});

deleteUl.sortable({
  tolerance: "pointer"
});

mainUl.sortable({
  connectWith: ".connected",
  dropOnEmpty: true,
  tolerance: "pointer"
});


doneUl.disableSelection();
deleteUl.disableSelection();
//mainUl.disableSelection();


mainUl.on('sortstart', function(e, ui){
  placeholder.addClass('is-dragging');
  selectedTodo = ui.item.text();
  reposit = true;
});

doneUl.on('sortreceive', function(e, ui){
  reposit = false;
  updateItem(ui.item.text())
  ui.item.removeClass('is-todo');
  ui.item.addClass('is-done');
  ui.item.appendTo(mainUl);
});

deleteUl.on('sortreceive', function(e, ui){
  reposit = false;
  deleteItem(ui.item.text());
  ui.item.remove();
});

mainUl.on('sortstop', function(e, ui){
  placeholder.removeClass('is-dragging');
  if(reposit)
    reposition(selectedTodo, ui.item.prevAll().length);
});

//GET /items ：取得所有TODO items
function fetchTodoList(){
$.ajax({
  url: API+'/items/', 
  type:"GET",
  dataType:'JSON',

  success: function(msg){
    var i;
  // 對於陣列裡的每一個項目，插入回 ul 裡。
    for(i=0; i<msg.todoList.length; i+=1){
      $(tmpEmp).addClass(msg.todoList[i].stat).appendTo(mainUl).find('span').text(msg.todoList[i].text);
    }
  },

  error:function(xhr, ajaxOptions, thrownError){ 
 //  alert('fetchTodoList xhr.status: '+xhr.status); 
 //  alert('fetchTodoList thrownError: '+thrownError); 
   }
 });
}

//POST /items ：新增一個TODO item
function addItem(todoText){
 var todoID = createID();

 var newTodo ={
      oid : todoID,     
      stat : "is-todo",
      text : todoText
    };
  console.log("to: "+newTodo.oid);
$.ajax({
  url: API+'/items/', 
  data: newTodo,
  type:"POST",
  dataType:'JSON',

  success: function(){
    console.log("success adding a todo item."); 
  },

  error:function(xhr, ajaxOptions, thrownError){ 
//    alert('addItem xhr.status: '+xhr.status); 
//    alert('addItem xhr.readyState: '+xhr.readyState); 
//    alert('addItem thrownError: '+thrownError); 
   }
 });
}

//PUT /items/:id ：更新一個TODO item（如把item標示為完成狀態）
function updateItem(todoText){
$.ajax({
  url: API+'/items/'+todoText, 
  type:"PUT",
  dataType:'JSON',
  success: function(){
    console.log(todoText + " todo item is done."); 
  },

  error:function(xhr, ajaxOptions, thrownError){ 
//    alert('updateItem xhr.status: '+xhr.status); 
//    alert('updateItem xhr.readyState: '+xhr.readyState); 
//    alert('updateItem thrownError: '+thrownError); 
   }
 });
}

//PUT /items/:id/reposition/:new_position ：把該TODO item的位置移動到new position代表的index位置
function reposition(todoText, position){
$.ajax({
  url: API+'/items/'+todoText+'/reposition/'+position, 
  type:"PUT",
  dataType:'JSON',
  success: function(){
    console.log(todoText + " todo item is reposition."+ position); 
  },

  error:function(xhr, ajaxOptions, thrownError){ 
 //   alert('reposition xhr.status: '+xhr.status); 
 //   alert('reposition xhr.readyState: '+xhr.readyState); 
 //   alert('reposition thrownError: '+thrownError); 
   }
 });
}

//DELETE /items/:id ：刪除一個TODO item
function deleteItem(todoText){
$.ajax({
  url: API+'/items/'+todoText, 
  type:"DELETE",
  dataType:'JSON',
  success: function(){
    console.log(todoText + " todo item is deleted."); 
  },

  error:function(xhr, ajaxOptions, thrownError){ 
 //   alert('deleteItem xhr.status: '+xhr.status); 
 //   alert('deleteItem xhr.readyState: '+xhr.readyState); 
 //   alert('deleteItem thrownError: '+thrownError); 
   }
 });
}

function createID(){
  var id = new Date();
  var oid = ""+id.getFullYear()+id.getMonth()+id.getDay()+id.getHours()+id.getMinutes()+id.getSeconds()+id.getMilliseconds();
  return oid;
}

}());
