import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

export const sendEmail = async (formType: string, data: any) => {
  // Validate required fields for each form type
  if (formType === 'contact') {
    const requiredFields = ['fullName', 'email', 'subject', 'message'];
    for (const field of requiredFields) {
      if (!data[field]) {
        throw new Error(`Missing required field in contact form: ${field}`);
      }
    }
  } else if (formType === 'service-request') {
    const requiredFields = ['name', 'email', 'phone', 'company', 'subject', 'message'];
    for (const field of requiredFields) {
      if (!data[field]) {
        throw new Error(`Missing required field in service-request form: ${field}`);
      }
    }
  } else if (formType === 'feedback') {
    const requiredFields = ['company', 'date', 'completedBy', 'contact', 'email', 'products', 'experience', 'price', 'quality', 'expectations', 'suggestions', 'overall'];
    for (const field of requiredFields) {
      if (!data[field]) {
        throw new Error(`Missing required field in feedback form: ${field}`);
      }
    }
  } else {
    throw new Error("Unknown form type");
  }

  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  let subject = '';
  let text = '';

  if (formType === 'contact') {
    subject = `New Contact Message: ${data.subject}`;
    text = `
📨 Contact Form

👤 Full Name: ${data.fullName}
📧 Email: ${data.email}
📌 Subject: ${data.subject}
📝 Message: ${data.message}
    `;
  } else if (formType === 'service-request') {
    subject = `New Service Request: ${data.subject}`;
    text = `
📨 Service Request

👤 Name: ${data.name}
📧 Email: ${data.email}
📞 Phone: ${data.phone}
🏢 Company: ${data.company}
📌 Subject: ${data.subject}
📝 Message: ${data.message}
    `;
  } else if (formType === 'feedback') {
    subject = `New Feedback from ${data.company}`;
    text = `
📨 Feedback Form

🏢 Company Name: ${data.company}
📅 Date: ${data.date}
👤 Completed By: ${data.completedBy}
📞 Contact: ${data.contact}
📧 Email: ${data.email}
🛍️ Products: ${data.products}
😊 Experience: ${data.experience}
💲 Price: ${data.price}
🏆 Quality: ${data.quality}
✅ Expectations: ${data.expectations}
💡 Suggestions: ${data.suggestions}
⭐ Overall: ${data.overall}
    `;
  } else {
    throw new Error("Unknown form type");
  }

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_USER,
    subject,
    text,
  };

  await transporter.sendMail(mailOptions);
};
