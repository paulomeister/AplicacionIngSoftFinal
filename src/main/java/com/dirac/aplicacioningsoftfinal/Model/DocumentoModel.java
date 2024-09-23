package com.dirac.aplicacioningsoftfinal.Model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;
import java.util.List;

@Document(collection = "Documentos")
@AllArgsConstructor
@NoArgsConstructor
@Data
public class DocumentoModel {

    @Id

    private ObjectId _id;
    private String titulo;
    private String descripcion;
    private String visibilidad;
    private String urlArchivo;
    private List<String> keywords;
    private List<CategoriaModel> categoria;
    //private List <AutorModel> autores;
    private List <Valoracion> valoraciones;
    private Date fechaSubida;
    private DatosComputados datosComputados;








}




