#
# Accede al simulador en línea

Puedes practicar directamente desde tu navegador en el siguiente enlace:

[Ir al Simulador de Examen Teórico de Tránsito](https://leandjb.github.io/simulador-transito-teorico/)


# ¿Qué es este simulador?

Este simulador te permite practicar para el examen teórico de tránsito en Colombia, necesario para obtener la Licencia de Conducción. Aquí podrás responder preguntas similares a las del examen real, basadas en el Código Nacional de Tránsito (Ley 769 de 2002) y otras normas relacionadas.

## ¿Cómo funciona?

- El simulador selecciona 10 preguntas al azar de un banco de preguntas.
- Debes responder cada pregunta eligiendo la opción que consideres correcta.
- Solo puedes fallar hasta 1 pregunta para aprobar el simulacro.
- Al finalizar, verás un resumen con tus respuestas y las correctas.

## ¿Cómo practicar?

1. Haz clic en el botón "Iniciar Simulacro" en la página principal.
2. Lee cada pregunta y selecciona tu respuesta.
3. Al terminar, revisa el resumen para ver en qué preguntas acertaste o fallaste.
4. Puedes volver a intentarlo cuantas veces quieras.

## ¿Cómo se crear nuevas preguntas?

Si quieres agregar más preguntas al simulador, cada pregunta debe estar en una sola línea, siguiendo este formato:

```txt
Pregunta|Opción A|Opción B|Opción C|Opción D|Letra de la respuesta correcta
```
Finalmente, debes agregarlas dentro de un archivo TXT dentro del folfer /db

**Ejemplo:**

***Archivo:*** ./db/PreguntaSemaforo.txt
```
¿Cuál es el color del semáforo que indica detenerse?|Rojo|Verde|Amarillo|Azul|A
```

- Si una pregunta tiene menos de 4 opciones, deja los campos vacíos.
- La letra de la respuesta correcta debe ser A, B, C o D (en mayúscula).
- No incluyas numeración ni encabezados.


___

¡Éxito en tu preparación y en tu examen teórico!