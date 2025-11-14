🔧 CHECKLIST - RESOLVER ERROS DE DEPLOY NO VERCEL
=================================================

⚠️ O PROBLEMA:
O Vercel pode estar usando cache ou as variáveis de ambiente não foram atualizadas.
Os erros permanecem porque a implantação anterior não foi substituída.

✅ SOLUÇÃO - SIGA ESTES PASSOS:

1️⃣ LIMPAR CACHE NO VERCEL
   • Acesse: https://vercel.com/dashboard
   • Selecione: topbusanalise
   • Vá para: Settings → Advanced
   • Clique em: "Clear Build Cache"
   • Aguarde confirmação

2️⃣ ADICIONAR/VERIFICAR VARIÁVEIS DE AMBIENTE
   • Vá para: Settings → Environment Variables
   • Verifique se existem 3 variáveis:
     
     ✓ VITE_DASHBOARD_LOGIN = sinistro
     ✓ VITE_DASHBOARD_PASSWORD = 139702
     ✓ VITE_APPS_SCRIPT_URL = https://script.google.com/macros/s/AKfycbzWN0zjwL0iN_4WuDIbl7W-foaf3ckIJO_YmByQEt-PpnQpWR5HcQtT1OcBK4DS79Q5LA/exec
   
   • SE NÃO EXISTIREM, ADICIONE AGORA
   • Certifique-se que estão em TODOS os ambientes:
     ✓ Production
     ✓ Preview
     ✓ Development

3️⃣ FORÇAR NOVO DEPLOYMENT
   Opção A - Via Dashboard:
   • Vá para: Deployments
   • Clique no último deployment
   • Botão "..." → "Redeploy"
   • Marque: "Clear Cache"
   • Clique: "Redeploy"

   Opção B - Via Git (Já foi feito):
   • Um novo commit foi feito: f2169f6
   • O Vercel deve iniciar build automaticamente

4️⃣ AGUARDAR DEPLOYMENT
   • Vá para: Deployments
   • Espere o status mudar para "Ready"
   • Pode levar 2-5 minutos

5️⃣ TESTAR
   • Limpe cache do navegador: Ctrl+Shift+Delete
   • Acesse: https://seu-dominio.vercel.app
   • Clique em "Painel"
   • Digite: sinistro / 139702
   • Teste: seleção de empresa

📊 VERIFICAÇÃO FINAL:

[ ] Variáveis de ambiente adicionadas
[ ] Cache do Vercel limpo
[ ] Novo deployment feito (status: Ready)
[ ] Login funciona com sinistro/139702
[ ] Dropdown de empresa abre
[ ] Sem erros no console (F12)

❌ SE AINDA NÃO FUNCIONAR:

1. Abra Developer Tools (F12)
2. Vá para Console
3. Procure por erros vermelhos
4. Copie e compartilhe os erros

Erros comuns:
• "import.meta.env is undefined" → Variáveis não foram adicionadas
• "Dropdown não abre" → CSS não foi aplicado, limpe cache
• "Login não funciona" → Variáveis incorretas ou cache do navegador

=================================================

💡 DICA IMPORTANTE:
Se você já fez as mudanças em Settings → Environment Variables,
clique em "Clear Build Cache" PRIMEIRO, depois faça o redeploy.
Isso garante que o Vercel reconstrua tudo do zero.

=================================================
Data: 14 de Novembro de 2025
Status: Aguardando seu feedback após executar estes passos
