Integrantes:
- Lorraine Jazlady Rojas Parra
- Marcelo Escamilla Sanchez
- Andres Duvan Chaves Mosquera

Instrucciones para correr: 
- Para correr este programa es necesario tener Nodejs v14 o superior.
- Una vez instalado, correr el comando "npm install" en la raiz del proyecto
para instalar las librerias necesarias.
- Para correr el programa, se usa el comando "node ." en la raiz del proyecto.
- El programa abrira un navegador y resolvera los laberintos.

El programa utiliza selenium, una libreria de automatizacion de navegadores
normalmente utilizado para correr pruebas. Sin embargo, esta libreria permite
un gran control sobre un navegador de forma programatica.

El programa utiliza el algoritmo de wall follower para resolver los laberintos.
Se implementaron los metodos percibir, pensar ya actuar para la solucion. Al empezar
cada laberinto, se genera una representacion matricial y se sigue el muro del lado derecho
hasta llegar al objetivo. Debido a limitaciones de memoria, la matriz esta en escala 1:10, por 
lo que es necesario que el programa verifique constantemente que las coordenadas de la representacion
matricial y del juego no se alejen demasiado. 