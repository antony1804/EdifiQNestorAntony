# EdifiQ - Validaciones

Las validaciones se aplican en dos capas:

1. **React:** limpia caracteres no permitidos mientras se escribe y valida antes de enviar.
2. **Spring Boot:** vuelve a validar con Jakarta Bean Validation y reglas de negocio. El backend no confía en el navegador.

## Personas
- Nombres y apellidos: letras Unicode, espacios, apóstrofes y guiones.
- Documento: letras, números, punto y guion; 5-20 caracteres.
- Teléfono: solo números, 7-10 dígitos.
- Correo: formato de correo y sin espacios.
- Documento, correo y teléfono no se pueden repetir.

## Usuarios
- Usuario: 4-50 caracteres, letras, números, `.`, `_` y `-`.
- Contraseña: 6-72 caracteres.
- No se permite repetir usuario ni asociar dos cuentas a la misma persona.
- La contraseña está configurada como `WRITE_ONLY` en JSON para no devolverla en las respuestas de la API.

## Apartamentos
- Número: letras, números y guion, máximo 10 caracteres.
- Piso: 0-200.
- No se repite el mismo número dentro de una torre.

## Paquetes
- Descripción: 3-200 caracteres y conjunto controlado de signos.
- Remitente: 2-100 caracteres y conjunto controlado de signos.
- La entrega no puede ser anterior a la recepción.

## Recibos
- Periodo: 4-20 caracteres.
- Valor: mayor a 0, máximo 10 enteros y 2 decimales.
- Vencimiento no puede ser anterior a emisión.
- No se repite la combinación apartamento + servicio + periodo.

## Reservas
- Fecha obligatoria y no anterior a la fecha actual.
- Hora final posterior a la inicial.
- Invitados: 0-1000.
- No se permiten reservas que se solapen en la misma zona y fecha.

## Visitas
- Nombre: solo letras, espacios, apóstrofes y guiones.
- Documento: letras, números, punto y guion.
- Motivo: texto controlado, máximo 150 caracteres.
- La salida no puede ser anterior al ingreso.

Los mensajes de duplicidad son deliberadamente generales: indican que un dato único ya está registrado sin revelar qué persona o cuenta posee ese dato.
