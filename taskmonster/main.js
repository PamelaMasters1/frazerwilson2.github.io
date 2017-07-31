//var colors = ['#16a085', '#2ecc71', '#2980b9', '#9b59b6', '#34495e', '#e67e22', '#f39c12', '#d35400', '#4DD0E1', '#FFD54F', '#7986CB'];
var colors = ['extra', 'minny', 'spike', 'lou', 'other', 'thingy', 'magic', 'crystal', 'arou', 'zen', 'panda'];
var colorLen = colors.length;
var toDoRecords = [];
var monstLen = $('#template .pep').length;
var anims = 4;
var inputVal;

function setPeps() {
  $('#toDoHolder .pep').pep({
    //constrainTo: 'window',
    useBoundingClientRect: true,
    rest: function () {
      var thisEl = this.el;
      var toDoId = $(thisEl).attr('id');
      setToDoPos($(thisEl).position(), toDoId);
      var winX = window.innerWidth;
      var winy = window.innerHeight;
      var boxX = $(thisEl).position().left;
      var boxY = $(thisEl).position().top;
      if (boxX > winX || boxX < 0 || boxY > winy || boxY < 0) {
        $(thisEl).remove();
        removeToDo(toDoId);
      }
    }
  });
}

function addNewItem() {
  if (!inputVal) {return}
  var newId = Date.now();

  var chosenMonst = new Tm.Monster();

  var newToDoObj = { id: newId, name: inputVal, Monster: chosenMonst };
  if (!toDoRecords) {
    toDoRecords = [newToDoObj];
  }
  else {
    toDoRecords.push(newToDoObj);
  }
  localStorage.setItem('dragToDoRecs', JSON.stringify(toDoRecords));
  buildToDoMonster(newToDoObj);
  
  setPeps();
  $('#toDoItem').val("");
}

$('input').on('keyup', function (e) {
  if ($("input").is(":focus") && (e.keyCode === 13)) {
    onNewItemSubmit();
  }
});

function onNewItemSubmit() {
  inputVal = $('#toDoItem').val();
  if (!inputVal) {
    console.log('no name given');
    return;
  }
  addNewItem();
}

function setToDoPos(pos, id) {
  for (var i = 0; i < toDoRecords.length; i++) {
    if (toDoRecords[i].id === parseInt(id)) {
      toDoRecords[i].Monster.SetPosition(pos.top, pos.left);
      console.log(toDoRecords[i].Monster);
      //toDoRecords[i].Monster.Position.Left = pos.left;
      //toDoRecords[i].Monster.Position.Top = pos.top;
    }
  }

  localStorage.setItem('dragToDoRecs', JSON.stringify(toDoRecords));
}

function removeToDo(id) {
  for (var i = 0; i < toDoRecords.length; i++) {
    if (toDoRecords[i].id === parseInt(id)) {
      toDoRecords.splice(i, 1);
    }
  }
  localStorage.setItem('dragToDoRecs', JSON.stringify(toDoRecords));
}

function randomPos() {
  return Math.round(Math.random() * 200) - Math.round(Math.random() * 200);
}

function buildToDoMonster(item) {
  var newToDo = item.Monster.BuildElement(item.id, $('#toDoHolder'));
  //var newToDo = $("#template").find('#monst' + item.Monster.Type).clone();
  //var randomSpeed = Math.ceil(Math.random() * anims);
  newToDo.children('.name').html(item.name);
  //$(newToDo).attr('id', item.id).addClass('delay-' + randomSpeed);
  //$(newToDo).find('.mbody').addClass(item.Monster.Colour);
  //newToDo.appendTo($('#toDoHolder'));
  //newToDo.css({ top: item.Monster.Position.Top, left: item.Monster.Position.Left });
}

setPeps();

$(document).ready(function () {
  toDoRecords = JSON.parse(localStorage.getItem('dragToDoRecs'));
  //alert(toDoRecords);
  $('#textList').hide();
  if (toDoRecords) {
    toDoRecords.forEach(function (item) {
      item.Monster = new Tm.Monster(item.Monster);
      buildToDoMonster(item);
    });
    setPeps();
    $('#toDoItem').focus();
  }
});


$('#textListBtn').hover(function () {
  var tempList = $('<ul></ul>');
  for (var i = toDoRecords.length - 1; i >= 0; i--) {
    var tempListItem = '<li class="'
    + toDoRecords[i].Monster.Colour + '">'
    + '<svg class="icon"><use xlink:href="#ref' + toDoRecords[i].Monster.Type + '" /></svg>' 
    + toDoRecords[i].name + '</li>';
    tempList.append(tempListItem);
  };
  $('#textList').html(tempList);
  toggleViews();
});

function toggleViews(){
  $('#textList').toggle();
  $('#toDoHolder').toggle();
}