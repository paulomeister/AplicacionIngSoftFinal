package com.dirac.aplicacioningsoftfinal.Service;

import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.config.RequestConfig;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.mime.MultipartEntityBuilder;
import org.apache.http.entity.mime.content.ByteArrayBody;
import org.apache.http.impl.client.HttpClientBuilder;
import org.apache.http.util.EntityUtils;
import org.json.JSONObject;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Service
public class ImgurService {

    private static RequestConfig requestConfig = RequestConfig.custom().build();

    public String uploadImage(MultipartFile file) {
        String res;
    
        try {
            // Obtiene la respuesta HTTP y procesa la respuesta
            HttpResponse response = postWithFormData("https://api.imgur.com/3/image/", file);
            
            // Obtiene la entidad de la respuesta y convierte a JSON
            HttpEntity entity = response.getEntity();
            String responseString = EntityUtils.toString(entity);
            JSONObject responseObject = new JSONObject(responseString);
            
            // Accede al campo 'link' dentro de 'data'
            String imageUrl = responseObject.getJSONObject("data").getString("link");
            
            // Guarda el enlace en el resultado
            res = imageUrl;
        } catch (Exception e) {
            res = e.getMessage();
        }
    
        return res;
    }

    public HttpResponse postWithFormData(String url, MultipartFile file) throws IOException {
        // Configura el cliente HTTP
        HttpClient httpClient = HttpClientBuilder.create().setDefaultRequestConfig(requestConfig).build();
        HttpPost request = new HttpPost(url);

        // Agrega los headers que se usan en postman
        request.setHeader("Authorization", "Client-ID 8d270474b733822");
        request.setHeader("Cache-Control", "no-cache");
        request.setHeader("Accept", "*/*");
        request.setHeader("Accept-Encoding", "gzip, deflate, br");
        request.setHeader("Connection", "keep-alive");
        request.setHeader("User-Agent", "PostmanRuntime/7.42.0");

        // Crea la entidad multipart para enviar el archivo
        HttpEntity entity = MultipartEntityBuilder.create()
                .addPart("image", new ByteArrayBody(file.getBytes(), file.getOriginalFilename()))
                .build();

        // Configura la entidad con el archivo en la solicitud
        request.setEntity(entity);

        // Ejecuta la solicitud y retorna la respuesta
        return httpClient.execute(request);
    }
}
