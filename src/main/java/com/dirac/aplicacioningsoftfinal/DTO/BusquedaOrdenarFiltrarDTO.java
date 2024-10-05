package com.dirac.aplicacioningsoftfinal.DTO;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class BusquedaOrdenarFiltrarDTO extends BusquedaFiltroDTO {
    private Boolean tieneOrden;
    private List<OrdenDTO> orden;
}
