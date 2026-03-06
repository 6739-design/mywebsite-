async function sendMessage() {
  const inputElement = document.getElementById("input");
  const chatWindow = document.getElementById("chat");
  const userMsg = inputElement.value.trim();

  if (!userMsg) return;

  // ฟังก์ชันป้องกัน XSS
  function appendMessage(sender, text, color = "black") {
    const p = document.createElement("p");
    p.style.color = color;
    p.innerHTML = `<b>${sender}:</b> `;
    p.appendChild(document.createTextNode(text));
    chatWindow.appendChild(p);
  }

  appendMessage("You", userMsg);
  inputElement.value = ""; 

  try {
    // ยิงไปที่ Backend ของเราแทน ไม่มีการเรียก Groq ตรงๆ อีกต่อไป
    const response = await fetch("http://localhost:3000/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: userMsg })
    });

    if (!response.ok) throw new Error("เชื่อมต่อเซิร์ฟเวอร์ไม่ได้");

    const data = await response.json();
    
    // แสดงผล
    appendMessage("AI", data.reply, "blue");
    chatWindow.scrollTop = chatWindow.scrollHeight;

  } catch (error) {
    appendMessage("System", `ระบบขัดข้อง: ${error.message}`, "red");
  }
}
