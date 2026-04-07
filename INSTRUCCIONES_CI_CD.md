# 🚀 CONFIGURACIÓN PASO A PASO DEL CI/CD

Sigue estos pasos EN ORDEN para configurar el despliegue automático.

---

## ✅ PASO 1: Instalar Vercel CLI (YA HECHO ✓)

```powershell
npm install -g vercel
```

---

## ✅ PASO 2: Login en Vercel

Ejecuta en la terminal:

```powershell
vercel login
```

Se abrirá tu navegador. Inicia sesión con:
- GitHub
- GitLab  
- Bitbucket
- Email

Luego vuelve a la terminal y verás: **"Success! Logged in!"**

---

## ✅ PASO 3: Vincular el Proyecto

Ejecuta:

```powershell
vercel link
```

**Responde las preguntas:**

1. **Set up "~/Downloads/udea-trueques"?**  
   → Escribe: `Y` y presiona Enter

2. **Which scope do you want to deploy to?**  
   → Usa las flechas ↑↓ para seleccionar tu cuenta  
   → Presiona Enter

3. **Link to existing project?**  
   → Escribe: `N` (No, crear uno nuevo)  
   → Presiona Enter

4. **What's your project's name?**  
   → Escribe: `trueques-udea`  
   → Presiona Enter

5. **In which directory is your code located?**  
   → Presiona Enter (usa el default `.`)

**Resultado:** Se creará la carpeta `.vercel/` con `project.json`

---

## ✅ PASO 4: Ver los IDs de Vercel

Ejecuta:

```powershell
type .vercel\project.json
```

Verás algo como:

```json
{
  "orgId": "team_abc123xyz",
  "projectId": "prj_xyz789abc"
}
```

**COPIA estos valores:**
- `orgId` → Este es tu **VERCEL_ORG_ID**
- `projectId` → Este es tu **VERCEL_PROJECT_ID**

---

## ✅ PASO 5: Obtener el Token de Vercel

1. Abre: https://vercel.com/account/tokens
2. Click: **"Create Token"**
3. Nombre: `GitHub Actions`
4. Scope: **Full Account**
5. Expiration: **No Expiration**
6. Click: **"Create"**
7. **COPIA EL TOKEN** (ej: `abc123xyz...`)

---

## ✅ PASO 6: Configurar Secrets en GitHub

1. Ve a: https://github.com/cristinavergara1/Trueques-Udea
2. Click: **Settings** (pestaña superior)
3. Menú lateral: **Secrets and variables** → **Actions**
4. Click: **"New repository secret"**

**Crea estos 3 secrets:**

### Secret 1:
- **Name:** `VERCEL_TOKEN`
- **Secret:** Pega el token que copiaste en el Paso 5
- Click **"Add secret"**

### Secret 2:
- **Name:** `VERCEL_ORG_ID`
- **Secret:** Pega el `orgId` del Paso 4 (ej: `team_abc123xyz`)
- Click **"Add secret"**

### Secret 3:
- **Name:** `VERCEL_PROJECT_ID`
- **Secret:** Pega el `projectId` del Paso 4 (ej: `prj_xyz789abc`)
- Click **"Add secret"**

---

## ✅ PASO 7: Subir Archivos a GitHub

Ejecuta:

```powershell
git add .
git commit -m "Add CI/CD with GitHub Actions and Vercel"
git push origin main
```

---

## ✅ PASO 8: Verificar el Deploy

1. Ve a: https://github.com/cristinavergara1/Trueques-Udea/actions
2. Verás el workflow **"CI/CD - Deploy to Vercel"** ejecutándose
3. Click en el workflow para ver el progreso
4. Cuando termine (✓ verde), verás 3 jobs completados:
   - ✓ Build and Test
   - ✓ Deploy to Vercel (Production)

5. Ve al commit más reciente, verás un comentario con la URL de Vercel

---

## 🎯 RESUMEN DE SECRETS

| Secret Name | Dónde obtenerlo |
|-------------|----------------|
| `VERCEL_TOKEN` | https://vercel.com/account/tokens |
| `VERCEL_ORG_ID` | `.vercel/project.json` → `orgId` |
| `VERCEL_PROJECT_ID` | `.vercel/project.json` → `projectId` |

---

## ✅ CHECKLIST FINAL

- [ ] Instalé Vercel CLI
- [ ] Hice `vercel login`
- [ ] Ejecuté `vercel link`
- [ ] Obtuve los IDs de `.vercel/project.json`
- [ ] Creé el token en Vercel
- [ ] Configuré los 3 secrets en GitHub
- [ ] Subí los archivos a GitHub
- [ ] El workflow se ejecutó correctamente

---

## 🐛 Problemas Comunes

**Error: "Missing required secret VERCEL_TOKEN"**
→ Verifica que el secret se llame exactamente `VERCEL_TOKEN` (mayúsculas)

**Error: "Project not found"**
→ Verifica que `VERCEL_PROJECT_ID` sea correcto del archivo `.vercel/project.json`

**El workflow no se ejecuta**
→ Ve a Settings → Actions → General → Allow all actions

---

## 📞 ¿Necesitas Ayuda?

Si tienes algún error, copia el mensaje de error completo y búscame.

---

**¡Éxito! 🎉**
