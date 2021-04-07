require('chromedriver');
const {Builder, By, until,Key} = require('selenium-webdriver');
const {createFilledMatrix, sleep, round, printMatrix} = require('./utility.js');
console.clear();

//constants
const WIDTH = 73;
const HEIGHT = 37;

const DIRECTION = {
  UP:0,
  RIGHT:1,
  DOWN:2,
  LEFT:3
}

const MARKER = {
  UNKNOWN: 0,
  EMPTY: 1,
  WALL: 2,
  OWL: 3,
  HOUSE: 4,
  CAR: 5
}

//globals
let agentInfo = {};
let mapMatrix;
let currentLevel;
let isLevelStart;
let orientation;
let currentSurroundings;
let previousSurroundings;
let currentPos;
let previousPos;

let driver;

;(async function main() {
  try {
    await startGame();
    while(currentLevel < 3){
      isLevelStart = true;
      while(currentLevel == await getLevel()){
        await perceive();
        await think();
        await act();
        await sleep(50);
      };
      currentLevel = await getLevel();
    }
    await sleep(5000);
  }catch(error){
    console.log("x: ",error); 
    driver.close();
  }finally{
    driver.close();
  }
})();

async function startGame(){
  await startDriver();
  currentLevel = await getLevel();
  agentInfo = await getOwlsAndHouses();
}

async function startDriver(){
  driver = await new Builder()
  .forBrowser('chrome')
  .build();
  //inicializacion del juego
  await driver.get('https://www.juegosinfantilespum.com/laberintos-online/12-auto-buhos.php');
  await driver.wait(until.elementIsNotVisible(driver.findElement(By.id("_preload_div_"))));
  let canvas = driver.findElement(By.id("canvas"));
  const actions = driver.actions();
  await actions.click(canvas).perform();
}

async function getLevel(){
  return await driver.executeScript(()=>{return exportRoot.currentFrame-1;});
}

async function getOwlsAndHouses(){
  return await driver.executeScript(function(){
    let game = this.AdobeAn.getComposition("961C296F70897F4AAEF666856D75D3AA").getStage().children[0];
    let houses = [{
        x : game.puerta.x,
        y : game.puerta.y
      },
      {
        x : game.puerta2.x,
        y : game.puerta2.y
      },
      {
        x : game.puerta3.x,
        y : game.puerta3.y
      }
    ];
    let owls = [[
      {x:game["o1"].x,y:game["o1"].y},{x:game["o2"].x,y:game["o2"].y},{x:game["o3"].x,y:game["o3"].y},{x:game["o4"].x,y:game["o4"].y}
    ],[
      {x:game["o1_b"].x,y:game["o1_b"].y},{x:game["o2_b"].x,y:game["o2_b"].y},{x:game["o3_b"].x,y:game["o3_b"].y},{x:game["o4_b"].x,y:game["o4_b"].y},{x:game["o5_b"].x,y:game["o5_b"].y}
    ],[
      {x:game["o1_c"].x,y:game["o1_c"].y},{x:game["o2_c"].x,y:game["o2_c"].y},{x:game["o3_c"].x,y:game["o3_c"].y},{x:game["o4_c"].x,y:game["o4_c"].y},{x:game["o5_c"].x,y:game["o5_c"].y}
    ]];
    return {houses, owls};
  })

}

//---- PERCEIVE ----

async function perceive(){
  if(isLevelStart){
    agentInfo.car = await getCarCoordinates();
    mapMatrix = createFilledMatrix(WIDTH, HEIGHT, MARKER.UNKNOWN);
    await drawMaze();
    await drawStaticElements();
    mapMatrix[agentInfo.car.roundY][agentInfo.car.roundX] = MARKER.CAR;
    currentPos = {x:agentInfo.car.roundX, y: agentInfo.car.roundY};
    previousPos = {x:agentInfo.car.roundX, y: agentInfo.car.roundY-1};
    isLevelStart = false;
  }
  agentInfo.car = await getCarCoordinates();
  orientation = await calculateOrientation();
  previousPos = Object.assign({}, currentPos);
  previousSurroundings = currentSurroundings;
  currentSurroundings = await senseSurroundings();
}



async function getCarCoordinates(){
  let car = await driver.executeScript(function(){
    let car = this.AdobeAn.getComposition("961C296F70897F4AAEF666856D75D3AA").getStage().children[0].personaje;
    return {x: car.x,y: car.y};

  });
  car.roundX = round(car.x)-1;
  car.roundY = round(car.y)-1;
  return car;
}

async function drawMaze(){
  let walls = await driver.executeScript(function(){
      return[this.AdobeAn.getComposition("961C296F70897F4AAEF666856D75D3AA").getStage().children[0].pared.shape.graphics._activeInstructions,
      this.AdobeAn.getComposition("961C296F70897F4AAEF666856D75D3AA").getStage().children[0].pared2.shape.graphics._activeInstructions,
       this.AdobeAn.getComposition("961C296F70897F4AAEF666856D75D3AA").getStage().children[0].pared3.shape.graphics._activeInstructions];
  })
  let list = walls[currentLevel];
  list.forEach((el)=>{
    if(el.x !== undefined && el.y !== undefined){
      el.X = round(el.x + 730/2);
      if(el.X == 73) el.X = 72;
      el.Y = round(367/2 - (el.y*-1));
      if(el.Y == 37) el.Y = 36;
    }
  })
  let isCloser = true;
  let closer;
  for(let i = 0; i < list.length-1 ; i++){
    if(list[i].x == undefined) continue;
    if(list[i+1].x == undefined){
      isCloser = true;
      let dx = Math.abs(list[i].X - closer.X);
      let dy = Math.abs(list[i].Y - closer.Y);
      if(dx !== 0){
        const min = Math.min(list[i].X, closer.X);
        const max = Math.max(list[i].X, closer.X);
        for(let horizontal = min; horizontal < max; horizontal++){
          mapMatrix[list[i].Y][horizontal] = MARKER.WALL;
        }
      }else if (dy !== 0){
        const min = Math.min(list[i].Y, closer.Y);
        const max = Math.max(list[i].Y, closer.Y);
        for(let vertical = min; vertical < max; vertical++){
          mapMatrix[vertical][list[i].X] = MARKER.WALL;
        }    
      }
      continue;
    };

    if(isCloser){
      closer = list[i];
      isCloser = false;
    }
    let currentElement = list[i];
    let nextElement = list[i+1];
    let dx = Math.abs(currentElement.X - nextElement.X);
    let dy = Math.abs(currentElement.Y - nextElement.Y);
    if(dx !== 0){
      const min = Math.min(currentElement.X, nextElement.X);
      const max = Math.max(currentElement.X, nextElement.X);
      for(let horizontal = min; horizontal < max; horizontal++){
        mapMatrix[currentElement.Y][horizontal] = MARKER.WALL;
      }
    }else if (dy !== 0){
      const min = Math.min(currentElement.Y, nextElement.Y);
      const max = Math.max(currentElement.Y, nextElement.Y);
      for(let vertical = min; vertical < max; vertical++){
        mapMatrix[vertical][currentElement.X] = MARKER.WALL;
      }    
    }

  }
}

async function drawStaticElements(){
  mapMatrix[round(agentInfo.houses[currentLevel].y)-1][round(agentInfo.houses[currentLevel].x)-1] = MARKER.HOUSE;
  goal = {x:round(agentInfo.houses[currentLevel].x)-1,y:round(agentInfo.houses[currentLevel].y)-1};
    
  for(let owl of agentInfo.owls[currentLevel]){
    for(let i = round(owl.y)-3; i <= round(owl.y)+1;i++) {
      mapMatrix[i][round(owl.x)-3] = MARKER.OWL;
      mapMatrix[i][round(owl.x)-2] = MARKER.OWL;
      mapMatrix[i][round(owl.x)-1] = MARKER.OWL;
      mapMatrix[i][round(owl.x)] = MARKER.OWL;
      mapMatrix[i][round(owl.x)+1] = MARKER.OWL;
      if(currentLevel == 1)
      mapMatrix[i][round(owl.x)+2] = MARKER.OWL;

    }
  }
}

async function calculateOrientation(){
  let dx = currentPos.x - previousPos.x;
  let dy = currentPos.y - previousPos.y;
  if(dx > 0) return DIRECTION.RIGHT;
  else if(dx < 0) return DIRECTION.LEFT;
  else if (dy > 0) return DIRECTION.DOWN;
  else if(dy < 0) return DIRECTION.UP;
  return DIRECTION.DOWN;
}

async function senseSurroundings(){
  let senses = [];
  //check up 
  if(mapMatrix[currentPos.y-1][currentPos.x] == MARKER.WALL || await isOwlOnPath(DIRECTION.UP))
    senses.push("UP");
  //check right
  if(mapMatrix[currentPos.y][currentPos.x+1] == MARKER.WALL || await isOwlOnPath(DIRECTION.RIGHT))
    senses.push("RIGHT");
  //check down
  if(mapMatrix[currentPos.y+1][currentPos.x] == MARKER.WALL || await isOwlOnPath(DIRECTION.DOWN))
    senses.push("DOWN");
  // check left
  if(mapMatrix[currentPos.y][currentPos.x-1] == MARKER.WALL || await isOwlOnPath(DIRECTION.LEFT))
    senses.push("LEFT"); 
  return senses;
}

async function isOwlOnPath(direction){
  switch(direction){
    case DIRECTION.UP:
      if(isOutOfBounds(currentPos.x-2,currentPos.y))
        return false;
      return mapMatrix[currentPos.y][currentPos.x-1] == MARKER.OWL
    case DIRECTION.RIGHT:
      if(isOutOfBounds(currentPos.x+2,currentPos.y))
        return false;
      return mapMatrix[currentPos.y][currentPos.x+1] == MARKER.OWL
    case DIRECTION.DOWN:
      if(isOutOfBounds(currentPos.x,currentPos.y+2))
        return false;
      return mapMatrix[currentPos.y+1][currentPos.x] == MARKER.OWL
    case DIRECTION.LEFT:
      if(isOutOfBounds(currentPos.x-2,currentPos.y))
        return false;
      return mapMatrix[currentPos.y][currentPos.x-1] == MARKER.OWL
  }
}

function isOutOfBounds(posX, posY){
  return posX > WIDTH-1 || posX < 0 || posY > HEIGHT-1 || posY < 0;
}

//--- THINK ---

async function think(){
  if(isStuck()){
    let dx = currentPos.x - agentInfo.car.roundX;
    let dy = currentPos.y - agentInfo.car.roundY;
    if(dx >= dy){
      for(let i = 0; i < Math.abs(dx); i++){
        let exp = -1;
        if(dx > 0) exp = 1;  
        await driver.executeScript(function(){this.AdobeAn.getComposition("961C296F70897F4AAEF666856D75D3AA").getStage().children[0].personaje.x+=(10*arguments[0]); return},[exp]);
      }
  
      for(let i = 0; i < Math.abs(dy); i++){
        let exp = -1;
        if(dy > 0) exp = 1;  
        await driver.executeScript(function(){this.AdobeAn.getComposition("961C296F70897F4AAEF666856D75D3AA").getStage().children[0].personaje.y+=(10*arguments[0]); return},[exp]);
      }
    } else {
      for(let i = 0; i < Math.abs(dy); i++){
        let exp = -1;
        if(dy > 0) exp = 1;  
        await driver.executeScript(function(){this.AdobeAn.getComposition("961C296F70897F4AAEF666856D75D3AA").getStage().children[0].personaje.y+=(10*arguments[0]); return},[exp]);
      }

      for(let i = 0; i < Math.abs(dx); i++){
        let exp = -1;
        if(dx > 0) exp = 1;  
        await driver.executeScript(function(){this.AdobeAn.getComposition("961C296F70897F4AAEF666856D75D3AA").getStage().children[0].personaje.x+=(10*arguments[0]); return},[exp]);
      }
    }
  }
  switch(orientation){
    case DIRECTION.UP:
      if(currentSurroundings.includes("UP")){
        if(currentSurroundings.includes("RIGHT"))orientation = DIRECTION.LEFT;
        else if(currentSurroundings.includes("LEFT")) orientation = DIRECTION.RIGHT;
      }else if (currentSurroundings.length == 0){
        if(previousSurroundings.includes("RIGHT"))
          orientation =DIRECTION.RIGHT;
        else if (previousSurroundings.includes("LEFT"))
          orientation = DIRECTION.LEFT; 
      }
      break;
      case DIRECTION.DOWN:
        if(currentSurroundings.includes("DOWN")){
          if(currentSurroundings.includes("RIGHT"))orientation = DIRECTION.LEFT;
          else orientation = DIRECTION.RIGHT;
        } else if (currentSurroundings.length == 0){
          if(previousSurroundings.includes("RIGHT")&& (!previousSurroundings.includes("UP")||!previousSurroundings.includes("LEFT")))
            orientation =DIRECTION.RIGHT;
          else if (previousSurroundings.includes("LEFT") && (!previousSurroundings.includes("UP")||!previousSurroundings.includes("RIGHT")))
            orientation = DIRECTION.LEFT; 
        }
        break;
    case DIRECTION.RIGHT:
      if(currentSurroundings.includes("RIGHT")){
        if(currentSurroundings.includes("DOWN"))orientation = DIRECTION.UP;
        else if(currentSurroundings.includes("UP")) orientation = DIRECTION.DOWN;
      } else if (currentSurroundings.length == 0){
        if(previousSurroundings.includes("UP") && (!previousSurroundings.includes("DOWN")||!previousSurroundings.includes("LEFT"))){
          orientation =DIRECTION.UP;
        }
        else if (previousSurroundings.includes("DOWN"))
          orientation = DIRECTION.DOWN; 
      }
      break;
    case DIRECTION.LEFT:
      if(currentSurroundings.includes("LEFT")){
        if(currentSurroundings.includes("DOWN"))orientation = DIRECTION.UP;
        else if(currentSurroundings.includes("UP")) orientation = DIRECTION.DOWN;
      } else if (currentSurroundings.length == 0){
        if(previousSurroundings.includes("UP"))
          orientation =DIRECTION.UP;
        else if (previousSurroundings.includes("UP") && (!previousSurroundings.includes("RIGHT")||!previousSurroundings.includes("LEFT")))
          orientation = DIRECTION.DOWN; 
      }
      break;
  }
}

function isStuck(){
  if(Math.abs(agentInfo.car.roundX - currentPos.x) > 2
  || Math.abs(agentInfo.car.roundY - currentPos.y) > 2)
    return true;
  return false;
}

//--- ACT ---

async function act(){
  await move(orientation);
}

async function move(direction, time=5) {
  mapMatrix[currentPos.y][currentPos.x] = MARKER.EMPTY;
  switch(direction){
    case DIRECTION.UP:
      currentPos.y-=1;
      mapMatrix[currentPos.y][currentPos.x] = MARKER.CAR;
      await driver.executeScript(function(){this.AdobeAn.getComposition("961C296F70897F4AAEF666856D75D3AA").getStage().children[0].personaje.y-=10; return});
      break;
    case DIRECTION.DOWN:
      currentPos.y+=1;
      mapMatrix[currentPos.y][currentPos.x] = MARKER.CAR;
      await driver.executeScript(function(){this.AdobeAn.getComposition("961C296F70897F4AAEF666856D75D3AA").getStage().children[0].personaje.y+=10; return});
      break;
    case DIRECTION.LEFT:
      currentPos.x-=1;
      mapMatrix[currentPos.y][currentPos.x] = MARKER.CAR;
      await driver.executeScript(function(){this.AdobeAn.getComposition("961C296F70897F4AAEF666856D75D3AA").getStage().children[0].personaje.x-=10;return});
      break;
    case DIRECTION.RIGHT:
      currentPos.x+=1;
      mapMatrix[currentPos.y][currentPos.x] = MARKER.CAR;
      await driver.executeScript(function(){this.AdobeAn.getComposition("961C296F70897F4AAEF666856D75D3AA").getStage().children[0].personaje.x+=10; return});
      break;
  }
}