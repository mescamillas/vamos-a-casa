//	width: 730
//	height: 367
require('chromedriver');
let fs = require('fs');
const {Builder, By, until,Key} = require('selenium-webdriver');
const {createFilledMatrix} = require('./matrixOperations.js');
console.clear();

//constantes
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

//globales
let agentInfo = {};
let mapMatrix;
let currentLevel;
let isLevelStart = true;

let driver;

;(async function main() {
  try {
    await startGame();
    while(currentLevel === await getLevel()){
      await perceive();
      await think();
      await act();
      printMatrix(mapMatrix, `map${currentLevel}.txt`);
      break;
    }


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
  agentInfo.car = await getCarCoordinates();

}

async function perceive(){
  if(isLevelStart){
    mapMatrix = createFilledMatrix(WIDTH, HEIGHT, MARKER.UNKNOWN);
    await drawMaze();
    await drawStaticElements();
    mapMatrix[agentInfo.car.roundY][agentInfo.car.roundX] = MARKER.CAR;
    console.log(agentInfo.car)
    isLevelStart = false;
  }
}

async function think(){

}

async function act(){

}


function printMatrix(matrix, filename){
  var file = fs.createWriteStream(filename);
  matrix.forEach(value => file.write(`${value}\r\n`));
  file.end();
}

async function move(direction, time=50) {
  //const actions = driver.actions();
  switch(direction){
    case DIRECTION.UP:
      //await driver.actions().keyDown(Key.ARROW_UP).pause(time).keyUp(Key.ARROW_UP).perform();
      await driver.executeScript(function(){this.AdobeAn.getComposition("961C296F70897F4AAEF666856D75D3AA").getStage().children[0].personaje.y-=10; return});
      //ORIENT = direction;
      break;
    case DIRECTION.DOWN:
      //await driver.actions().keyDown(Key.ARROW_DOWN).pause(time).keyUp(Key.ARROW_DOWN).perform();
      await driver.executeScript(function(){this.AdobeAn.getComposition("961C296F70897F4AAEF666856D75D3AA").getStage().children[0].personaje.y+=10; return});
      //ORIENT = direction;
      break;
    case DIRECTION.LEFT:
      //await driver.actions().keyDown(Key.ARROW_LEFT).pause(time).keyUp(Key.ARROW_LEFT).perform();
      await driver.executeScript(function(){this.AdobeAn.getComposition("961C296F70897F4AAEF666856D75D3AA").getStage().children[0].personaje.x-=10; return});
      //ORIENT = direction;
      break;
    case DIRECTION.RIGHT:
      //await driver.actions().keyDown(Key.ARROW_RIGHT).pause(time).keyUp(Key.ARROW_RIGHT).perform();
      await driver.executeScript(function(){this.AdobeAn.getComposition("961C296F70897F4AAEF666856D75D3AA").getStage().children[0].personaje.x+=10; return});
      //ORIENT = direction;
      break;
  }
  //await setCar();
  agentInfo.car = await getCarCoordinates();
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

async function getCarCoordinates(){
  let car = await driver.executeScript(function(){
    let car = this.AdobeAn.getComposition("961C296F70897F4AAEF666856D75D3AA").getStage().children[0].personaje;
    return {x: car.x,y: car.y};

  });
  car.roundX = round(car.x)-1;
  car.roundY = round(car.y)-1;
  return car;
}

async function getLevel(){
  return await driver.executeScript(()=>{return exportRoot.currentFrame-1;});
}

function round(num) {
  return Math.round(num / 10);
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
    
  for(let owl of agentInfo.owls[currentLevel]){
    for(let i = round(owl.y)-2; i <= round(owl.y);i++) {
      mapMatrix[i][round(owl.x)-2] = MARKER.OWL;
      mapMatrix[i][round(owl.x)-1] = MARKER.OWL;
      mapMatrix[i][round(owl.x)] = MARKER.OWL;
    }
  }
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