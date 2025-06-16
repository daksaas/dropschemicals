import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { sendEmail } from './mailer';

dotenv.config();

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.post('/send-email', async (req: Request, res: Response) => {
  let formType = req.body.formType;
  let formData = req.body.formData;

  // If formData is not present but fields are at root, use root fields
  if (!formData && formType) {
    // Remove formType from req.body and use the rest as formData
    const { formType: _, ...rest } = req.body;
    formData = rest;
  }

  // Ensure both formType and formData are present
  if (!formType || !formData) {
    res.status(400).send("Missing formType or formData in request body.");
    return;
  }

  let requiredFields: string[] = [];
  let processedData = { ...formData };

  if (formType === 'contact') {
    // Accept either 'name' or 'fullName' from frontend, always map to 'fullName'
    if (formData.name && !formData.fullName) {
      processedData.fullName = formData.name;
    }
    requiredFields = ['fullName', 'email', 'subject', 'message'];
  } else if (formType === 'service-request') {
    requiredFields = ['name', 'email', 'phone', 'company', 'subject', 'message'];
  } else if (formType === 'feedback') {
    requiredFields = ['company', 'date', 'completedBy', 'contact', 'email', 'products', 'experience', 'price', 'quality', 'expectations', 'suggestions', 'overall'];
  } else {
    res.status(400).send('Unknown form type');
    return;
  }

  for (const field of requiredFields) {
    if (
      processedData[field] === undefined ||
      processedData[field] === null ||
      (typeof processedData[field] === 'string' && processedData[field].trim() === '')
    ) {
      res.status(400).send(`Missing required field in ${formType} form: ${field}`);
      return;
    }
  }

  try {
    await sendEmail(formType, processedData);
    res.status(200).send("Email sent successfully!");
  } catch (err: any) {
    console.error(err);
    if (err.message && err.message.startsWith('Missing required field')) {
      res.status(400).send(err.message);
    } else if (err.message && err.message === 'Unknown form type') {
      res.status(400).send(err.message);
    } else {
      res.status(500).send("Failed to send email.");
    }
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});
