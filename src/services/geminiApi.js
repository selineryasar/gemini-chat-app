// src/services/geminiApi.js

const apiKey = process.env.REACT_APP_GEMINI_API_KEY;

/**
 * Verilen metin için Gemini API'den cevap alır.
 * @param {string} prompt - Gemini'ye gönderilecek kullanıcı metni.
 * @returns {Promise<string>} - Gemini'den gelen cevap metni.
 */
export const getGeminiResponse = async (prompt) => {
  if (!apiKey || apiKey === 'demo-key') {
    // API anahtarı yoksa demo cevapları döndür
    const demoResponses = [
      "Merhaba! Size nasıl yardımcı olabilirim? Bu modern arayüz ile sohbet etmek çok keyifli!",
      "Harika bir soru! Bu konuda size detaylı bilgi verebilirim. Modern yapay zeka teknolojileri günümüzde çok hızla gelişiyor.",
      "Tabii ki! Size bu konuda yardımcı olmaktan mutluluk duyarım. Modern tasarım ile kullanıcı deneyimi çok daha iyi oluyor.",
      "Bu gerçekten ilginç bir konu. Yapay zeka ve modern arayüzler birleştiğinde harika sonuçlar ortaya çıkıyor!",
      "Elbette size yardımcı olabilirim! Bu konuda elimden geldiğince detaylı açıklama yapabilirim.",
      "Çok güzel bir soru! Bu konu hakkında konuşmak için sabırsızlanıyorum. Ne öğrenmek istiyorsunuz?"
    ];
    return demoResponses[Math.floor(Math.random() * demoResponses.length)];
  }

  const payload = {
    contents: [{ parts: [{ text: prompt }] }]
  };
  
const apiUrl =
  `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }

  const result = await response.json();
  return result.candidates[0].content.parts[0].text;
};