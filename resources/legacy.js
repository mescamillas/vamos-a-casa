
function setMarker(direction, marker){
    //console.log(direction, marker);
    switch(direction){
      case DIRECTION.UP:
        for(let i = agentInfo.car.roundX-2 ; i <= agentInfo.car.roundX+2;i++){
          mapMatrix[agentInfo.car.roundY-3][i] = marker;
        }
  
        break;
      case DIRECTION.RIGHT:
        for(let i = agentInfo.car.roundY-2 ; i <= agentInfo.car.roundY+2;i++)
          mapMatrix[i][agentInfo.car.roundX+3] = marker;
      break;
      case DIRECTION.DOWN:
        for(let i = agentInfo.car.roundX-2 ; i <= agentInfo.car.roundX+2;i++)
        mapMatrix[agentInfo.car.roundY+3][i] = marker;
      break;
      case DIRECTION.LEFT:
        for(let i = agentInfo.car.roundY-2 ; i <= agentInfo.car.roundY+2;i++)
          mapMatrix[i][agentInfo.car.roundX-3] = marker;
    }
  }
  
  async function canMove(direction){
    let currentCoords = Object.assign({},agentInfo.car);
    let hasMoved = false;
    if(await isOwlOnPath(direction)){
      console.log("owl on path");
      return hasMoved;
    }
    await move(direction);
    if(direction == DIRECTION.LEFT || direction == DIRECTION.RIGHT){
      //console.log(direction, agentInfo.car, currentCoords, Math.abs(currentCoords.x - agentInfo.car.x));
      if(Math.abs(currentCoords.x - agentInfo.car.x) >= 10){
        await move(oppositeDirection(direction));
        hasMoved = true;
      }
    }else if (direction == DIRECTION.UP || direction == DIRECTION.DOWN){
      //console.log(direction, agentInfo.car, currentCoords, Math.abs(currentCoords.y - agentInfo.car.y) );
      if(Math.abs(currentCoords.y - agentInfo.car.y) >= 10){
        await move(oppositeDirection(direction));
        hasMoved = true;
      }
    }
    return hasMoved;  
  }
  
  async function isOwlOnPath(direction){
    switch(direction){
      case DIRECTION.UP:
        if(isOutOfBounds(agentInfo.car.roundX-3,agentInfo.car.roundY))
          return false;
        return mapMatrix[agentInfo.car.roundY][agentInfo.car.roundX-3] == MARKER.OWL;
      case DIRECTION.RIGHT:
        if(isOutOfBounds(agentInfo.car.roundX+3,agentInfo.car.roundY))
          return false;
        return mapMatrix[agentInfo.car.roundY][agentInfo.car.roundX+3] == MARKER.OWL;
      case DIRECTION.DOWN:
        if(isOutOfBounds(agentInfo.car.roundX,agentInfo.car.roundY+3))
          return false;
        return mapMatrix[agentInfo.car.roundY+3][agentInfo.car.roundX] == MARKER.OWL;
      case DIRECTION.LEFT:
        if(isOutOfBounds(agentInfo.car.roundX-3,agentInfo.car.roundY))
          return false;
        return mapMatrix[agentInfo.car.roundY][agentInfo.car.roundX-3] == MARKER.OWL;
    }
  }
  
  function oppositeDirection(direction){
    switch(direction){
      case DIRECTION.UP:
        return DIRECTION.DOWN;
  
      case DIRECTION.DOWN:
        return DIRECTION.UP;
  
      case DIRECTION.LEFT:
        return DIRECTION.RIGHT;
  
      case DIRECTION.RIGHT:
        return DIRECTION.LEFT;
    }
  }

  function isOutOfBounds(posX, posY){
    //console.log(`outOfBounds ${posX}, ${posY}:`, posX > WIDTH-1 || posX < 0 || posY > HEIGHT-1 || posY < 0);
    return posX > WIDTH-1 || posX < 0 || posY > HEIGHT-1 || posY < 0;
  }