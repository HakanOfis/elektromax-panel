# Elektromax yönetim paneli

https://maxelektro.be sitesinin metinlerini (NL/EN/TR), fotoğraflarını ve iletişim bilgilerini düzenlemek için panel.

- Adres: https://hakanofis.github.io/elektromax-panel/
- Giriş: kullanıcı adı ve şifre (yöneticiden alınır).
- "Yayınla" değişiklikleri `HakanOfis/elektromax` deposuna tek commit olarak yazar; site 1–2 dakika içinde güncellenir.
- Türkçe değişiklikler NL ve EN'ye otomatik çevrilebilir (MyMemory, günde ~5000 karakter). Yapısı farklı listelere (örn. EN'deki 6 proje) dokunulmaz, uyarı verilir.

## Nasıl çalışır

- İçerik: `elektromax/src/content/site.json`, fotoğraflar: `elektromax/src/assets/img/`.
- Panelin GitHub anahtarı kullanıcı adı + şifreyle (PBKDF2-SHA256, 2.000.000 tur → AES-256-GCM) kilitlenip `elektromax/cms/panel-config.json` dosyasında saklanır. Şifre kodda yoktur.
- Anahtar sadece `elektromax` deposuna yetkili bir **fine-grained** anahtar olmalıdır (Contents: Read and write, Actions: Read-only).

## İlk kurulum / anahtar yenileme

1. https://github.com/settings/personal-access-tokens/new → sadece `HakanOfis/elektromax`, izinler yukarıdaki gibi.
2. https://hakanofis.github.io/elektromax-panel/#kurulum → anahtar, kullanıcı adı ve şifre → "Kontrol et ve kaydet".

## Geliştirme

```bash
npm install
npm run dev
npm run build
```
