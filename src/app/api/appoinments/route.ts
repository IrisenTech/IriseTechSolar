import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    console.log('Received appointment data:', {
      email: data.email,
      date: data.appointmentDate,
      hasSolarResult: !!data.solarResult
    });

    // Email to customer
    const customerEmail = await resend.emails.send({
      from: `Solar Energy Solutions <${process.env.EMAIL_FROM || 'onboarding@resend.dev'}>`,
      to: data.email,
      subject: `Confirmación de Cita Solar - ${formatDate(data.appointmentDate)}`,
      html: generateCustomerEmailHTML(data),
      text: generateCustomerEmailText(data),
      reply_to: process.env.CS_EMAIL || 'irisen.tec@gmail.com',
    });

    console.log('Customer email sent:', customerEmail);

    // Email to CS team if CS_EMAIL is set
    if (process.env.CS_EMAIL) {
      const csEmail = await resend.emails.send({
        from: `Solar Appointments <${process.env.EMAIL_FROM || 'onboarding@resend.dev'}>`,
        to: process.env.CS_EMAIL,
        subject: `Nueva Cita Solar - ${data.email}`,
        html: generateCSEmailHTML(data),
        text: generateCSEmailText(data),
        reply_to: data.email,
      });
      console.log('CS email sent:', csEmail);
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Cita agendada exitosamente',
      emailSent: true
    });

  } catch (error: any) {
    console.error('Error sending email with Resend:', error);
    
    // Return proper JSON error
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error al enviar el correo. Por favor intenta nuevamente.',
        details: error.message || 'Unknown error'
      },
      { status: 500 }
    );
  }
}

function formatDate(dateString: string) {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (error) {
    return dateString;
  }
}

function generateCustomerEmailHTML(data: any) {
  const formattedDate = formatDate(data.appointmentDate);
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .info-item { margin-bottom: 15px; }
        .label { font-weight: bold; color: #16a34a; }
        .calendar-btn { background: #4285f4; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0; }
        .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>¡Cita Confirmada!</h1>
          <p>Tu evaluación solar está programada</p>
        </div>
        <div class="content">
          <h2>Detalles de tu cita:</h2>
          <div class="info-item">
            <span class="label">Fecha:</span> ${formattedDate}
          </div>
          <div class="info-item">
            <span class="label">Dirección:</span> ${data.address || 'No especificada'}
          </div>
          <div class="info-item">
            <span class="label">Email:</span> ${data.email}
          </div>
          <div class="info-item">
            <span class="label">Teléfono:</span> ${data.phone || 'No especificado'}
          </div>
          ${data.notes ? `<div class="info-item"><span class="label">Notas:</span> ${data.notes}</div>` : ''}
          
          ${data.solarResult ? `
            <h3>Resumen de evaluación solar:</h3>
            <div class="info-item">
              <span class="label">Consumo mensual estimado:</span> ${(data.solarResult.consumodia * 30).toFixed(2)} kWh
            </div>
            <div class="info-item">
              <span class="label">Tamaño del sistema recomendado:</span> ${data.solarResult.calculoKwp.toFixed(2)} kWp
            </div>
            <div class="info-item">
              <span class="label">Inversión estimada:</span> $${data.solarResult.investmentValue?.toLocaleString('es-ES') || 'Por calcular'} COP
            </div>
          ` : ''}
          
          <p><strong>Preparativos para la cita:</strong></p>
          <ul>
            <li>Por favor ten disponible tu última factura de energía</li>
            <li>Nuestro especialista se contactará 24 horas antes para confirmar</li>
            <li>La visita tiene una duración aproximada de 1 hora</li>
            <li>No es necesario que estés presente si nos autorizas acceso</li>
          </ul>
          
          <div class="footer">
            <p>Solar Energy Solutions</p>
            <p>© ${new Date().getFullYear()} Solar Energy Solutions. Todos los derechos reservados.</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
}

function generateCSEmailHTML(data: any) {
  const formattedDate = formatDate(data.appointmentDate);
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #1a56db; color: white; padding: 20px; text-align: center; }
        .content { background: #f3f4f6; padding: 20px; }
        .info-item { margin-bottom: 10px; padding: 10px; background: white; border-radius: 5px; }
        .label { font-weight: bold; color: #1a56db; min-width: 150px; display: inline-block; }
        .priority { background: #fef3c7; padding: 10px; border-radius: 5px; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>📅 NUEVA CITA SOLAR</h1>
          <p>Requiere seguimiento del equipo CS</p>
        </div>
        <div class="content">
          <div class="priority">
            <strong>⚠️ ACCIÓN REQUERIDA:</strong> Contactar al cliente para confirmar cita
          </div>
          
          <h2>Información del Cliente:</h2>
          <div class="info-item">
            <span class="label">Fecha de Cita:</span> ${formattedDate}
          </div>
          <div class="info-item">
            <span class="label">Cliente:</span> ${data.email}
          </div>
          <div class="info-item">
            <span class="label">Teléfono:</span> <a href="tel:${data.phone || ''}">${data.phone || 'No especificado'}</a>
          </div>
          <div class="info-item">
            <span class="label">Dirección:</span> 
            <a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(data.address || '')}" target="_blank">
              ${data.address || 'No especificada'} ${data.address ? '(Ver en Maps)' : ''}
            </a>
          </div>
          
          ${data.notes ? `<div class="info-item"><span class="label">Notas del Cliente:</span> ${data.notes}</div>` : ''}
          
          ${data.solarResult ? `
            <h3>Evaluación Solar Calculada:</h3>
            <div class="info-item">
              <span class="label">Valor Factura:</span> $${data.monthlyBill?.toLocaleString('es-ES') || 'N/A'} COP
            </div>
            <div class="info-item">
              <span class="label">Sistema Recomendado:</span> ${data.solarResult.calculoKwp?.toFixed(2) || 'N/A'} kWp
            </div>
            <div class="info-item">
              <span class="label">Paneles:</span> ${data.solarResult.panelCount || 'N/A'} unidades
            </div>
            <div class="info-item">
              <span class="label">Inversión Estimada:</span> $${data.solarResult.investmentValue?.toLocaleString('es-ES') || 'Por calcular'} COP
            </div>
          ` : '<div class="info-item">No se realizó cálculo previo</div>'}
          
          <div style="margin-top: 30px; font-size: 12px; color: #666;">
            <p><strong>Recordatorio:</strong> Contactar al cliente 24-48 horas antes de la cita para confirmar.</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
}

function generateCustomerEmailText(data: any) {
  const formattedDate = formatDate(data.appointmentDate);
  
  return `
Confirmación de Cita - Evaluación Solar

¡Hola!

Tu cita para evaluación solar ha sido confirmada exitosamente.

📅 Fecha: ${formattedDate}
📍 Dirección: ${data.address || 'No especificada'}
📧 Email: ${data.email}
📞 Teléfono: ${data.phone || 'No especificado'}

${data.solarResult ? `
Resumen de tu evaluación:
• Consumo mensual estimado: ${(data.solarResult.consumodia * 30).toFixed(2)} kWh
• Sistema recomendado: ${data.solarResult.calculoKwp?.toFixed(2) || 'Por calcular'} kWp
• Inversión estimada: $${data.solarResult.investmentValue?.toLocaleString('es-ES') || 'Por calcular'} COP
• Retorno de inversión: ${data.solarResult.paybackTime?.toFixed(2) || 'Por calcular'} años
` : ''}

🔔 Recuerda:
- Ten disponible tu última factura de energía
- Nuestro especialista te contactará 24 horas antes para confirmar
- La visita tiene una duración aproximada de 1 hora

¿Necesitas reprogramar o tienes preguntas?
Contáctanos: +57 1 123 4567

¡Esperamos verte pronto!

Saludos,
Equipo Solar Energy Solutions
  `;
}

function generateCSEmailText(data: any) {
  const formattedDate = formatDate(data.appointmentDate);
  
  return `
NUEVA CITA SOLAR - ACCIÓN REQUERIDA

Cliente: ${data.email}
Teléfono: ${data.phone || 'No especificado'}
Fecha: ${formattedDate}
Dirección: ${data.address || 'No especificada'}

${data.notes ? `Notas: ${data.notes}` : ''}

${data.solarResult ? `
Información calculada:
- Valor factura: $${data.monthlyBill?.toLocaleString('es-ES') || 'N/A'} COP
- Sistema: ${data.solarResult.calculoKwp?.toFixed(2) || 'N/A'} kWp
- Paneles: ${data.solarResult.panelCount || 'N/A'} unidades
- Inversión: $${data.solarResult.investmentValue?.toLocaleString('es-ES') || 'Por calcular'} COP
` : 'Sin cálculo previo'}

Acciones requeridas:
1. Contactar cliente para confirmar (24-48 horas antes)
2. Preparar documentación para visita

Google Maps: https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(data.address || '')}
  `;
}