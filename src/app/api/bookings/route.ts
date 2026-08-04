import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: Number(process.env.SMTP_PORT) || 465,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const currencySymbol = (currency: string) =>
  currency === 'USD' ? '$' : currency === 'EUR' ? '€' : '₹';

// ── POST /api/bookings ─────────────────────────────────────────────────────────
export async function POST(req: Request) {
  try {
    const data = await req.json();

    // 1. Persist to DB
    const booking = await prisma.booking.create({
      data: {
        firstName:        data.firstName,
        lastName:         data.lastName,
        email:            data.email,
        phone:            data.phone,
        residenceCountry: data.residenceCountry || null,
        notes:            data.notes || null,
        packageTitle:     data.packageTitle,
        destination:      data.destination,
        addons:           data.addons || null,
        departureDate:    data.departureDate || null,
        returnDate:       data.returnDate || null,
        tripLength:       data.tripLength || null,
        adults:           Number(data.adults) || 1,
        children:         Number(data.children) || 0,
        infants:          Number(data.infants) || 0,
        interests:        data.interests || null,
        travelStyle:      data.travelStyle || null,
        accommodations:   data.accommodations || null,
        flightSupport:    data.flightSupport || null,
        packageTier:      data.packageTier || null,
        totalPrice:       data.totalPrice || null,
        currency:         data.currency || 'INR',
        status:           'PENDING',
      },
    });

    const sym = currencySymbol(data.currency || 'INR');
    const fullName = `${data.firstName} ${data.lastName}`;
    const bookingRef = booking.id.slice(-8).toUpperCase();

    const rowStyle = 'padding:10px 0;border-bottom:1px solid #f1f5f9;';
    const labelStyle = 'font-size:13px;color:#64748b;font-weight:600;';
    const valueStyle = 'font-size:13px;color:#0f172a;font-weight:500;text-align:right;';

    const rows = [
      ['Destination',    data.destination],
      ['Package',        data.packageTitle],
      ['Add-ons',        data.addons || 'None'],
      ['Travel Dates',   data.departureDate && data.returnDate ? `${data.departureDate} → ${data.returnDate}` : '-'],
      ['Duration',       data.tripLength || '-'],
      ['Travellers',     `${data.adults} adult(s)${data.children > 0 ? `, ${data.children} child` : ''}${data.infants > 0 ? `, ${data.infants} infant` : ''}`],
      ['Interests',      data.interests || '-'],
      ['Travel Style',   data.travelStyle || '-'],
      ['Package Tier',   data.packageTier || '-'],
      ['Total Price',    data.totalPrice ? `${sym}${data.totalPrice} / person` : '-'],
      ['Accommodation',  data.accommodations || '-'],
      ['Flight Support', data.flightSupport || '-'],
      ['Country',        data.residenceCountry || '-'],
      ['Phone',          data.phone],
      ['Notes',          data.notes || '-'],
    ];

    const tableRows = rows.map(([label, value]) => `
      <tr style="${rowStyle}">
        <td style="${labelStyle}">${label}</td>
        <td style="${valueStyle}">${value}</td>
      </tr>
    `).join('');

    const headerBlock = (title: string, subtitle: string) => `
      <tr>
        <td style="background:#1e293b;padding:28px 36px;text-align:center;">
          <p style="margin:0;color:#ebb337;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;">India Sri Lanka Escape</p>
          <p style="margin:6px 0 0;color:#ffffff;font-size:22px;font-weight:800;">${title}</p>
          <p style="margin:6px 0 0;color:#94a3b8;font-size:13px;">${subtitle}</p>
        </td>
      </tr>
    `;

    const footerBlock = `
      <tr>
        <td style="background:#f8fafc;padding:18px 36px;text-align:center;border-top:1px solid #f1f5f9;">
          <p style="margin:0;font-size:11px;color:#cbd5e1;">© ${new Date().getFullYear()} India Sri Lanka Escape. All rights reserved.</p>
        </td>
      </tr>
    `;

    const baseWrapper = (content: string) => `
      <!DOCTYPE html><html><head><meta charset="UTF-8"/></head>
      <body style="margin:0;padding:0;background:#FAF8F6;font-family:'Segoe UI',Arial,sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background:#FAF8F6;padding:40px 0;">
          <tr><td align="center">
            <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e8e2d9;">
              ${content}
            </table>
          </td></tr>
        </table>
      </body></html>
    `;

    // 2. Admin notification email
    const adminHtml = baseWrapper(`
      ${headerBlock('New Enquiry Received', `Ref: #${bookingRef}`)}
      <tr><td style="padding:32px 36px;">
        <p style="margin:0 0 6px;font-size:20px;font-weight:700;color:#0f172a;">New Travel Enquiry</p>
        <p style="margin:0 0 24px;font-size:14px;color:#64748b;">From <strong>${fullName}</strong> &lt;${data.email}&gt;</p>
        <table width="100%" cellpadding="0" cellspacing="0">${tableRows}</table>
      </td></tr>
      ${footerBlock}
    `);

    // 3. Customer thank-you email
    const customerHtml = baseWrapper(`
      ${headerBlock('Thank You!', `We've received your enquiry.`)}
      <tr><td style="padding:32px 36px;">
        <p style="margin:0 0 8px;font-size:20px;font-weight:700;color:#0f172a;">Your journey request is confirmed 🎉</p>
        <p style="margin:0 0 24px;font-size:14px;color:#64748b;line-height:1.7;">
          Hi <strong>${data.firstName}</strong>,<br/>
          Thank you for reaching out! Our travel expert will review your request and send you a personalised itinerary and quote within <strong>24 hours</strong>.<br/><br/>
          Here's a summary of what you've shared with us:
        </p>
        <table width="100%" cellpadding="0" cellspacing="0">${tableRows}</table>
        <p style="margin:28px 0 0;font-size:13px;color:#94a3b8;line-height:1.7;">
          If you have any urgent questions, simply reply to this email or call us.<br/>
          — The India Sri Lanka Escape Team
        </p>
      </td></tr>
      ${footerBlock}
    `);

    const fromAddress = process.env.SMTP_FROM || '"India Sri Lanka Escape" <rohithempire009@gmail.com>';
    const adminEmail  = process.env.SMTP_USER  || 'rohithempire009@gmail.com';

    await Promise.all([
      transporter.sendMail({
        from:    fromAddress,
        to:      adminEmail,
        subject: `🗺️ New Enquiry from ${fullName} — ${data.packageTitle}`,
        html:    adminHtml,
      }),
      transporter.sendMail({
        from:    fromAddress,
        to:      data.email,
        subject: `✈️ We received your travel enquiry — India Sri Lanka Escape`,
        html:    customerHtml,
      }),
    ]);

    return NextResponse.json({ success: true, bookingId: booking.id });
  } catch (err: any) {
    console.error('[POST /api/bookings]', err);
    return NextResponse.json({ success: false, error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}

// ── GET /api/bookings ──────────────────────────────────────────────────────────
export async function GET() {
  try {
    const bookings = await prisma.booking.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(bookings);
  } catch (err: any) {
    console.error('[GET /api/bookings]', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// ── PATCH /api/bookings ────────────────────────────────────────────────────────
export async function PATCH(req: Request) {
  try {
    const { id, status } = await req.json();
    const updated = await prisma.booking.update({
      where: { id },
      data:  { status },
    });
    return NextResponse.json(updated);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
