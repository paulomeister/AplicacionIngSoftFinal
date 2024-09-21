package com.dirac.aplicacioningsoftfinal.Service;

import com.dirac.aplicacioningsoftfinal.Exception.NoSuchDocumentFoundException;
import com.dirac.aplicacioningsoftfinal.Model.DocumentoModel;
import com.dirac.aplicacioningsoftfinal.Repository.IDocumentoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class DocumentoService implements IDocumentoService {

    private final IDocumentoRepository documentoRepository;

    @Autowired
    public DocumentoService(IDocumentoRepository documentoRepository) {
        this.documentoRepository = documentoRepository;
    }

    public DocumentoModel getDocument(String id) {

        return documentoRepository.findDocumentByCustomTitle(id)
                .orElseThrow(() -> new NoSuchDocumentFoundException(String.format("El documento con título \" %s \" no se encuentra en la base de datos", id)));

    }

}
