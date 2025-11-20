# 🚀 Deploy Apps Script v3.2 - Corrigido com Timestamp

## ✅ O que foi corrigido na v3.2

### Melhorias principais

- ✅ **Timestamp automático** adicionado como primeira coluna
- ✅ Campo **Chapa** corrigido (estava faltando no array)
- ✅ Ordem de colunas alinhada com planilha real
- ✅ IDs atualizados:
  - Sheet ID: `1ZtatcnU7jwHXrso5mSIMRFQIFFUhsihUyGvRK36klSo`
  - Drive Folder ID: `1Qjz3df_WZQOQmt9W_S1M25so4dsMcBT7`

### Frontend → Apps Script

| Frontend (FormularioSinistros.jsx) | Apps Script v3.2 |
|---|---|
| `unidade` | `empresa` (fixado como 'TOPBUS') |
| `data` | `dataHora` |
| `numeroCarro` | `onibus` |
| `chapa` | `chapa` ✅ NOVO |
| `responsabilidade` | `culpabilidade` |
| `testemunhas` (array) | `testemunhas` (array) |

### Apps Script → Google Sheets

A ordem das colunas foi **corrigida** para incluir Timestamp:

Timestamp | ID | DataHora | Local | Onibus | Motorista | Chapa | Terceiro | Testemunhas | Descricao | Imagens | PastaLink

```
Timestamp | ID | DataHora | Local | Onibus | Motorista | Chapa | Terceiro | Testemunhas | Descricao | Imagens | PastaLink
```

**Nota:** Timestamp é gerado automaticamente pelo Google Sheets ao inserir a linha.

## 📋 Passo 1: Copiar Novo Código

1. Abra: <https://script.google.com>
2. Selecione o projeto **TOPBUS Sinistros**
3. **Clique em "Código do Projeto"**
4. **Selecione TODO o código** (Ctrl+A)
5. **Delete tudo**
6. **Copie o código de**: `/workspaces/topbusanalise/APPS_SCRIPT_CODIGO.gs`
7. **Cole** no editor
8. **Salve** (Ctrl+S)

## 📌 Passo 2: Fazer Deploy

### 2.1 Deploy Novo

1. Clique no botão **"Deploy"** (azul, canto superior direito)
2. Clique em **"Novo Deployment"** (ícone "+")
3. Selecione tipo: **"Webapp"**
4. Preencha:
   - **Execute como**: Sua conta do Google
   - **Acesso com**: "Anyone" ⬅️ **IMPORTANTE!**
5. Clique **"Deploy"**
6. **Copie a URL** que aparecer

### 2.2 Atualizar .env.local (se URL for diferente)

```bash
VITE_APPS_SCRIPT_URL=https://script.google.com/macros/s/NOVA_URL/exec
VITE_DASHBOARD_LOGIN=sinistro
VITE_DASHBOARD_PASSWORD=139702
```

## 🧪 Passo 3: Testar com curl

```bash
curl -s -X POST "https://script.google.com/macros/s/SEU_CODE_AQUI/exec" \
  -H "Content-Type: application/json" \
  -d '{
    "unidade": "TOPBUS",
    "data": "2025-11-20T14:30",
    "local": "Av. Paulista, 1000 - São Paulo, SP",
    "numeroCarro": "TB-2450",
    "motorista": "Carlos Silva",
    "chapa": "2450",
    "responsabilidade": "TERCEIRO",
    "testemunhas": [{"nome": "João Silva", "telefone": "(11) 98765-4321"}],
    "descricao": "Teste de integração v3.2"
  }' | jq .
```

**Você deve ver:**

```json
{
  "sucesso": true,
  "mensagem": "Sinistro registrado com sucesso",
  "dados": {
    "protocolo": "SIN-TB-20251120-xxxxxx-xxxx",
    "empresa": "TOPBUS",
    "imagens": []
  }
}
```

## 📊 Verificar no Google Sheets

1. Abra: <https://docs.google.com/spreadsheets/d/1ZtatcnU7jwHXrso5mSIMRFQIFFUhsihUyGvRK36klSo>
2. Aba **"TOPBUS"** (gid=0)
3. Você deve ver a **nova linha** com os dados

**Esperado (ordem correta com Timestamp):**

```
Timestamp | ID | DataHora | Local | Onibus | Motorista | Chapa | Terceiro | Testemunhas | Descricao | Imagens | PastaLink
[AUTO] | SIN-TB-20251120-XXXXX | 2025-11-20T14:30 | Av. Paulista... | TB-2450 | Carlos Silva | 2450 | Terceiro | João Silva - (11) 98765-4321 | Teste... | | [LINK]
```

## 📁 Verificar no Google Drive

1. Acesse: <https://drive.google.com/drive/folders/1Qjz3df_WZQOQmt9W_S1M25so4dsMcBT7>
2. Verifique se a pasta **TOPBUS/SIN-TB-[PROTOCOLO]** foi criada
3. Deve conter o arquivo **metadata.json**

## 🔍 Se Não Funcionar

### Verificar Erros no Console

1. <https://script.google.com>
2. **Execução** (esquerda)
3. Procure por erros vermelhos
4. Anote a mensagem

### Testar Função Manualmente

1. No editor, clique no play **▶️** próximo a `function testDoPost()`
2. Veja a saída no console

### Verificar Permissões

1. **Deploy** > **Gerenciar deployments**
2. Clique no ícone de "edit" (lápis)
3. Verifique se está **"Anyone"** em "Acesso com"

## ✨ Próximo Passo

Depois que tudo funcionar, você pode:

1. **Testar via frontend React**: `npm start` e preencher o formulário
2. **Re-executar scripts de teste**: `bash teste-completo.sh`
3. **Deploy no Netlify**: Se tudo funcionar

---

**Data**: 2025-11-13  
**Versão**: 3.0  
**Status**: Pronto para Deploy ✅
