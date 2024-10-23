package com.dirac.aplicacioningsoftfinal.Service;

import com.google.api.client.auth.oauth2.Credential;
import com.google.api.client.extensions.java6.auth.oauth2.AuthorizationCodeInstalledApp;
import com.google.api.client.extensions.jetty.auth.oauth2.LocalServerReceiver;
import com.google.api.client.googleapis.auth.oauth2.GoogleAuthorizationCodeFlow;
import com.google.api.client.googleapis.auth.oauth2.GoogleClientSecrets;
import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.http.FileContent;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.JsonFactory;
import com.google.api.client.json.gson.GsonFactory;
import com.google.api.client.util.store.FileDataStoreFactory;
import com.google.api.services.drive.Drive;
import com.google.api.services.drive.DriveScopes;
import com.google.api.services.drive.model.File;
import com.google.api.services.drive.model.FileList;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.security.GeneralSecurityException;
import java.util.Collections;
import java.util.List;

public class DriveService {
  private static final String APPLICATION_NAME = "Google Drive API Java Quickstart";
  private static final JsonFactory JSON_FACTORY = GsonFactory.getDefaultInstance();
  private static final String TOKENS_DIRECTORY_PATH = "tokens";
  private static final List<String> SCOPES = Collections.singletonList(DriveScopes.DRIVE_FILE);
  private static final String CREDENTIALS_FILE_PATH = "C:/Users/sergi/Documents/university/fifth semester/ingesoft/AplicacionIngSoftFinal/credentials.json";

  private static Credential getCredentials(final NetHttpTransport HTTP_TRANSPORT) throws IOException {
    InputStream in = DriveService.class.getResourceAsStream(CREDENTIALS_FILE_PATH);
    if (in == null) {
      throw new FileNotFoundException("Resource not found: " + CREDENTIALS_FILE_PATH);
    }
    GoogleClientSecrets clientSecrets = GoogleClientSecrets.load(JSON_FACTORY, new InputStreamReader(in));

    GoogleAuthorizationCodeFlow flow = new GoogleAuthorizationCodeFlow.Builder(
        HTTP_TRANSPORT, JSON_FACTORY, clientSecrets, SCOPES)
        .setDataStoreFactory(new FileDataStoreFactory(new java.io.File(TOKENS_DIRECTORY_PATH)))
        .setAccessType("offline")
        .build();
    LocalServerReceiver receiver = new LocalServerReceiver.Builder().setPort(8888).build();
    return new AuthorizationCodeInstalledApp(flow, receiver).authorize("user");
  }

  public static void main(String... args) throws IOException, GeneralSecurityException {
    final NetHttpTransport HTTP_TRANSPORT = GoogleNetHttpTransport.newTrustedTransport();
    Drive service = new Drive.Builder(HTTP_TRANSPORT, JSON_FACTORY, getCredentials(HTTP_TRANSPORT))
        .setApplicationName(APPLICATION_NAME)
        .build();

    // Crear una carpeta en Google Drive
    File folderMetadata = new File();
    folderMetadata.setName("NuevaCarpeta");
    folderMetadata.setMimeType("application/vnd.google-apps.folder");

    File folder = service.files().create(folderMetadata)
        .setFields("id")
        .execute();
    String folderId = folder.getId();

    // Subir archivo PDF a la carpeta creada
    File fileMetadata = new File();
    fileMetadata.setName("hola.pdf");
    fileMetadata.setParents(Collections.singletonList(folderId));

    java.io.File filePath = new java.io.File("hola.pdf");
    FileContent mediaContent = new FileContent("application/pdf", filePath);

    File file = service.files().create(fileMetadata, mediaContent)
        .setFields("id, parents")
        .execute();

  }
}
