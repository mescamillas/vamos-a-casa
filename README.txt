Integrantes:
- Lorraine Jazlady Rojas Parra
- Marcelo Escamilla Sanchez
- Andres Duvan Chaves Mosquera

Instrucciones para correr: 
- Para correr este programa es necesario tener Nodejs v14 o superior.
- Una vez instalado, correr el comando "npm install" en la raiz del proyecto
para instalar las librerias necesarias.
- Para correr el programa, se usa el comando "node ." en la raiz del proyecto.
- El programa imprimira constantemente las coordenadas del carro tanto en 
la consola del navegador como en la consola de node.

El programa utiliza selenium, una libreria de automatizacion de navegadores
normalmente utilizado para correr pruebas. Sin embargo, esta libreria permite
un gran control sobre un navegador de forma programatica.

En esta oportunidad, utilizamos selenium para poder obtener informacion del juego
por medio de injeccion de codigo. Tambien fue necesario generar una salida inicial en 
forma de click para iniciar el juego. 

Tanto los buhos como las casas son objetos estaticos, por lo que solo es necesario obtener 
sus coordenadas al inicio del juego. Mientras que el carro, al tener la posibilidad de 
movimiento, debe actualizarse su posicion a lo largo del tiempo. 

Todas estas variables las guardamos en el objeto global agentInfo de esta manera:

- agentInfo.owls guarda las coordenadas de todos los buhos. Es un arreglo cuyos elementos
son un arreglo por nivel, cada uno guarda las coordenadas de los buhos correspondientes al nivel.

- agentInfo.houses es un arreglo que contiene las coordenadas de las tres casas.

- agentInfo.car contiene las coordenadas del auto en un momento dado. Para demostrar como se actualiza,
hemos implementado un intervalo el cual cada 200 ms obtiene las coordenadas actuales del carro.
Sin embargo, esposible que cuando implementemos el agente, se utilice otro metodo de actualizacion. 