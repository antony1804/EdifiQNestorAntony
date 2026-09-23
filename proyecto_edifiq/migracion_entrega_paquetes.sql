-- Registra quien recibe cada paquete y las observaciones de la entrega.
ALTER TABLE paquete
    ADD COLUMN id_persona_entrega INT NULL,
    ADD COLUMN observacion_entrega VARCHAR(250) NULL,
    ADD CONSTRAINT fk_paquete_persona_entrega
        FOREIGN KEY (id_persona_entrega) REFERENCES persona(id_persona);
