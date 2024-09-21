package com.dirac.aplicacioningsoftfinal.Model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document(collection = "documentos")
@AllArgsConstructor
@NoArgsConstructor
@Data
public class DocumentoModel {

    @Id
    private String _id;
    private Long id;
    private String titulo;
    private int numPag;
    private List<String> categorias;

}
