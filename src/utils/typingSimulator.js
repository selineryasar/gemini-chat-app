// src/utils/typingSimulator.js

/**
 * Yapay zeka yazma efektini simüle eder.
 * @param {string} text - Yazdırılacak metin.
 * @param {function} callback - Yazma işlemi bittiğinde çağrılacak fonksiyon.
 */
export const simulateTyping = async (text, callback) => {
  // Bu fonksiyonu doğrudan isTyping state'ini yönetmek için kullanmayacağız.
  // Bunun yerine, bu hook'u çağıran bileşen (useChat.js) state yönetimini yapacak.
  
  // 1-2 saniye arasında rastgele bir bekleme süresi
  await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
  
  // Belirtilen metni callback fonksiyonuna gönder
  callback(text);
};