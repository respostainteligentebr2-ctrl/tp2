# 🚀 DEPLOY PRONTO - INSTRUÇÕES FINAIS

**Status:** ✅ Build concluído | Netlify CLI instalado  
**Data:** 2025-11-13 08:38 UTC

---

## 📦 SITUAÇÃO ATUAL

✅ **Build gerado com sucesso:**
```
dist/
├── index.html (0.57 KB)
├── assets/
│   ├── index-67aa9da9.css (14.64 KB)
│   └── index-d3ff241b.js (161.10 KB)
```

✅ **Netlify CLI instalado:** v23.10.0  
✅ **Configuração pronta:** `netlify.toml`  
✅ **Apps Script funcionando:** v5  

---

## 🎯 PRÓXIMO PASSO: ESCOLHA UMA OPÇÃO

### Opção A: Deploy via GitHub (Recomendado - Interface Web)

**Vantagens:** Sem necessidade de autenticação CLI, deploy automático em cada push

**Passos:**

1. **Acesse o Netlify:**
   ```
   https://app.netlify.com/
   ```

2. **Conecte o repositório:**
   - Clique em "Add new site" → "Import an existing project"
   - Escolha "GitHub"
   - Selecione: `guilhermholiveira-debug/topbusanalise`

3. **Configure o build:**
   - Branch: `main`
   - Build command: `npm run build`
   - Publish directory: `dist`

4. **Adicione variáveis de ambiente:**
   Em "Site settings" → "Environment variables", adicione:
   ```
   REACT_APP_APPS_SCRIPT_URL=https://script.google.com/macros/s/AKfycbzWN0zjwL0iN_4WuDIbl7W-foaf3ckIJO_YmByQEt-PpnQpWR5HcQtT1OcBK4DS79Q5LA/exec
   REACT_APP_API_KEY=a03f60d688b3b52900e5cd8faa74a4d5c4a551e27d02828e4f11e0d5d4584812
   ```

5. **Deploy:**
   - Clique em "Deploy site"
   - Aguarde ~2-3 minutos

---

### Opção B: Deploy via CLI (Rápido - Terminal)

**Vantagens:** Deploy imediato, controle total

**Passos:**

1. **Login no Netlify:**
   ```bash
   netlify login
   ```
   (Abrirá navegador para autenticação)

2. **Deploy:**
   ```bash
   cd /workspaces/topbusanalise
   netlify deploy --prod
   ```

3. **Configure quando solicitado:**
   - Create & configure a new site? **Yes**
   - Team: **Escolha seu team**
   - Site name: **topbus-sinistros** (ou outro nome)
   - Publish directory: **dist**

4. **Adicione variáveis de ambiente depois:**
   Acesse o site no Netlify e adicione as variáveis em "Site settings"

---

### Opção C: Deploy Manual (Drag & Drop)

**Vantagens:** Mais simples, sem configuração

**Passos:**

1. **Acesse:**
   ```
   https://app.netlify.com/drop
   ```

2. **Arraste a pasta `dist/`** para a área de upload

3. **Configure variáveis depois** no painel do site

⚠️ **Limitação:** Não há deploy automático em novos commits

---

## 🔑 VARIÁVEIS DE AMBIENTE (IMPORTANTE!)

**Não esqueça de adicionar no Netlify:**
```env
REACT_APP_APPS_SCRIPT_URL=https://script.google.com/macros/s/AKfycbzWN0zjwL0iN_4WuDIbl7W-foaf3ckIJO_YmByQEt-PpnQpWR5HcQtT1OcBK4DS79Q5LA/exec
REACT_APP_API_KEY=a03f60d688b3b52900e5cd8faa74a4d5c4a551e27d02828e4f11e0d5d4584812
```

**Como adicionar:**
1. Painel do Netlify → Site settings → Environment variables
2. Clique em "Add a variable"
3. Cole o nome e valor de cada variável
4. Clique em "Save"

---

## 🧪 APÓS O DEPLOY - TESTE COMPLETO

### 1. Acesse seu site
```
https://[seu-site-id].netlify.app
```

### 2. Teste o formulário
- Selecione unidade (TOPBUS ou BELO_MONTE)
- Preencha todos os campos
- Clique em "Registrar Sinistro"
- Confirme mensagem de sucesso com protocolo

### 3. Verifique Google Sheets
```
https://docs.google.com/spreadsheets/d/1ZtatcnU7jwHXrso5mSIMRFQIFFUhsihUyGvRK36klSo
```
- Vá para aba TOPBUS ou BELO_MONTE
- Confirme nova linha com os dados

### 4. Verifique Google Drive
```
https://drive.google.com/drive/folders/1AQFiXi9-xDulKgO-qZCF3tRrBIsrWcf4
```
- Navegue até TOPBUS/ ou BELO_MONTE/
- Confirme pasta com o protocolo
- Abra `metadata.json`

### 5. Teste a listagem
- Clique no botão "Ver Listagem"
- Verifique se os sinistros aparecem
- Teste filtros por unidade
- Teste busca por protocolo/local/motorista

---

## 📊 CHECKLIST FINAL

### Build & Deploy
- [x] Dependências instaladas
- [x] Build gerado localmente
- [x] Netlify CLI instalado
- [ ] Deploy executado (escolha Opção A, B ou C acima)
- [ ] Variáveis de ambiente configuradas

### Testes Pós-Deploy
- [ ] Site acessível
- [ ] Formulário funcionando
- [ ] Dados salvos no Sheets
- [ ] Pasta criada no Drive
- [ ] Listagem carregando
- [ ] Filtros funcionando

---

## 🎯 COMANDOS ÚTEIS

### Rebuild local
```bash
npm run build
```

### Preview local antes do deploy
```bash
npm run dev
# Acesse: http://localhost:5173
```

### Deploy CLI (após login)
```bash
netlify deploy --prod
```

### Ver status do site
```bash
netlify status
```

### Abrir dashboard do Netlify
```bash
netlify open
```

---

## 🔗 LINKS IMPORTANTES

**Repositório GitHub:**
```
https://github.com/guilhermholiveira-debug/topbusanalise
```

**Apps Script API:**
```
https://script.google.com/macros/s/AKfycbzWN0zjwL0iN_4WuDIbl7W-foaf3ckIJO_YmByQEt-PpnQpWR5HcQtT1OcBK4DS79Q5LA/exec
```

**Google Sheets:**
```
https://docs.google.com/spreadsheets/d/1ZtatcnU7jwHXrso5mSIMRFQIFFUhsihUyGvRK36klSo
```

**Google Drive:**
```
https://drive.google.com/drive/folders/1AQFiXi9-xDulKgO-qZCF3tRrBIsrWcf4
```

---

## 💡 DICA PRO

Para automatizar deploys futuros com GitHub:
1. Use **Opção A** (Deploy via GitHub)
2. Todo `git push origin main` fará deploy automático
3. Você verá o status no Netlify dashboard

---

**Tudo pronto! Escolha uma opção acima e faça o deploy.** 🚀

_Build size: 176.31 KB | Gzip: 54.24 KB_
