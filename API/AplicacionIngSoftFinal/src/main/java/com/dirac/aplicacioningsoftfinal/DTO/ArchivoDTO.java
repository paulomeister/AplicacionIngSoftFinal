package com.dirac.aplicacioningsoftfinal.DTO;

import com.google.api.services.drive.model.File;

import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@Data
public class ArchivoDTO {

    private com.google.api.services.drive.model.File file;
    private byte[] fileBytes;

    public ArchivoDTO(File file, byte[] fileBytes) {
        this.file = file;
        this.fileBytes = fileBytes;
    }

}
