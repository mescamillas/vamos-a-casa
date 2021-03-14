require('chromedriver');
const {Builder, By, until} = require('selenium-webdriver');

let agentInfo = {};
let carInterval = true;

;(async function initialPerception() {
  let driver = await new Builder()
  .forBrowser('chrome')
  .build();
  try {
    //inicializacion del juego
    await driver.get('https://www.juegosinfantilespum.com/laberintos-online/12-auto-buhos.php');
    await driver.wait(until.elementIsNotVisible(driver.findElement(By.id("_preload_div_"))));
    let canvas = driver.findElement(By.id("canvas"));
    const actions = driver.actions();
    await actions.click(canvas).perform();

    //obtener los buhos y casas de cada nivel
    agentInfo = await driver.executeScript(getOwlsAndHouses);

    //actualizar de las coords del carro cada 200 ms
    setInterval(async function(){
      if(carInterval)
        agentInfo.car = await driver.executeScript(getCarCoordinates);
      else 
        clearInterval(this);
    }, 200);

  }catch(error){
    console.log(error); 
  }
})();

function getOwlsAndHouses(){
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
}


function getCarCoordinates(){
    let car = this.AdobeAn.getComposition("961C296F70897F4AAEF666856D75D3AA").getStage().children[0].personaje;
    console.log(car.x, car.y);
    return {x: car.x,y: car.y};
}