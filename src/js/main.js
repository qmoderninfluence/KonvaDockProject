var stage = new Konva.Stage({
  container: 'divMainCanvas',
  width: htmlDivWidth,
  height: htmlDivWidth
});

var backgroundScale = 1;

var backgroundGroup = new Konva.Group({
  width: htmlDivWidth,
  height: htmlDivWidth,
  angle: 0,
  draggable: true,
  listening: false
});

var isGroupSelection = false
var unitLenght = stage.attrs.width / 100
var lastDist = 0;
var startScale = 1;


 var dockGroupBUffer = [];

var backgroundImage = null
var layer = new Konva.Layer();
var rotationObject = null;


createDockGroup("dock 1")
createDockGroup("dock 2")

function drawImage(imageObj){
  backgroundImage = new Konva.Image({
    image: imageObj,
    x: 0,
    y: 0,
    width: htmlDivWidth,
    height: htmlDivWidth,
    name: "background",
    draggable: true,

  })
  backgroundGroup.add(backgroundImage)
  layer.add(backgroundGroup);


}

///

///



function backgroundMovingAndScaling(backgroundObject){
  //TO DO
  var backgroundObjectWidth = backgroundObject.width * backgroundObject.scaleX;
  var backgroundObjectHeight = backgroundObject.height * backgroundObject.scaleY;

  var backgroundObjectRight = backgroundObject.x + backgroundObjectWidth;
  var backgroundObjectBottom = backgroundObject.y + backgroundObjectHeight;
  var backgroundObjectScaleX = backgroundObject.width * backgroundObject.scaleX/ stage.attrs.width

  //scaling
  if(backgroundObject.scaleX < 2){
    if(backgroundObject.scaleX < 1){
      backgroundObject.scaleX = 1;
      backgroundObject.scaleY = backgroundObject.scaleX
    }
  }
  else{
    backgroundObject.scaleX = 2
    backgroundObject.scaleY = 2
  }

  //moving
  if(backgroundObject.x > 0){
    backgroundObject.x = 0
  }
  if(backgroundObject.y > 0){
    backgroundObject.y = 0
  }
  if(backgroundObjectRight < stage.attrs.width){
    backgroundObject.x = stage.attrs.width * (1 - backgroundObject.scaleX)
  }
  if(backgroundObjectBottom < stage.attrs.height){
    backgroundObject.y = stage.attrs.height * (1 - backgroundObject.scaleY)
  }

}

var imageObj = new Image();
imageObj.onload = function() {
  drawImage(this);
  layer.draw();
};
imageObj.src = '/assets/Billy Docks.svg';

stage.add(layer);
      // add the shape to the layer

//
stage.on('touchmove dragmove' ,function(object){

  backgroundMovingAndScaling(object.target.attrs)

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
      if(!lastDist) {
        lastDist = dist;
      }
      var scale = object.target.attrs.scaleX * dist / lastDist;
      backgroundScale = scale
      object.target.attrs.scaleX = scale;
      object.target.attrs.scaleY = scale;
      //layer.draw();

      lastDist = dist;
    }
  }
  backgroundMovingAndScaling(object.target.attrs)

  layer.draw();
})

stage.on('touchend', function(object) {
  lastDist = 0;


  dockGroupBUffer[0].attrs.scaleX =  backgroundScale;
  console.log("dockGroupBUffer",dockGroupBUffer[0])
console.log("object",object)
console.log("touchend",layer)
  layer.draw();
});


backgroundGroup.setZIndex(0);
//



stage.on('touchstart mousedown', function(object) {
  rotationObject = object.target.parent;
})

$("#selectAll").click(function(){
  if(isGroupSelection === false){
    isGroupSelection = true;
    console.log("stage",layer)


    backgroundGroup.setListening(true);

    layer.draw();
    $("#selectAll").attr("disabled",true);
    $("#unSelectAll").attr("disabled",false);

  }
});

$("#unSelectAll").click(function(){
   if(isGroupSelection === true){
     isGroupSelection = false;
     backgroundGroup.setListening(false);
     layer.drawHit();
     $("#selectAll").attr("disabled",false);
     $("#unSelectAll").attr("disabled",true);
    }
    layer.draw();
});
$("#rotate").click(function () {
  rotationObject.rotate(parseInt(500 * Math.PI / 180));
  rotationObject.attrs.angle += parseInt(500 * Math.PI / 180)
  layer.draw();
  console.log("rotationObject",rotationObject)
});
