package com.dirac.aplicacioningsoftfinal.Service;

import com.dirac.aplicacioningsoftfinal.Exception.NoSuchDocumentFoundException;
import com.dirac.aplicacioningsoftfinal.Model.DocumentoModel;
import com.dirac.aplicacioningsoftfinal.Repository.IDocumentoRepository;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class DocumentoService implements IDocumentoService {

    private final IDocumentoRepository documentoRepository;

    @Autowired
    public DocumentoService(IDocumentoRepository documentoRepository) {
        this.documentoRepository = documentoRepository;
    }

    public DocumentoModel getDocument(ObjectId _id) {

        return documentoRepository.findDocumentByID(_id)
                .orElseThrow(() -> new NoSuchDocumentFoundException(String.format("El documento con ID \" %s \" no se encuentra en la base de datos", _id)));

    }

}
