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
