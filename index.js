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
    //driver.actions().mouseDown(canvas).mouseUp(canvas).perform();
    await driver.actions().mouseMove(element).mouseUp().mouseDown().perform();
    await driver.executeScript(printCoords);
    // await driver.wait(until.titleIs('webdriver - Google Search'), 1000);
  }catch(error){
    console.log(error);
    // driver.close();
  } finally {
  
  };

})();

function printCoords(){
    let car = this.AdobeAn.getComposition("961C296F70897F4AAEF666856D75D3AA").getStage().children[0].personaje;
    while(true){
        console.log(car.x, car.y);
    }
}