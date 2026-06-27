import { format } from 'date-fns';
import { nl } from 'date-fns/locale';

const BRAND_STYLES = `
  <style>
    body { font-family: 'Inter', Arial, sans-serif; background: #FAF6EC; color: #17130D; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 0 auto; padding: 40px 24px; }
    .header { text-align: center; padding: 32px 0; border-bottom: 2px solid #F3E1B8; margin-bottom: 32px; }
    .brand { font-family: Georgia, serif; font-size: 28px; letter-spacing: 0.15em; text-transform: uppercase; color: #AA7A28; }
    .brand-sub { font-size: 11px; letter-spacing: 0.4em; text-transform: uppercase; color: #6F6251; margin-top: 4px; }
    h1 { font-family: Georgia, serif; font-size: 24px; color: #17130D; margin: 0 0 16px; }
    p { line-height: 1.7; color: #6F6251; margin: 0 0 16px; }
    .detail { background: white; border: 1px solid #F3E1B8; border-radius: 12px; padding: 20px; margin: 24px 0; }
    .detail-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #FAF6EC; }
    .detail-label { font-weight: 600; color: #17130D; }
    .detail-value { color: #6F6251; }
    .btn { display: inline-block; background: linear-gradient(135deg, #D8B66C, #AA7A28); color: white; padding: 14px 28px; border-radius: 999px; text-decoration: none; font-weight: 700; margin: 16px 0; }
    .footer { text-align: center; padding-top: 32px; border-top: 1px solid #F3E1B8; margin-top: 40px; }
    .footer p { font-size: 13px; color: #AA7A28; }
  </style>
`;

function emailWrapper(content: string): string {
  return `<!DOCTYPE html><html lang="nl"><head><meta charset="UTF-8">${BRAND_STYLES}</head><body><div class="container"><div class="header"><div class="brand">Elevated</div><div class="brand-sub">Eventmaker</div></div>${content}<div class="footer"><p>Elevated Eventmaker &middot; Eventbranding for Business Events</p><p>elevated-eventmaker.nl</p></div></div></body></html>`;
}

export function digitalMeetingConfirmation(data: {
  name: string;
  date: string;
  time: string;
  meetingLink: string;
}): { subject: string; html: string } {
  const formattedDate = format(new Date(data.date), 'EEEE d MMMM yyyy', { locale: nl });

  return {
    subject: 'Je digitale kennismaking met Elevated Eventmaker is bevestigd',
    html: emailWrapper(`
      <h1>Je kennismaking is bevestigd</h1>
      <p>Beste ${data.name},</p>
      <p>Bedankt voor je interesse in Elevated Eventmaker. Je digitale kennismaking staat ingepland.</p>
      <div class="detail">
        <div class="detail-row"><span class="detail-label">Datum</span><span class="detail-value">${formattedDate}</span></div>
        <div class="detail-row"><span class="detail-label">Tijd</span><span class="detail-value">${data.time}</span></div>
        <div class="detail-row"><span class="detail-label">Type</span><span class="detail-value">Digitale meeting</span></div>
      </div>
      <p><a href="${data.meetingLink}" class="btn">Open meeting link</a></p>
      <p><strong>Ter voorbereiding:</strong></p>
      <p>Denk alvast na over het type event, de doelgroep, de gewenste sfeer en wat je gasten moeten voelen en onthouden.</p>
      <p>Heb je vragen vooraf? Stuur gerust een bericht.</p>
      <p>Tot snel,<br><strong>Gabriela</strong><br>Elevated Eventmaker</p>
    `),
  };
}

export function faceToFaceRequestConfirmation(data: {
  name: string;
  location: string;
  dateWindows: string[];
}): { subject: string; html: string } {
  return {
    subject: 'Je aanvraag voor een persoonlijke afspraak is ontvangen',
    html: emailWrapper(`
      <h1>Je aanvraag is ontvangen</h1>
      <p>Beste ${data.name},</p>
      <p>Bedankt voor je aanvraag voor een persoonlijk gesprek. Ik neem je verzoek met aandacht door.</p>
      <div class="detail">
        <div class="detail-row"><span class="detail-label">Locatie</span><span class="detail-value">${data.location}</span></div>
        <div class="detail-row"><span class="detail-label">Voorkeursdata</span><span class="detail-value">${data.dateWindows.join(', ')}</span></div>
        <div class="detail-row"><span class="detail-label">Type</span><span class="detail-value">Persoonlijke afspraak</span></div>
      </div>
      <p>Ik bekijk locatie, reistijd en beschikbaarheid en kom persoonlijk bij je terug met een bevestiging.</p>
      <p>Hartelijke groet,<br><strong>Gabriela</strong><br>Elevated Eventmaker</p>
    `),
  };
}

export function internalNotification(data: {
  type: 'digital' | 'face_to_face';
  leadName: string;
  company: string;
  email: string;
  eventType: string;
  meetingLink?: string;
  travelTime?: string;
  enrichmentStatus: string;
  adminUrl: string;
}): { subject: string; html: string } {
  const typeLabel = data.type === 'digital' ? 'digitale meeting' : 'face-to-face aanvraag';

  return {
    subject: data.type === 'digital'
      ? `Nieuwe digitale meeting gepland: ${data.company || data.leadName}`
      : `Nieuwe face-to-face aanvraag: ${data.company || data.leadName}`,
    html: emailWrapper(`
      <h1>Nieuwe ${typeLabel}</h1>
      <div class="detail">
        <div class="detail-row"><span class="detail-label">Naam</span><span class="detail-value">${data.leadName}</span></div>
        <div class="detail-row"><span class="detail-label">Bedrijf</span><span class="detail-value">${data.company || '-'}</span></div>
        <div class="detail-row"><span class="detail-label">E-mail</span><span class="detail-value">${data.email}</span></div>
        <div class="detail-row"><span class="detail-label">Eventtype</span><span class="detail-value">${data.eventType || '-'}</span></div>
        ${data.meetingLink ? `<div class="detail-row"><span class="detail-label">Meeting link</span><span class="detail-value"><a href="${data.meetingLink}">${data.meetingLink}</a></span></div>` : ''}
        ${data.travelTime ? `<div class="detail-row"><span class="detail-label">Reistijd</span><span class="detail-value">${data.travelTime}</span></div>` : ''}
        <div class="detail-row"><span class="detail-label">Enrichment</span><span class="detail-value">${data.enrichmentStatus}</span></div>
      </div>
      <p><a href="${data.adminUrl}" class="btn">Bekijk in admin</a></p>
    `),
  };
}
