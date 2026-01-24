import nodemailer from 'nodemailer';

// Configuración del transportador
// Si usas un servicio como Resend, SendGrid, etc., puedes usar sus configuraciones SMTP aquí.
// O si tienes una API Key específica, a veces es mejor usar su SDK, pero SMTP es universal.

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com', // Cambiar según proveedor
    port: parseInt(process.env.EMAIL_PORT || '587'),
    secure: process.env.EMAIL_SECURE === 'true', // true para 465, false para otros
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // Aquí va la API KEY si es un servicio como Resend
    },
});

export async function sendRecoveryEmail(to: string, token: string) {
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`;

    try {
        const info = await transporter.sendMail({
            from: process.env.EMAIL_FROM || '"Vamos a Brasil" <noreply@vamosabrasil.com>',
            to,
            subject: 'Recuperación de Contraseña - Vamos a Brasil',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #007d2f;">Recupera tu acceso</h2>
                    <p>Has solicitado restablecer tu contraseña para Vamos a Brasil 2026.</p>
                    <p>Haz clic en el siguiente botón para crear una nueva contraseña:</p>
                    <a href="${resetUrl}" style="background-color: #007d2f; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0;">Restablecer Contraseña</a>
                    <p style="color: #666; font-size: 14px;">Este enlace expirará en 1 hora.</p>
                    <p style="color: #666; font-size: 14px;">Si no solicitaste esto, puedes ignorar este correo.</p>
                </div>
            `,
        });

        console.log('Message sent: %s', info.messageId);
        return { success: true };
    } catch (error) {
        console.error('Error sending email:', error);
        // Si estamos en desarrollo y falla (pj no hay credenciales), simulamos éxito
        if (process.env.NODE_ENV === 'development') {
            console.log('Development mode: Email simulated. Token:', token, 'URL:', resetUrl);
            return { success: true, simulated: true };
        }
        return { success: false, error };
    }
}
