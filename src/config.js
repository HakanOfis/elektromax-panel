// Welke site dit paneel beheert.
export const OWNER = "HakanOfis";
export const REPO = "elektromax";
export const BRANCH = "main";
export const CONTENT_PATH = "src/content/site.json";
export const IMG_DIR = "src/assets/img";
// Versleutelde sleutel (zie Kurulum). Staat in de site-repo; de site-build negeert de map cms/.
export const PANEL_CONFIG_PATH = "cms/panel-config.json";
export const SITE_URL = "https://maxelektro.be/";
// Opent de site in een bepaalde taal (de site leest ?lang=…).
export const siteUrlFor = (lang) => `${SITE_URL}?lang=${lang}&v=${Date.now()}`;
export const RAW_BASE = `https://raw.githubusercontent.com/${OWNER}/${REPO}/${BRANCH}`;
export const PBKDF2_ITERATIONS = 2_000_000;
export const BRAND = { name: "Elektromax", defaultUser: "Abdullah" };
