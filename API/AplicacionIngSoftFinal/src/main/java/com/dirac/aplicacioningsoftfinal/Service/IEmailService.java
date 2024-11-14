package com.dirac.aplicacioningsoftfinal.Service;
import javax.mail.*;


public interface IEmailService {
    
    Session createSession();

    void sendEmail(String toEmail, String subject, String content);
    
    void sendUpdateNotification(String toEmail, String whatHasBeenUpdated);

    void sendAccountDeletionNotification(String toEmail);

    void sendWelcomeEmail(String toEmail);
}
