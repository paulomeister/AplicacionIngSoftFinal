# AplicacionIngSoftFinal

i- Use la rama master para clonar el repositorio y realizar commits o pull requests. <br/>
ii- Edite la connection string en application.properties para conectar con su propia instancia local de MongoDB o, en su defecto, conectarlo directamente al cluster de Mongo Atlas.

## Correr el cliente
1- Cambiar a la carpeta:
```
cd ./Client/doctic
```

1- Ejecutar #npm install:
```
npm install
```

2- Posterior a eso, hacer:
```
npm run dev
```

## Configuración del proyecto

1. Copia el archivo `src/main/resources/application.properties.template` y renómbralo a `application.properties`.
2. Rellena las variables con las credenciales de tu entorno:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/mydb
spring.datasource.username=tu_usuario
spring.datasource.password=tu_contraseña
