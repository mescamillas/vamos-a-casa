const {Builder, By, Key, until} = require('selenium-webdriver');

(async function example() {
  let driver = await new Builder().forBrowser('chrome').build();
  //driver.manage().window().maximize();
  try {
    await driver.get('https://www.juegosinfantilespum.com/laberintos-online/12-auto-buhos.php');
    let canvas = await driver.findElement(By.id('canvas'));
    await driver.wait(function() {
        return driver.executeScript('return document.readyState').then(function(readyState) {
          return readyState === 'complete';
        });
      });
      
      setTimeout(async()=>{
        const actions = driver.actions();
        await actions.click(canvas).perform();
        await driver.executeAsyncScript(printCoords);
      },10000);

  }catch(error){
    console.log(error);
    driver.close();
  } finally {
  
  };

})();

function printCoords(){
    let car = this.AdobeAn.getComposition("961C296F70897F4AAEF666856D75D3AA").getStage().children[0].personaje;
    setTimeout(()=>{
      console.log(car.x,car.y);
      arguments[arguments.length - 1];
      printCoords();
    },500);
    
}