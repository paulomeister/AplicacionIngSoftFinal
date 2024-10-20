package com.dirac.aplicacioningsoftfinal.DTO;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;

import com.dirac.aplicacioningsoftfinal.Model.CategoriaModel;
import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class CategoriaConSubCategoriasDTO {
    @Id
    private ObjectId documentoId;
    private String nombre;
    private String imagen;
    private List<CategoriaModel> subCategorias;

    @JsonProperty("documentoId")
    public String returnIdAsString() {
        return documentoId != null ? documentoId.toHexString() : null;
    }
    
}
