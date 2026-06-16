# 🤖 LinkedIn AI Agent (website se bilkul alag)

Ye ek chhota robot hai jo **roz apne aap**:

1. AI ki sabse important khabar padhta hai (OpenAI, Claude/Anthropic, Google
   DeepMind, Hugging Face + tech news — sab public RSS se, safe tareeke se).
2. **200 shabd se kam** ka ek accha LinkedIn post likhta hai (pehle **Claude**,
   na chale to **Gemini**).
3. Tumhare paas **approval** ke liye bhejta hai.
4. Tum **haan** karoge tabhi LinkedIn par post karta hai. Bina permission kuch
   nahi hota. ✅

Iska tumhari website se **koi lena-dena nahi** hai — ye alag chalta hai.

---

## 🟢 Do tareeke hain isko chalane ke

### A) Apne laptop par (turant test ke liye, sabse asaan)
Terminal me draft dekho aur **y/n** dabao.

### B) GitHub par roz apne aap (set karke bhool jao)
Roz ek **GitHub Issue** banega draft ke saath. Tum us issue par **`approve`**
comment karoge (phone se bhi) → LinkedIn par post ho jayega.

Pehle dono ke liye **chaabiyan** chahiye 👇

---

## 🔑 Chaabiyan (ek baar banani hain)

### Chaabi 1 — Claude (post likhne ke liye)
1. Jao: <https://console.anthropic.com> → account banao
2. **API Keys → Create Key** → lamba code (`sk-ant-...`) copy karo
3. Ye `ANTHROPIC_API_KEY` hai
> Gemini ki chaabi optional hai (sirf backup ke liye).

### Chaabi 2 — LinkedIn (post chhaapne ke liye)
1. Jao: <https://www.linkedin.com/developers/apps> → **Create app**
2. App ka naam daalo, apne LinkedIn page se jodo, create karo
3. **Products** tab me ye 2 cheezein "Request" karo:
   - **Share on LinkedIn**
   - **Sign In with LinkedIn using OpenID Connect**
4. **Auth** tab → **OAuth 2.0 tools / Create token** → ye 3 tick lagao:
   `w_member_social`, `openid`, `profile` → token banao
5. Jo lamba token mile, copy karo → ye `LINKEDIN_ACCESS_TOKEN` hai
> ⚠️ Ye token **~60 din** chalta hai, phir dobara banana padta hai.

---

## 💻 Tareeka A — Laptop par chalana

```bash
cd linkedin-agent
cp .env.example .env        # .env file me apni chaabiyan paste karo
node generate.mjs           # ya:  npm run draft
```

- Robot draft dikhayega aur puchega: **"LinkedIn par post karein? (y/n)"**
- `y` dabao → post live. `n` dabao → cancel.

(Node.js 20 ya naya hona chahiye. <https://nodejs.org> se install kar lo.)

---

## ☁️ Tareeka B — GitHub par roz apne aap

1. Ye code apne GitHub repo ki **`main` branch** par hona chahiye (zaroori —
   GitHub sirf default branch ki workflow chalata hai). Is branch ka **Pull
   Request banakar `main` me merge** kar do.
2. GitHub par: **Settings → Secrets and variables → Actions → New repository
   secret** — ye add karo:
   - `ANTHROPIC_API_KEY` (Chaabi 1)
   - `LINKEDIN_ACCESS_TOKEN` (Chaabi 2)
   - *(optional)* `GEMINI_API_KEY`, `LINKEDIN_AUTHOR_URN`, `AGENT_BRAND_VOICE`
3. Test: **Actions** tab → **"LinkedIn draft (daily)"** → **Run workflow**
4. Thodi der me **Issues** tab me ek draft issue aayega 🎉
5. Us issue par comment karo:
   - **`approve`** (ya `yes` / `haan` / `y`) → LinkedIn par post ho jayega ✅
   - **`reject`** (ya `no`) → discard ho jayega 🗑️
6. Iske baad **roz subah 9 baje (UTC)** apne aap draft banega. Tum bas issue par
   approve likhna. (Time badalna ho to `.github/workflows/linkedin-draft.yml`
   me `cron` change karo.)

> 💡 GitHub ka draft issue tumhe email/app par notification dega. Us email ka
> reply me bhi `approve` likh sakte ho — wahi comment ban jayega.

---

## ⚙️ Customise

- **Khabar ke sources:** `lib/sources.mjs` me `DEFAULT_FEEDS` badlo (ya
  `AGENT_FEEDS` secret me RSS URLs comma se daalo).
- **Likhne ka style:** `AGENT_BRAND_VOICE` me apna tone likho.
- **Lambai:** 200-word limit `lib/writer.mjs` me set hai (`WORD_LIMIT`).
- **Time:** `.github/workflows/linkedin-draft.yml` me `cron` line.

---

## 🛡️ Safety
- Tumhari permission (`approve`) ke bina **kuch bhi post nahi hota**.
- Sirf tum (issue banane wale) hi approve kar sakte ho — koi aur comment kare to
  kuch nahi hota.
- Chaabiyan kabhi code me mat likhna — sirf `.env` (local) ya GitHub Secrets me.
