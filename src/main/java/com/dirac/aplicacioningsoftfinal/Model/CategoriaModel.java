package com.dirac.aplicacioningsoftfinal.Model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

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
    private String _id;
    private String nombre;
    private String descripcion;
    private List<Map<String, String>> subcategorias;

}
