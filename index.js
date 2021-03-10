const {Builder, By, Key, until} = require('selenium-webdriver');

let agentInfo = {};

(async function example() {
  let driver = await new Builder().forBrowser('chrome').build();
  //driver.manage().window().maximize();
  try {
    await driver.get('https://www.juegosinfantilespum.com/laberintos-online/12-auto-buhos.php');
    await driver.wait(until.elementIsNotVisible(driver.findElement(By.id("_preload_div_"))));
    let canvas = driver.findElement(By.id("canvas"));
    const actions = driver.actions();
    await actions.click(canvas).perform();
    agentInfo = await driver.executeScript(getStaticElements);
    console.log(agentInfo.owls);
    await driver.executeAsyncScript(printCoords);

  }catch(error){
    console.log(error);
    driver.close();
  } finally {
    
  };

})();

function getStaticElements(){
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


function printCoords(){
    let car = this.AdobeAn.getComposition("961C296F70897F4AAEF666856D75D3AA").getStage().children[0].personaje;
    setTimeout(()=>{
      console.log(car.x, car.y);
      printCoords();
      arguments[arguments.length - 1];
    },500);
}