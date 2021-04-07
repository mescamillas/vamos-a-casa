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

function round(num) {
    return Math.round(num / 10);
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
function printMatrix(matrix, filename){
    let fs = require('fs');
    var file = fs.createWriteStream(filename);
    matrix.forEach(value => file.write(`${value}\r\n`));
    file.end();
}

module.exports = {createFilledMatrix, sleep, round, printMatrix};