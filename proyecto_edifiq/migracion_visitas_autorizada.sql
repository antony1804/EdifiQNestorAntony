INSERT INTO estado_visita(nombre)
SELECT 'Autorizada'
WHERE NOT EXISTS (
    SELECT 1 FROM estado_visita WHERE LOWER(nombre) = 'autorizada'
);