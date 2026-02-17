# LYNX - PATH FINDER

## Estructura del proyecto

Se esta utilizando una arquitectura de 3 capas:

```
   src
    ├── app.js
    ├── application
    │   └── services
    │       ├── mapService.js
    │       ├── obstacleService.js
    │       ├── routeService.js
    │       ├── userService.js
    │       └── waypointService.js
    ├── infrastructure
    │   ├── prisma.js
    │   └── repositories
    │       ├── mapRepository.js
    │       ├── obstacleRepository.js
    │       ├── routeRepository.js
    │       ├── userRepository.js
    │       └── waypointRepository.js
    ├── middlewares
    ├── presentation
    │   ├── controllers
    │   │   ├── mapsController.js
    │   │   ├── obstacleController.js
    │   │   ├── routeController.js
    │   │   ├── userController.js
    │   │   └── waypointController.js
    │   └── routes
    │       ├── mapRoutes.js
    │       ├── obstacleRoutes.js
    │       ├── routeRoutes.js
    │       ├── userRoutes.js
    │       └── waypointRoutes.js
    ├── server.js
    ├── tests
    └── utils
```

## Base de datos

![alt text](documents/database_schema.png)

## Inicializar el proyecto

```bash
npm init -y
```

## Herraminetas necesarias:

### Express:

```bash
npm install express
```
### Dotenv

```bash
npm install dotenv
```

### Base de datos (PostgreSQL):
```bash
npm install pg pg-hstore
```

### Prisma ORM:
Instalacion:

Instalar el CLI de Prisma como dependencia de desarrollo
```bash
npm install -D prisma
```

Instalar el Cliente de Prisma como dependencia de producción
```bash
npm install @prisma/client
```

Inicializar prisma:
```bash
npx prisma init
```

Generar tablas en el contenedor PostgreSQL:
```bash
npx prisma migrate dev --name init_db
```

Generar el Cliente:
```bash
npx prisma generate
```

Inicializar prisma studio:
```bash
npx prisma studio
```

Si la base de datos ya existe solo se debe realizar la generacion del cliente y posteriormente actualizar la base de datos a la estrcutura que ya definimos:

```bash
npx prisma db push
```
### Testing

```bash
npm install --save-dev jest @jest/globals
```

## Monads

Se decidio aplicar monads en lugar de functoes porque los monads permiten encadenar operaciones que pueden fallar, como validaciones o llamados a repositorios, esta implementacion perminet un flujo de ejecucion claro. A diferencia de los functoes los monads permiten aplanar resultados con "chain".

Implementacion de monad result:
```js
const Result = (isOk, value) => ({
  isOk,
  isError: !isOk,
  value
});

export const Ok = (value) => Result(true, value);
export const Error = (error) => Result(false, error);

const map = (fn) => (result) =>
  result.isOk
    ? Ok(fn(result.value))
    : result;

const chain = (fn) => (result) =>
  result.isOk
    ? fn(result.value)
    : result;

const fold = (onError, onOk) => (result) =>
  result.isOk
    ? onOk(result.value)
    : onError(result.value);

export const ResultMonad = {
  Ok,
  Error: Error,
  map,
  chain,
  fold
};

export const fromPromise = async (fn) => {
  try {
    return Ok(await fn());
  } catch (error) {
    return Error(error);
  }
};
```
- Result: Guarda un valor y le asigna una etiqueta dependiendo si todo se proceso con exito o hubo algun error.
- map y chain: son las que deciden si una funcion se ejecuta o no, si se tiene la etiqueta de "ok" se aplica la funcion al valor y genera un nuevo resultado,  por el contrario si existe un error se ignora.
- fold: saca el valor de la "caja" para eso hay que definir 2 caminos, que hacer en caso de error y que hacer en caso de success.
- fromPromise: encapsula las operaciones try catch en un solo lugar y se encarga de convertir opreaciones asinconas basadas en promesas.

## Principios SOLID

### SRP:

Cada archivo y funcion tiene una responsabilidad unica como **customError**. **customSuccess**, que solo tienen la responsablidada de manejar mensaje de error o success respectivamente, o **baseRepository** que tiele la unica responsabilidad de comunicarse con el ORM, mientras que los repositorios especificos (userRepository, mapRepository, etc) se encargan de mapear los datos del dominio, **entityRules** solo se encarga de cconstruir reglas de validacion para los datos instroducidos, el algoritmo A* se simplifico para que se enfoque unicamente en la logica de busqueda.

- Ejemplo de aplicacion del principio :

```js
export const manhattanDistance = (from, to) =>
  Math.abs(from.x - to.x) + Math.abs(from.y - to.y);

export const euclideanDistance = (from, to) =>
  Math.sqrt(Math.pow(from.x - to.x, 2) + Math.pow(from.y - to.y, 2));
```
En **heuristics** creamos pequeñas funciones para las distancias. Así, el algoritmo no sabe cómo se calcula la distancia, solo sabe que debe usar una función.

### OCP:

Se implemeto este principio para que los modulos sean abiertos a nuevas implementaciones pero cerrados a modificaiones, como **userRepository** que implementa el contrato de **baseRepository** pero se le implemento nuevas funciones para encontrar usarios por email y username sin la necesidad de modificar su codigo existente, o **etityRules** y los **...DataValidator** en los cuales se puede agregar mas validaciones sin la necesidad de modificar las existentes.

- Ejemplo de implementacion del principio:

```js
const customSuccess = (statusCode) => (res) => (message) => (data = {}) => {
  res.status(statusCode).json({
    message,
    data
  });
};

export const completedSuccessfully = customSuccess(200);
export const createdSuccessfully = customSuccess(201);
export const acceptedSuccessfully = customSuccess(202);
export const deletedSuccessfully = customSuccess(204);
```
 **customError** esta cerrado a modificaciones, no es necesario tocar la logica de customError para agregar nuevos tipos de error, y esta abierto a extension si en que se necesitara crear nuevos errores como por ejemplo un InternalServerError 500. 

### LSP:

Se refactorizó el acceso a datos creando un baseRepository funcional. Se garantiza que cualquier repositorio especializado (Map, Route, User) sea sustituible por otro. Al mantener firmas de métodos consistentes y tipos de retorno predecibles (objetos o nulos), las capas superiores pueden intercambiar implementaciones de persistencia sin alterar el flujo de la aplicación

```js
import prisma from '../prisma.js';

export const createRecord = (entity, data, include = {}) => 
  prisma[entity].create({ data, include });

export const findUniqueRecord = (entity, id, include = {}) => 
  prisma[entity].findUnique({ where: { id }, include });

export const updateRecord = (entity, id, data, include = {}) => 
  prisma[entity].update({ where: { id }, data, include });

export const deleteRecord = (entity, id) => 
  prisma[entity].delete({ where: { id } });
```

### ISP:

Se aplicó ISP en la capa de validación descomponiendo el validador de entidades en reglas atómicas reutilizables. Esto permitió segregar las interfaces de validación por dominio (Map, User, etc.), asegurando que cada módulo de validación solo conozca las reglas pertinentes a su entidad y facilitando la extensión del sistema sin afectar otros componentes (OCP).

```js
export const hasValidName = (data) => data.name != null || data.username != null;
export const hasValidEmail = (data) => typeof data.email === 'string' && data.email.includes('@');
export const hasValidPassword = (data) => typeof data.password === 'string' && data.password.length >= 8;
export const hasValidDimensions = (data) => data.width > 0 && data.height > 0;
export const hasValidUserId = (data) => data.userId != null;
```

```js
import validateWith from "./validator.js";
import pipe from "../shared/funtional/pipe.js";
import { unprocessableEntityError } from "../shared/error/httpError.js";
import { hasValidName, hasValidDimensions, hasValidUserId } from "./entirtyRules.js";

const validateMapData = pipe(
    validateWith(hasValidName, () => unprocessableEntityError('Map must have a valid name')),
    validateWith(hasValidDimensions, () => unprocessableEntityError('Map must have valid dimensions')),
    validateWith(hasValidUserId, () => unprocessableEntityError('Map must have a valid user id assigned'))
);

export default validateMapData;
```

```js
import validateWith from './validator.js';
import pipe from '../shared/funtional/pipe.js';
import { unprocessableEntityError } from '../shared/error/httpError';
import { hasValidName, hasValidEmail, hasValidPassword } from './entirtyRules';

const validateUserData = pipe(
    validateWith(hasValidName, () => unprocessableEntityError('User must have a valid username')),
    validateWith(hasValidEmail, () => unprocessableEntityError('User must have a valid email address')),
    validateWith(hasValidPassword, () => unprocessableEntityError('User must have a valid password of at least 8 characters'))
);

export default validateUserData;
```
## Clean code

La arquitectura se consolidó mediante la aplicación de Clean Code bajo el estándar de Onion Architecture, utilizando el Patrón Repositorio para abstraer la persistencia y el Patrón Factory para la instanciación de servicios, garantizando un desacoplamiento total mediante el Principio de Inversión de Dependencias (DIP). Se implementó el Patrón Estrategia (Strategy) para permitir que el motor de búsqueda A* sea agnóstico a las reglas de vecindad y heurísticas, junto con el uso de monads para un manejo de errores funcional y predecible que elimina la lógica imperativa. Esta combinación de patrones, sumada a una refactorización bajo principios DRY y SRP, permite que el sistema sea modular, escalable y cubierto por una suite de pruebas inunitarias inmutables de alta fidelidad.

## Manejo de errores

Se implemento manejo de errores customisados, al igual que el manejo de mensajes de succes customisados, con el uso de monads.

- Domain: Se utiliza el Monad Result (Ok / Error) para capturar fallos de lógica de negocio y validaciones sin interrumpir la ejecución del programa. Esto evita el uso excesivo de bloques try-catch y garantiza que los errores sean tratados como datos de primera clase, obligando al desarrollador a gestionar el escenario de error de manera explícita.

- Custom Errors: Se definieron clases de error personalizadas (como httpError) que extienden el objeto nativo Error. Estas permiten adjuntar metadatos críticos como el código de estado HTTP y mensajes contextualmente relevantes, diferenciando errores de cliente (4xx) de fallos de infraestructura (5xx).

- ErrorHandler Middleware: Un middleware centralizado en Express actúa como la "última línea de defensa". Este componente intercepta cualquier error propagado mediante el flujo de Mónadas o excepciones no controladas, normalizando la respuesta en un formato JSON estandarizado.