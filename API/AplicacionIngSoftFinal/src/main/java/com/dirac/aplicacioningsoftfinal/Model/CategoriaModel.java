package com.dirac.aplicacioningsoftfinal.Model;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.Data;

import java.util.List;
import java.util.Map;

@Document(collection = "Categorias")
@AllArgsConstructor
@NoArgsConstructor
@Data

public class CategoriaModel {
    @Id
    private ObjectId _id;

    @JsonProperty("_id")
    public String get_idAString() {
        return _id != null ? _id.toHexString() : null;
    }

    private String nombre;
    private String descripcion;

 
    @NoArgsConstructor
    @AllArgsConstructor
    @Data
    public static class subCategorias {

        @Id
        private ObjectId categoriaId;

        @JsonProperty("categoriaId")
        public String returnIdAsString() {
            return categoriaId != null ? categoriaId.toHexString() : null;
        }

    }



    private List<Map<String, String>> subcategorias;
    private String imagen;
}
