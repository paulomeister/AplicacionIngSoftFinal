package com.dirac.aplicacioningsoftfinal.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class BusquedaFiltroDTO extends BusquedaDTO {

    private Boolean tieneFiltros;
    private List<String> keywords;
    private List<String> categorias;
    private List<String> autores;
    private String idioma;
    private Integer desde;
    private Integer hasta;

}
