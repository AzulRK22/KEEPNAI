# Fire Eye Dashboard

**Fire Eye Dashboard** es una aplicación web diseñada para la gestión y monitoreo de emergencias, específicamente incendios, por parte de personal de emergencia y usuarios locales. La aplicación permite la visualización de incidentes, recursos disponibles, condiciones meteorológicas y más, todo en una interfaz intuitiva y fácil de usar.

## Tabla de Contenidos

- [Características](#características)
- [Tecnologías Utilizadas](#tecnologías-utilizadas)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Instalación](#instalación)
- [Uso](#uso)
- [Contribuir](#contribuir)
- [Licencia](#licencia)

## Características

- **Mapa interactivo:** Visualización de incendios, áreas afectadas y recursos desplegados.
- **Monitoreo en por drones:** Activar el algoritmo para buscar la ruta que tomara el dron
- **Loading data :** Subir informacion recabada por el dron para determinar si hay incendios
- **Reportes:** Generación de reportes detallados para análisis post-incidente. (Planeado para el futuro)
- **Configuración personalizada:** Ajustes personalizados para usuarios de emergencia y locales. (Planeado para el futuro)

## Tecnologías Utilizadas

- **Frontend:**
  - [Next.js](https://nextjs.org/)
  - [React.js](https://reactjs.org/)
  - [Styled-Components](https://styled-components.com/)
  - [React Router](https://reactrouter.com/)
  - [Google Fonts](https://fonts.google.com/)

- **Backend:**
  - [Flask](https://flask.palletsprojects.com/) 

- **Otros:**
  - [Node.js](https://nodejs.org/) - 
  - [Git](https://git-scm.com/)
  - [GitHub](https://github.com/)

## Estructura del Proyecto

El proyecto está dividido en dos principales secciones:

- **Frontend:** En el directorio `frontend`, se encuentra la aplicación Next.js que incluye todos los componentes de la interfaz de usuario.
- **Backend (Futuro):** En el directorio `backend`, se planea incluir la API en Flask para la gestión de datos y la lógica del servidor.

## Instalación

Sigue estos pasos para configurar el proyecto en tu entorno local:

1. **Clona el repositorio:**

   ```bash
   git clone https://github.com/AzulRK22/fire-eye-dashboard.git
   cd fire-eye-dashboard


2. **Configura el frontend:**
   
    cd frontend
    npm install
   
3. **Configura el backend:**
   
   cd ../backend
   python -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   
4. **Inicia el frontend:**
   
   cd ../frontend
   npm run dev
   
5. **Inicia el backend:**
   
   flask run
   
6. **Accede a la aplicación:**

   Abre tu navegador y ve a http://localhost:3000 para ver la aplicación en funcionamiento.

## Uso

Pantalla Principal: Desde aquí, los usuarios pueden elegir identificarse como personal de emergencia o usuario local para acceder al dashboard correspondiente.
Dashboard del Personal de Emergencia: Visualiza incidentes, recursos disponibles, monitorea en tiempo real y genera reportes.
Dashboard del Usuario Local: Accede a reportes y configuraciones personalizadas para usuarios locales.

## Contribuir

Si deseas contribuir al proyecto, sigue estos pasos:

Haz un fork del repositorio.
Crea una nueva rama (git checkout -b feature/nueva-funcionalidad).
Realiza tus cambios y haz commit (git commit -am 'Añadir nueva funcionalidad').
Empuja tu rama (git push origin feature/nueva-funcionalidad).
Abre un Pull Request.

## Licencia


Este `README.md` debería cubrir todos los aspectos básicos de tu proyecto y ser útil tanto para otros desarrolladores que quieran contribuir como para cualquier persona que desee entender y utilizar la aplicación.  

   

