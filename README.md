# Grayola.io <br> Challenge by Franco Campaiola

## Explicación técnica

Grayola es un proyecto hecho en Next.js con Supabase para facilitar la gestión de proyectos de diseño en una empresa.<br>
Utiliza la autenticación de Supabase y la base de datos de Supabase para almacenar los datos de los proyectos. <br>
Utiliza el bucket de Supabase para almacenar los archivos de los proyectos. <br>
Utiliza shadcn/ui y tailwindcss para los estilos. <br>
Utiliza react-hook-form y zod para el manejo de formularios. <br>
Utiliza tanstack query para la gestión de datos. <br>

## Requerimientos

- NodeJS (versión 18 o superior)
- Cuenta de Supabase

## Instalación

```bash
git clone https://github.com/francocampaiola/grayola-challenge
cd grayola-challenge
```

## Instalación de paquetes de NPM

```bash
npm install
# o
yarn install
```

## Copiar el archivo .env.example y crear el archivo .env

```env
NEXT_PUBLIC_SUPABASE_URL="tu-url-de-supabase"
NEXT_PUBLIC_SUPABASE_ANON_KEY="tu-anon-key"
```

## Para correr entorno de desarrollo

```bash
npm run dev
# o
yarn dev
```

## Para correr entorno de producción

```bash
npm run build
npm run start
# o
yarn build
yarn start
```

```
## Scripts Disponibles

- `npm run dev`: Inicia el servidor de desarrollo
- `npm run build`: Construye la aplicación para producción
- `npm run start`: Inicia el servidor de producción
- `npm run lint`: Ejecuta el linter

```

## Demo

`````
Link de la demo: https://grayola-challenge-three.vercel.app

Credenciales de acceso:
- Email: demo@grayola.io
- Contraseña: Demo0000
`````