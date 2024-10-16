package com.dirac.aplicacioningsoftfinal.DTO;

import org.bson.types.ObjectId;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DocSubidosDTO {
    private ObjectId documentoId;
    
    @JsonProperty("documentoId")
    public String getDocumentoIdAsString() {
        return documentoId != null ? documentoId.toHexString() : null;
    }
    private String titulo;
}
