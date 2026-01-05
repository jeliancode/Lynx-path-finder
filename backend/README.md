# LYNX - PATH FINDER


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

Generar el Cliente (solo si hay errores al migar):
```bash
npx prisma generate
```

Inicializar prisma studio:
```bash
npx prisma studio
```

