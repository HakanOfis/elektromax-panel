// De GitHub-sleutel wordt versleuteld met AES-256-GCM; de sleutel daarvoor komt uit
// gebruikersnaam + wachtwoord via PBKDF2-SHA256. Het wachtwoord zelf staat nergens in de code.
import { PBKDF2_ITERATIONS } from "@/config";

const enc = new TextEncoder();
const dec = new TextDecoder();

const toB64 = (buf) => btoa(String.fromCharCode(...new Uint8Array(buf)));
const fromB64 = (s) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0));

async function deriveKey(username, password, salt, iterations) {
  const material = await crypto.subtle.importKey(
    "raw",
    enc.encode(`${username.trim().toLowerCase()}:${password}`),
    "PBKDF2",
    false,
    ["deriveKey"],
  );
  return crypto.subtle.deriveKey(
    { name: "PBKDF2", hash: "SHA-256", salt, iterations },
    material,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"],
  );
}

export async function encryptToken(token, username, password) {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await deriveKey(username, password, salt, PBKDF2_ITERATIONS);
  const ct = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, enc.encode(token));
  return { v: 1, kdf: "PBKDF2-SHA256", iterations: PBKDF2_ITERATIONS, salt: toB64(salt), iv: toB64(iv), ct: toB64(ct) };
}

// Geeft de sleutel terug, of null bij een verkeerde gebruikersnaam/wachtwoord.
export async function decryptToken(config, username, password) {
  try {
    const key = await deriveKey(username, password, fromB64(config.salt), config.iterations);
    const pt = await crypto.subtle.decrypt({ name: "AES-GCM", iv: fromB64(config.iv) }, key, fromB64(config.ct));
    return dec.decode(pt);
  } catch {
    return null;
  }
}
