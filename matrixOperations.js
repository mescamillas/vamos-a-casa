/**
 * Creates a flood matrix of the specified width and height (1-indexed) with 
 * the center at posX, posY (0-indexed)
 * @param {*} posX 
 * @param {*} posY 
 * @param {*} width 
 * @param {*} height 
 * @returns 
 */
// function createFloodMatrix(posX, posY, width, height){
//     let floodMatrix = createFilledMatrix(width, height);

//     function isOutOfBounds(posX, posY){
//         return posX > width-1 || posX < 0 || posY > height-1 || posY < 0;
//     }

//     function floodFill(posX, posY, value){
//         if(isOutOfBounds(posX, posY)){
    
//             return;
//         }
//         if(floodMatrix[posY][posX] !== 0 && floodMatrix[posY][posX] <= value && floodMatrix[posY][posX] !== -1 ){
//             return;
//         }
        
//         if(floodMatrix[posY][posX] !== -1){
//             floodMatrix[posY][posX] = value;
//         }
    
//         floodFill(posX+1, posY, value+1);
//         floodFill(posX-1, posY, value+1);
//         floodFill(posX, posY+1, value+1);
//         floodFill(posX, posY-1, value+1);
        
//         return;
//     }
    
//     floodMatrix[posY][posX] = -1;
//     floodFill(posX, posY, 0);
//     return floodMatrix;
// }

function createFilledMatrix(width, height, fill = 0){
    let matrix = [];

    for(var h=0; h<height; h++) {
    matrix[h] = [];
        for(var w=0; w<width; w++) {
            matrix[h][w] = fill;
        }
    }

    return matrix;
}

module.exports = {createFilledMatrix};