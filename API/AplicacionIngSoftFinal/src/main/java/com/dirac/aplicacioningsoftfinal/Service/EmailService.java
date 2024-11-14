package com.dirac.aplicacioningsoftfinal.Service;

import javax.mail.*;
import javax.mail.internet.*;

import org.springframework.stereotype.Service;

import java.beans.JavaBean;
import java.util.Properties;

@Service
public class EmailService implements IEmailService {

    private final String username = "docticingesoft@gmail.com"; 
    private final String password = "ihya goll ktrj ljed"; 

    public Session createSession() {
        Properties props = new Properties();
        props.put("mail.smtp.auth", "true");
        props.put("mail.smtp.starttls.enable", "true");
        props.put("mail.smtp.host", "smtp.gmail.com");
        props.put("mail.smtp.port", "587"); // Usa el puerto de Gmail para TLS

        return Session.getInstance(props, new Authenticator() {
            @Override
            protected PasswordAuthentication getPasswordAuthentication() {
                return new PasswordAuthentication(username, password);
            }
        });
    }

    public void sendEmail(String toEmail, String subject, String content) {
        try {
            Message message = new MimeMessage(createSession());
            message.setFrom(new InternetAddress(username));
            message.setRecipients(Message.RecipientType.TO, InternetAddress.parse(toEmail));
            message.setSubject(subject);
            message.setContent(content, "text/html; charset=utf-8");

            Transport.send(message);
            System.out.println("Correo enviado a " + toEmail);
        } catch (MessagingException e) {
            e.printStackTrace();
        }
    }

    public void sendUpdateNotification(String toEmail, String whatHasBeenUpdated) {
        String subject = "Doctic - Actualización de Datos";
        String content = String.format(
                """
                        <div style='font-family: Arial, sans-serif; max-width: 600px; margin: 20px auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px; background-color: #f9f9f9; color: #333;'>
                            <div style='text-align: center;'>
                                <img src='https://i.imgur.com/gZ19924.png' alt='DOCTIC Logo' style='width: 120px; margin-bottom: 20px;'>
                            </div>
                            <h1 style='text-align: center; color: #007bff; margin-bottom: 20px;'>DocTIC</h1>
                            <p style='color: #007bff; font-size: 18px; font-weight: bold;'>¡Actualización de Datos Exitosa!</p>
                            <p>Su %s <strong style='color: #007bff;'>DOCTIC</strong> ha sido actualizado/a correctamente.</p>
                            <p style='color: #555;'>¿No has sido tú? <a href='mailto:support@example.com' style='color: #333; text-decoration: none; border-bottom: 1px solid #007bff;'>Envíanos un correo</a> comunicándote con nosotros.</p>
                            <hr style='border: none; border-top: 1px solid #ddd; margin: 20px 0;'>
                            <p style='font-size: 14px; color: #888; text-align: center;'>Este mensaje es automático, por favor no responda.</p>
                        </div>
                        """,
                whatHasBeenUpdated);
        sendEmail(toEmail, subject, content);
    }

    public void sendAccountDeletionNotification(String toEmail) {
        String subject = "Doctic - Cuenta Eliminada";
        String content = """
                <div style='font-family: Arial, sans-serif; max-width: 600px; margin: 20px auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px; background-color: #fff3f3; color: #333;'>
                    <div style='text-align: center;'>
                        <img src='https://i.imgur.com/gZ19924.png' alt='DOCTIC Logo' style='width: 120px; margin-bottom: 20px;'>
                    </div>
                    <h1 style='text-align: center; color: #d9534f; margin-bottom: 20px;'>DocTIC</h1>
                    <p style='color: #d9534f; font-size: 18px; font-weight: bold;'>Cuenta Eliminada Correctamente</p>
                    <p>Su cuenta en <strong style='color: #d9534f;'>DOCTIC</strong> ha sido eliminada correctamente.</p>
                    <p style='color: #555;'>Si necesitas ayuda o tienes alguna pregunta, no dudes en <a href='mailto:support@example.com' style='color: #d9534f; text-decoration: none; border-bottom: 1px solid #d9534f;'>contactarnos</a>.</p>
                    <hr style='border: none; border-top: 1px solid #ddd; margin: 20px 0;'>
                    <p style='font-size: 14px; color: #888; text-align: center;'>Este mensaje es automático, por favor no responda.</p>
                </div>
                """;
        sendEmail(toEmail, subject, content);
    }

    public void sendWelcomeEmail(String toEmail) {
        String subject = "Bienvenido a Doctic!";
        String content = """
                <div style='font-family: Arial, sans-serif; max-width: 600px; margin: 20px auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px; background-color: #e3e1e1; color: #333;'>
                    <div style='text-align: center;'>
                        <img src='https://i.imgur.com/gZ19924.png' alt='DOCTIC Logo' style='width: 120px; margin-bottom: 20px;'>
                    </div>
                    <h1 style='text-align: center; color: #061b40; margin-bottom: 20px;'>¡Bienvenido a DOCTIC!</h1>
                    <p style='color: #061b40; font-size: 18px; font-weight: bold;'>¡Nos alegra tenerte con nosotros!</p>
                    <p>Gracias por registrarte en <strong style='color: #061b40;'>DOCTIC</strong>. Estamos emocionados de que seas parte de nuestra comunidad.</p>
                    <p style='color: #555;'>Esperamos ayudarte a aprovechar al máximo nuestra plataforma.</p>
                    <hr style='border: none; border-top: 1px solid #ddd; margin: 20px 0;'>
                    <p style='font-size: 14px; color: #888; text-align: center;'>Equipo DOCTIC</p>
                </div>
                """;
        sendEmail(toEmail, subject, content);
    }

}
