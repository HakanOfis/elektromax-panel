// Automatische vertaling van TR-wijzigingen naar NL/EN via MyMemory (gratis, geen sleutel, CORS).
// Limiet zonder account: ±5000 tekens per dag; alleen gewijzigde teksten worden vertaald.
import { SECTIONS, langPath } from "@/schema";

export const SOURCE = "tr";
export const TARGETS = ["nl", "en"];

// Sleutels die geen vertaalbare tekst bevatten: worden 1-op-1 overgenomen.
const COPY_KEYS = new Set(["type", "slug", "to", "primaryTo", "secondaryTo", "image", "url", "handle", "icon"]);

export class TranslateError extends Error {}

const cache = new Map();

function chunks(text, max = 450) {
  if (text.length <= max) return [text];
  const parts = text.match(/[^.!?\n]+[.!?]*\s*/g) ?? [text];
  const out = [];
  let cur = "";
  for (const p of parts) {
    if ((cur + p).length > max && cur) {
      out.push(cur);
      cur = "";
    }
    cur += p;
  }
  if (cur) out.push(cur);
  return out;
}

async function translateOne(text, target) {
  const res = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${SOURCE}|${target}`);
  if (!res.ok) throw new TranslateError(`Çeviri servisi yanıt vermedi (${res.status}).`);
  const j = await res.json();
  const out = j?.responseData?.translatedText ?? "";
  if (Number(j.responseStatus) !== 200 || /MYMEMORY WARNING|QUOTA/i.test(out)) {
    throw new TranslateError("Günlük ücretsiz çeviri sınırı doldu. Yarın tekrar deneyin ya da diğer dilleri elle düzenleyin.");
  }
  return out;
}

// Vakjargon (elektriciteit, België): termen die de automatische vertaling vaak mist.
const GLOSSARY = {
  nl: [
    [/\bkeuringen\b/gi, "keuringen"],
    [/\binspectie(s)?\b/gi, (m) => (m.toLowerCase().endsWith("s") ? "keuringen" : "keuring")],
    [/\bzekeringbord(en)?\b/gi, (m) => (m.toLowerCase().endsWith("en") ? "zekeringkasten" : "zekeringkast")],
    [/\bverdeelkast(en)?\b/gi, (m) => (m.toLowerCase().endsWith("en") ? "zekeringkasten" : "zekeringkast")],
    [/\boplaadstation(s)?\b/gi, (m) => (m.toLowerCase().endsWith("s") ? "laadpalen" : "laadpaal")],
  ],
  en: [[/\bkeuring\b/gi, "inspection"], [/\bfuse box(es)?\b/gi, (m) => (m.toLowerCase().endsWith("es") ? "distribution boards" : "distribution board")]],
};

function applyGlossary(text, target) {
  return (GLOSSARY[target] ?? []).reduce(
    (t, [re, rep]) =>
      t.replace(re, (m, ...a) => {
        const r = typeof rep === "function" ? rep(m, ...a) : rep;
        return m[0] === m[0].toUpperCase() ? r[0].toUpperCase() + r.slice(1) : r;
      }),
    text,
  );
}

export async function translate(text, target) {
  if (typeof text !== "string" || !text.trim()) return text;
  const key = `${target}\u0000${text}`;
  if (cache.has(key)) return cache.get(key);
  // alinea's (lege regels) apart vertalen zodat de opmaak blijft
  const paragraphs = text.split(/\n/);
  const out = [];
  for (const para of paragraphs) {
    if (!para.trim()) {
      out.push(para);
      continue;
    }
    const pieces = [];
    for (const c of chunks(para)) pieces.push(await translateOne(c.trim(), target));
    out.push(applyGlossary(pieces.join(" ").replace(/\s+/g, " ").trim(), target));
  }
  const result = out.join("\n");
  cache.set(key, result);
  return result;
}

/* ───── hulpfuncties ───── */

const getAt = (obj, path) => path.split(".").reduce((o, k) => (o == null ? o : o[k]), obj);
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);

function setAt(obj, path, value) {
  const keys = path.split(".");
  let o = obj;
  for (const k of keys.slice(0, -1)) o = o[k];
  o[keys.at(-1)] = value;
}

// Kiest de verdeling waarbij de langste regel zo kort mogelijk is.
function splitLines(text, n) {
  const words = text.split(/\s+/).filter(Boolean);
  if (words.length <= n) return [...words, ...Array(n - words.length).fill("")];
  let best = null;
  const walk = (start, parts) => {
    if (parts.length === n - 1) {
      const lines = [...parts, words.slice(start).join(" ")];
      const score = Math.max(...lines.map((l) => l.length));
      if (!best || score < best.score) best = { score, lines };
      return;
    }
    for (let end = start + 1; end <= words.length - (n - 1 - parts.length); end++) {
      walk(end, [...parts, words.slice(start, end).join(" ")]);
    }
  };
  walk(0, []);
  return best.lines;
}

/**
 * Vertaalt recursief wat er in TR veranderd is.
 * now/was: TR na/voor de wijziging; cur: de huidige waarde in de doeltaal.
 * Als TR en de doeltaal een verschillende structuur hebben (bv. EN heeft 6 projecten, TR 4),
 * wordt de doeltaal niet overschreven maar komt er een waarschuwing.
 */
async function walk(now, was, cur, t, ctx, key) {
  if (key && COPY_KEYS.has(key)) return now;
  if (typeof now === "string") {
    if (was !== undefined && now === was) return cur ?? now;
    ctx.done++;
    ctx.onProgress?.(ctx.done);
    return translate(now, t);
  }
  if (Array.isArray(now)) {
    const full = was === undefined;
    if (!full && Array.isArray(was) && was.length === now.length) {
      if (!Array.isArray(cur) || cur.length !== now.length) {
        if (!same(now, was)) ctx.warnings.add(ctx.label);
        return cur;
      }
      const out = [];
      for (let i = 0; i < now.length; i++) out.push(await walk(now[i], was[i], cur[i], t, ctx));
      return out;
    }
    // structuur gewijzigd (toegevoegd/verwijderd) of volledig nieuw
    if (!full && !(Array.isArray(cur) && Array.isArray(was) && cur.length === was.length)) {
      ctx.warnings.add(ctx.label);
      return cur;
    }
    const out = [];
    for (let i = 0; i < now.length; i++) out.push(await walk(now[i], undefined, undefined, t, ctx));
    return out;
  }
  if (now && typeof now === "object") {
    const out = { ...(cur && typeof cur === "object" ? cur : {}) };
    for (const k of Object.keys(now)) out[k] = await walk(now[k], was?.[k], cur?.[k], t, ctx, k);
    return out;
  }
  return now;
}

/**
 * Vertaalt de TR-wijzigingen (draft t.o.v. original) naar de doeltalen.
 * Velden die de gebruiker in een doeltaal zelf heeft aangepast, worden niet overschreven.
 * Geeft { draft, count, warnings } terug.
 */
export async function applyTranslations(draft, original, onProgress) {
  const next = structuredClone(draft);
  const ctx = { done: 0, onProgress, warnings: new Set(), label: "" };

  for (const section of SECTIONS) {
    for (const f of section.fields) {
      const now = getAt(draft, langPath(f.path, SOURCE));
      const was = getAt(original, langPath(f.path, SOURCE));
      if (same(now, was)) continue;

      for (const t of TARGETS) {
        const tPath = langPath(f.path, t);
        if (!same(getAt(draft, tPath), getAt(original, tPath))) continue; // handmatig aangepast
        ctx.label = `${section.title} → ${f.label} (${t.toUpperCase()})`;

        if (f.type === "lines") {
          ctx.done++;
          onProgress?.(ctx.done);
          setAt(next, tPath, splitLines(await translate(now.join(" "), t), now.length));
        } else {
          setAt(next, tPath, await walk(now, was, getAt(draft, tPath), t, ctx));
        }
      }
    }
  }
  return { draft: next, count: ctx.done, warnings: [...ctx.warnings] };
}
