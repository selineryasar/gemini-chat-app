// src/services/localStorage.js

/**
 * Belirtilen anahtara göre localStorage'dan veri çeker ve JSON'a çevirir.
 * Hata durumunda null döner.
 * @param {string} key - localStorage anahtarı.
 * @returns {any | null} - JSON'a dönüştürülmüş veri veya null.
 */
export const getFromLocalStorage = (key) => {
  try {
    const serializedState = localStorage.getItem(key);
    if (serializedState === null) {
      return null;
    }
    return JSON.parse(serializedState);
  } catch (error) {
    console.error('localStorage\'dan veri okunurken hata:', error);
    return null;
  }
};

/**
 * Verilen veriyi JSON'a çevirerek localStorage'a kaydeder.
 * @param {string} key - localStorage anahtarı.
 * @param {any} value - Kaydedilecek veri.
 */
export const saveToLocalStorage = (key, value) => {
  try {
    const serializedState = JSON.stringify(value);
    localStorage.setItem(key, serializedState);
  } catch (error) {
    console.error('localStorage\'a veri kaydedilirken hata:', error);
  }
};