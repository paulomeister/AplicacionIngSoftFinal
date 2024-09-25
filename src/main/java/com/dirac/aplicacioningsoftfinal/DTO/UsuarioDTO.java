package com.dirac.aplicacioningsoftfinal.DTO;

import com.dirac.aplicacioningsoftfinal.Model.UsuarioModel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class UsuarioDTO {
    private String userName;
    private String email;
    private Map<String, String> perfil;
    private List<Map<String, String>> docSubidos;

    public static UsuarioDTO fromUsuarioModel(UsuarioModel usuario) {
        Map<String, String> perfilExtraido = extraerPerfil(usuario.getPerfil());

        List<Map<String, String>> docSubidosExtraidos = extraerDocumentosSubidos(usuario.getDocSubidos());

        return new UsuarioDTO(
                usuario.getUserName(),
                usuario.getEmail(),
                perfilExtraido,
                docSubidosExtraidos
        );
    }

    private static Map<String, String> extraerPerfil(Map<String, String> perfil) {
        return perfil;
    }

    private static List<Map<String, String>> extraerDocumentosSubidos(List<Map<String, String>> docSubidos) {
        return docSubidos.stream()
                .map(doc -> doc.entrySet().stream()
                        .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue))
                ).collect(Collectors.toList());
    }
}