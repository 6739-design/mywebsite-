require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const port = 3000;

// อนุญาตให้หน้าเว็บ (Frontend) ส่งข้อมูลเข้ามาได้ และแปลงข้อมูลเป็น JSON
app.use(cors());
app.use(express.json());

// สร้าง API Endpoint ของเราเอง
app.post('/api/chat', async (req, res) => {
  const userMsg = req.body.message;

  if (!userMsg) {
    return res.status(400).json({ error: "กรุณาส่งข้อความมาด้วย" });
  }

  try {
    // เซิร์ฟเวอร์ของเราคุยกับ Groq โดยใช้ API Key ที่ซ่อนอยู่ใน process.env
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}` // ดึง Key จากไฟล์ .env
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "user", content: userMsg }]
      })
    });

    if (!response.ok) throw new Error("Groq API Error");

    const data = await response.json();
    const aiReply = data.choices[0].message.content;

    // ส่งคำตอบกลับไปที่หน้าเว็บ
    res.json({ reply: aiReply });

  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "เกิดข้อผิดพลาดที่เซิร์ฟเวอร์" });
  }
});

// เปิดเซิร์ฟเวอร์
app.listen(port, () => {
  console.log(`✅ Server running at http://localhost:${port}`);
});
