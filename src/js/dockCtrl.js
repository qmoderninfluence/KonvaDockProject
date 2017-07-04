function createDockGroup(dockName){
  var dockGroupLastDist = 0;
  var dockGroupStartScale = 1;
  var simpleText = null
  var dockGroup = new Konva.Group({
    width: htmlDivWidth / 25,
    height: htmlDivWidth / 25,
    angle: 0,
    draggable: true,
    name:dockName
  });
  dockGroupBUffer.push(dockGroup)
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
  dockGroupTouchAndDrag(dockGroup,dockGroupLastDist)
  layer.add(dockGroup);
  dockGroup.setZIndex(1)
}

function dockGroupTouchAndDrag(dockGroupObject, dockGroupLastDt){
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
        if(!dockGroupLastDt) {
          dockGroupLastDt = dist;
        }
        var scale = object.target.attrs.scaleX * dist / dockGroupLastDt;
        object.target.attrs.scaleX = scale;
        object.target.attrs.scaleY = scale;

        dockGroupLastDt = dist;
        dockGroupMovingAndScaling(object.target.attrs)
        dockGroupObject.children[1].setText(changeDockUnitLengthToFt(object.target.attrs.width * object.target.attrs.scaleX) + "'" + "*"
          +changeDockUnitLengthToFt(object.target.attrs.height * object.target.attrs.scaleY) + "'");
      }
    }
    layer.draw();
  });

  dockGroupObject.on('touchend', function(object) {
    dockGroupLastDist = 0;
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

  // A---------D
  // |         |
  // |         |
  // |         |
  // B --------C
  if(dockGroupObject.angle < 90){
    //left boundry, Point B
    if((dockGroupObject.x - Math.sin(Math.PI / changeAngleToRadians(dockGroupObject.angle)) * dockGroupObject.height * dockGroupObject.scaleY) < 0){
      dockGroupObject.x =  Math.sin(Math.PI / changeAngleToRadians(dockGroupObject.angle)) * dockGroupObject.height * dockGroupObject.scaleY
    }

    // top boundry, point A
    if(dockGroupObject.y < 0){
      dockGroupObject.y = 0
    }

    //right boundry, point D
    if((dockGroupObject.x + Math.cos(Math.PI / changeAngleToRadians(dockGroupObject.angle)) * dockGroupObject.width * dockGroupObject.scaleX) > stage.attrs.width){
      dockGroupObject.x = stage.attrs.width - Math.cos(Math.PI / changeAngleToRadians(dockGroupObject.angle)) * dockGroupObject.width * dockGroupObject.scaleX;
    }

    //bottom boundry. point C
    var ac = getSqrt(Math.pow(dockGroupObject.width * dockGroupObject.scaleX, 2) + Math.pow(dockGroupObject.height * dockGroupObject.scaleY, 2));
    var angleBAC = Math.acos(dockGroupObject.height * dockGroupObject.scaleY / ac);
    var angleTarget = angleBAC - Math.PI / changeAngleToRadians(dockGroupObject.angle);
    var pointDY = Math.cos(angleTarget) * ac
    if(dockGroupObject.y + pointDY > stage.attrs.height){
      dockGroupObject.y = stage.attrs.height - pointDY
    }

  }
  else if(dockGroupObject.angle < 180){
    //left boundry, point C
    var ca = getSqrt(Math.pow(dockGroupObject.width * dockGroupObject.scaleX, 2) + Math.pow(dockGroupObject.height * dockGroupObject.scaleY, 2));
    var angleCAD = Math.acos(dockGroupObject.width * dockGroupObject.scaleX / ca);
    var targetAngle = angleCAD + (Math.PI / changeAngleToRadians(dockGroupObject.angle) - Math.PI / changeAngleToRadians(90));
    var pointCX = Math.sin(targetAngle) * ca;
    if(dockGroupObject.x - pointCX < 0){
      dockGroupObject.x = pointCX;
    }

    //top boundry, point B
    var targetBAngle = 90 - (dockGroupObject.angle - 90);
    console.log("targetBAngle",targetBAngle);
    var targetBY = Math.cos(Math.PI / changeAngleToRadians(targetBAngle)) * dockGroupObject.height * dockGroupObject.scaleY;
    console.log("targetBY",targetBY);
    if(dockGroupObject.y - targetBY < 0){
      dockGroupObject.y = targetBY;
    }

    //right boundry, point A
    if(dockGroupObject.x > stage.attrs.width){
      dockGroupObject.x = stage.attrs.width;
    }

    //bottom boundry, point
    var pointDY = Math.cos(Math.PI / changeAngleToRadians(dockGroupObject.angle - 90)) * dockGroupObject.width * dockGroupObject.scaleX;
    if(dockGroupObject.y + pointDY > stage.attrs.height){
      dockGroupObject.y = stage.attrs.height - pointDY;
    }

  }
  else if(dockGroupObject.angle < 270){
    var pointDX = Math.cos(Math.PI / changeAngleToRadians(dockGroupObject.angle - 180)) * dockGroupObject.width * dockGroupObject.scaleX;
    if(dockGroupObject.x - pointDX < 0){
      dockGroupObject.x = pointDX;
    }
  }
  // else if(dockGroupObject.angle < 270){
  //   //left boundry, point D
  //   if(dockGroupObject.x - Math.cos(Math.PI / changeAngleToRadians(dockGroupObject.angle) - Math.PI / changeAngleToRadians(180)) *
  //     dockGroupObject.width * dockGroupObject.scaleX < 0){
  //       console.log("asd",Math.cos(Math.PI / changeAngleToRadians(dockGroupObject.angle) - Math.PI / changeAngleToRadians(180)) *
  //         dockGroupObject.width * dockGroupObject.scaleX)
  //       dockGroupObject.x = Math.cos(Math.PI / changeAngleToRadians(dockGroupObject.angle) - Math.PI /changeAngleToRadians(180)) *
  //         dockGroupObject.width * dockGroupObject.scaleX
  //     }
  // }
    //
    // if(dockGroupObject.y < 0){
    //   dockGroupObject.y = 0
    // }

    // if(dockGroupObject.x < 0){
    //   dockGroupObject.x = 0
    // }
  // if(dockGroupObject.y < 0){
  //   dockGroupObject.y = 0
  // }
  // if(dockGroupObjectRight > stage.attrs.width){
  //   dockGroupObject.x = stage.attrs.width - dockGroupObjectObjectWidth
  // }
  // if(dockGroupObjectBottom > stage.attrs.height){
  //   dockGroupObject.y = stage.attrs.height - dockGroupObjectObjectHeight
  // }

  // if(dockGroupObject.x < 0){
  //   dockGroupObject.x = 0
  // }
  // if(dockGroupObject.x)

}
function changeAngleToRadians(angle){
  return 180 / angle
}
function changeDockUnitLengthToFt(DockLength){
  return DockLength / unitLenght
}
