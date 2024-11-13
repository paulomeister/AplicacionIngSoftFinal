package com.dirac.aplicacioningsoftfinal.Service;

import com.google.api.client.auth.oauth2.Credential;
import com.google.api.client.extensions.java6.auth.oauth2.AuthorizationCodeInstalledApp;
import com.google.api.client.extensions.jetty.auth.oauth2.LocalServerReceiver;
import com.google.api.client.googleapis.auth.oauth2.GoogleAuthorizationCodeFlow;
import com.google.api.client.googleapis.auth.oauth2.GoogleClientSecrets;
import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.http.ByteArrayContent;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.JsonFactory;
import com.google.api.client.json.gson.GsonFactory;
import com.google.api.client.util.store.FileDataStoreFactory;
import com.google.api.services.drive.Drive;
import com.google.api.services.drive.DriveScopes;

import java.io.ByteArrayOutputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.security.GeneralSecurityException;
import java.util.Collections;
import java.util.List;

import org.springframework.web.multipart.MultipartFile;

public class DriveService {

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    private static final String APPLICATION_NAME = "AplicacionIngSoftFinal";
    private static final JsonFactory JSON_FACTORY = GsonFactory.getDefaultInstance();
    private static final String TOKENS_DIRECTORY_PATH = "tokens";
    private static final List<String> SCOPES = Collections.singletonList(DriveScopes.DRIVE_FILE);
    private static final String CREDENTIALS_FILE_PATH = "./credentials.json";
    private final static String folderId = "1mdVe9JNnoWZKE7eN9n-szy4Zk2u8DAuV";

    private Credential getDriveCredentials(NetHttpTransport HTTP_TRANSPORT)
            throws GeneralSecurityException, IOException {

        InputStream in = DriveService.class.getResourceAsStream(CREDENTIALS_FILE_PATH);
        if (in == null) {
            throw new FileNotFoundException("Resource not found: " + CREDENTIALS_FILE_PATH);
        }

        GoogleClientSecrets clientSecrets = GoogleClientSecrets.load(JSON_FACTORY, new InputStreamReader(in)); // Secrets

        GoogleAuthorizationCodeFlow flow = new GoogleAuthorizationCodeFlow.Builder(
                HTTP_TRANSPORT, JSON_FACTORY, clientSecrets, SCOPES)
                .setDataStoreFactory(new FileDataStoreFactory(new java.io.File(TOKENS_DIRECTORY_PATH)))
                .setAccessType("offline")
                .build();

        LocalServerReceiver receiver = new LocalServerReceiver.Builder().setPort(8888).setCallbackPath("/Callback")
                .build();
        return new AuthorizationCodeInstalledApp(flow, receiver).authorize("user");

    }

    public Drive createDrive() throws GeneralSecurityException, IOException {

        final NetHttpTransport HTTP_TRANSPORT = GoogleNetHttpTransport.newTrustedTransport(); // TRANSPORT

        Drive drive = new Drive.Builder(HTTP_TRANSPORT, JSON_FACTORY, getDriveCredentials(HTTP_TRANSPORT))
                .setApplicationName(APPLICATION_NAME)
                .build();
        return drive;
    }

    public String uploadToDrive(MultipartFile file) throws GeneralSecurityException, IOException {

        String res;

        try {

            Drive drive = createDrive(); // Crea el documento drive

            com.google.api.services.drive.model.File fileMetaData = new com.google.api.services.drive.model.File();
            fileMetaData.setName(file.getOriginalFilename());
            fileMetaData.setParents(Collections.singletonList(folderId));

            // Contenido del header
            ByteArrayContent mediaContent = new ByteArrayContent("application/pdf", file.getBytes());

            // Sube el archivo a Google Drive
            com.google.api.services.drive.model.File uploadedFile = drive.files().create(fileMetaData, mediaContent)
                    .setFields("id").execute();

            // retorna el id de lo que se subió
            res = uploadedFile.getId();
        } catch (Exception e) {
            res = e.getMessage();
        }
        return res;
    }

    public com.google.api.services.drive.model.File getFileById(String fileId)
            throws GeneralSecurityException, IOException {
        Drive drive = createDrive();
        return drive.files().get(fileId).setFields("id, name, mimeType").execute();
    }

    public byte[] downloadFile(String fileId) throws GeneralSecurityException, IOException {

        Drive drive = createDrive(); // crea el servicio de drive

        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();

        drive.files().get(fileId).executeMediaAndDownloadTo(outputStream);
        return outputStream.toByteArray(); // Devuelve el contenido del archivo como byte[]
    }

}
