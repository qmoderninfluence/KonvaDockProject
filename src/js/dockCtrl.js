function createDockGroup(){
  var dockGroupLastDist = 0;
  var dockGroupStartScale = 1;
  var simpleText = null
  var dockGroup = new Konva.Group({
    width: htmlDivWidth / 25,
    height: htmlDivWidth / 25,
    draggable: true
  });
  // dockGroup.push(dockGroup);
  //draw dock
  function drawDockImage(dockImagObj){
    var dockImage = new Konva.Image({
      image: dockImagObj,
      x: 0,
      y: 0,
      width: htmlDivWidth / 25,
      height: htmlDivWidth / 25,
    })
    dockGroup.add(dockImage)
    addScaleTextForDock(dockImage)
  }
  var dockImagObj = new Image();
  dockImagObj.onload = function() {
    drawDockImage(this);
    layer.draw();
  };
  dockImagObj.src = '/assets/Dock.svg';
  //end draw

  function addScaleTextForDock(dockImageObject){
      simpleText = new Konva.Text({
      x:dockImageObject.attrs.x / 2,
      y: dockImageObject.attrs.height / 3,
      text: changeDockUnitLengthToFt(dockImageObject.attrs.width) + "'" + "*" +changeDockUnitLengthToFt(dockImageObject.attrs.height) + "'",
      fontSize: dockImageObject.attrs.width / 2,
      fontFamily: 'Calibri',
      fill: 'black'
    });

    dockGroup.add(simpleText);
  }
console.log("dockGroup",dockGroup)
  dockGroupTouchAndDrag(dockGroup)

  layer.add(dockGroup);
  dockGroup.setZIndex(1)
}





function dockGroupTouchAndDrag(dockGroupObject){
  dockGroupObject.on('touchmove dragmove' ,function(object){
    dockGroupMovingAndScaling(object.target.attrs)

    if(object.evt.type === "touchmove"){
      var touch1 = object.evt.touches[0];
      var touch2 = object.evt.touches[1];

      if(touch1 && touch2) {
        var dist = getDistance({
          x: touch1.clientX,
          y: touch1.clientY
        }, {
          x: touch2.clientX,
          y: touch2.clientY
        });
        if(!dockGroupLastDist) {
          dockGroupLastDist = dist;
        }
        var scale = object.target.attrs.scaleX * dist / dockGroupLastDist;
        object.target.attrs.scaleX = scale;
        object.target.attrs.scaleY = scale;

        dockGroupLastDist = dist;
        dockGroupMovingAndScaling(object.target.attrs)
        dockGroupObject.children[1].setText(changeDockUnitLengthToFt(object.target.attrs.width * object.target.attrs.scaleX) + "'" + "*"
          +changeDockUnitLengthToFt(object.target.attrs.height * object.target.attrs.scaleY) + "'");
      }
    }
    layer.draw();
  });

  dockGroupObject.on('touchend', function(object) {
    dockGroupLastDist = 0;
    //  console.log("touched",object.target.attrs)
    layer.draw();
  });
}



function dockGroupMovingAndScaling(dockGroupObject){
  //TO DO
  var dockGroupObjectObjectWidth = dockGroupObject.width * dockGroupObject.scaleX;
  var dockGroupObjectObjectHeight = dockGroupObject.height * dockGroupObject.scaleY;

  var dockGroupObjectRight = dockGroupObject.x + dockGroupObjectObjectWidth;
  var dockGroupObjectBottom = dockGroupObject.y + dockGroupObjectObjectHeight;
  var dockGroupObjectScaleX = dockGroupObject.width * dockGroupObject.scaleX/ stage.attrs.width

  //scaling
  if(dockGroupObject.scaleX < 2){
      if(dockGroupObject.scaleX < 1){
        dockGroupObject.scaleX = 1;
        dockGroupObject.scaleY = dockGroupObject.scaleX
      }
  }
  else{
    dockGroupObject.scaleX = 2
    dockGroupObject.scaleY = 2
  }
  //moving
  //left
  if(dockGroupObject.x < 0){
    dockGroupObject.x = 0
  }
  if(dockGroupObject.y < 0){
    dockGroupObject.y = 0
  }
  if(dockGroupObjectRight > stage.attrs.width){
    dockGroupObject.x = stage.attrs.width - dockGroupObjectObjectWidth
  }
  if(dockGroupObjectBottom > stage.attrs.height){
    dockGroupObject.y = stage.attrs.height - dockGroupObjectObjectHeight
  }

  // if(dockGroupObject.x < 0){
  //   dockGroupObject.x = 0
  // }
  // if(dockGroupObject.x)

}

function changeDockUnitLengthToFt(DockLength){
  return DockLength / unitLenght
}
