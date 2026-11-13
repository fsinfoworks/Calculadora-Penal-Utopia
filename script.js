// ===================== ELEMENTOS =====================
const crimeContainer = document.getElementById("crimeContainer");
const searchCrime = document.getElementById("searchCrime");
const calcularBtn = document.getElementById("calcularBtn");
const gerarRelatorio = document.getElementById("gerarRelatorio");

const checklistModal = document.getElementById("checklistModal");
const confirmarChecklist = document.getElementById("confirmarChecklist");
const cancelarChecklist = document.getElementById("cancelarChecklist");

const guarnicao = document.getElementById("guarnicao");
const boAuto = document.getElementById("boAuto");

// ===================== RESULTADO GLOBAL =====================
let resultadoFinal = {
  pena: 0,
  multa: 0,
  fianca: ""
};

// ===================== FORMATADOR DE MOEDA =====================
function formatarMoeda(valor) {
  return Number(valor).toLocaleString("pt-BR");
}

// ===================== DESCRIÇÃO ATENUANTES / AGRAVANTES =====================
const efeitosMapa = {
  // ATENUANTES
  advogado: "Redução de 30% na pena, multa e fiança",
  reup: "Redução de 10% na pena, multa e fiança",
  confesso: "Redução de 10% na pena, multa e fiança",
  delacao: "Redução de 50% na pena, multa e fiança (exige delegado)",
  delegado: "Habilita delação premiada",
  colaboracao: "Redução de 10% na pena, multa e fiança",
  porte_legal: "Redução de 10% na pena, multa e fiança",

  // AGRAVANTES
  reincidente: "Aumenta em 10% a pena, multa e fiança",
  resistencia: "Aumenta em 10% a pena, multa e fiança",
  fuga: "Aumenta em 10% a pena, multa e fiança",
  desacato: "Aumenta em 10% a pena, multa e fiança"
};

// ===================== BO AUTOMÁTICO =====================
const boCounters = {
  PRF: 1, PMERJ: 1, CHOQUE: 1, BOPE: 1, PCERJ: 1, CORE: 1, EXERCITO: 1
};
const boPrefixo = {
  PRF: "PRF", PMERJ: "PM", CHOQUE: "CHQ", BOPE: "BOPE", PCERJ: "PC", CORE: "CORE", EXERCITO: "EB"
};

function atualizarBO() {
  const g = guarnicao.value;
  boAuto.value = `${boPrefixo[g]}-${boCounters[g].toString().padStart(3, "0")}`;
  boCounters[g]++;
}
guarnicao.addEventListener("change", atualizarBO);
atualizarBO();

// ===================== BASE COMPLETA DE CRIMES (EDITE AQUI) =====================
// Preencha 'fianca' com o valor numérico (ex: 30000) ou false para "Não aplicável"
const crimeCategorias = [
  {
    titulo: "Crimes contra a Vida",
    gravidade: "altissima",
    icone: "☠️",
    crimes: [
      { artigo: "Art. 121 §2º", nome: "Homicídio Doloso Qualificado", meses: 180, multa: 5000, fianca: false },
      { artigo: "Art. 121", nome: "Homicídio Doloso", meses: 120, multa: 4000, fianca: false },
      { artigo: "Art. 121 c/c Art. 14", nome: "Tentativa de Homicídio", meses: 100, multa: 3000, fianca: 1500 },
      { artigo: "Art. 121 §3º", nome: "Homicídio Culposo", meses: 60, multa: 2000, fianca: 1000 },
      { artigo: "Art. 302 CTB", nome: "Homicídio Culposo no Trânsito", meses: 48, multa: 1500, fianca: 750 }
    ]
  },
  {
    titulo: "Crimes Violentos",
    gravidade: "alta",
    icone: "🔥",
    crimes: [
      { artigo: "Art. 129", nome: "Lesão Corporal", meses: 24, multa: 1000, fianca: 500 },
      { artigo: "Art. 250", nome: "Incêndio", meses: 36, multa: 2000, fianca: 1000 },
      { artigo: "Art. 159", nome: "Sequestro", meses: 120, multa: 5000, fianca: false },
      { artigo: "Art. 148", nome: "Cárcere Privado", meses: 80, multa: 3000, fianca: 1500 }
    ]
  },
  {
    titulo: "Crimes contra o Patrimônio Veicular",
    gravidade: "media",
    icone: "🚗",
    crimes: [
      { artigo: "Art. 311", nome: "Desmanche de Veículos", meses: 60, multa: 2500, fianca: 1250 },
      { artigo: "Art. 155 §4º", nome: "Furto de Veículos", meses: 48, multa: 2000, fianca: 1000 },
      { artigo: "Art. 180", nome: "Receptação de Veículos", meses: 36, multa: 1800, fianca: 900 },
      { artigo: "Art. 157", nome: "Roubo/Assalto à Veículos", meses: 72, multa: 3500, fianca: 1750 }
    ]
  },
  {
    titulo: "Crimes contra o Patrimônio",
    gravidade: "media",
    icone: "💰",
    crimes: [
      { artigo: "Art. 157", nome: "Roubo/Assalto", meses: 48, multa: 2500, fianca: 1250 },
      { artigo: "Art. 155", nome: "Furto", meses: 24, multa: 1200, fianca: 600 },
      { artigo: "Art. 155 §4º", nome: "Furto a Caixa Eletrônico", meses: 30, multa: 2000, fianca: 1000 },
      { artigo: "Art. 158", nome: "Extorsão", meses: 72, multa: 3500, fianca: 1750 },
      { artigo: "Art. 171", nome: "Estelionato", meses: 30, multa: 1500, fianca: 750 },
      { artigo: "Art. 163", nome: "Dano ao Patrimônio Público", meses: 24, multa: 2000, fianca: 1000 },
      { artigo: "Art. 150", nome: "Invasão de Imóvel", meses: 36, multa: 1800, fianca: 900 }
    ]
  },
  {
    titulo: "Porte, Posse e Tráfico de Armas",
    gravidade: "media",
    icone: "🔫",
    crimes: [
      { artigo: "Lei 10.826 Art.12", nome: "Posse de Peças de Armas", meses: 12, multa: 1000, fianca: 500 },
      { artigo: "Lei 10.826 Art.13", nome: "Posse de Artefatos para Produção de Munição", meses: 18, multa: 1200, fianca: 600 },
      { artigo: "Lei 10.826 Art.12", nome: "Posse de Arma Ilegal", meses: 24, multa: 2000, fianca: 1000 },
      { artigo: "Lei 10.826 Art.14", nome: "Porte de Arma Ilegal", meses: 36, multa: 3000, fianca: 1500 },
      { artigo: "Lei 10.826 Art.15", nome: "Disparo de Arma de Fogo", meses: 24, multa: 2000, fianca: 1000 },
      { artigo: "Lei 10.826 Art.12", nome: "Posse de Munição (menos de 101)", meses: 12, multa: 800, fianca: 400 },
      { artigo: "Lei 10.826 Art.18", nome: "Tráfico de Armas (mais de 3)", meses: 60, multa: 5000, fianca: false }
    ]
  },
  {
    titulo: "Drogas / Narcotráfico",
    gravidade: "alta",
    icone: "💊",
    crimes: [
      { artigo: "Lei 11.343 Art.28", nome: "Posse de Drogas (menos de 101)", meses: 12, multa: 1000, fianca: 500 },
      { artigo: "Lei 11.343 Art.33", nome: "Tráfico de Drogas (mais de 100)", meses: 72, multa: 4000, fianca: false },
      { artigo: "Lei 11.343 Art.33 §4º", nome: "Entrega de Drogas (aviãozinho)", meses: 48, multa: 2500, fianca: 1250 },
      { artigo: "Lei 11.343 Art.34", nome: "Posse de Componentes Narcóticos", meses: 36, multa: 2000, fianca: 1000 },
      { artigo: "Lei 11.343 Art.35", nome: "Associação ao Tráfico", meses: 60, multa: 3500, fianca: false },
      { artigo: "Lei 11.343 Art.36", nome: "Dinheiro Sujo", meses: 24, multa: 1800, fianca: 900 }
    ]
  },
  {
    titulo: "Ordem Pública",
    gravidade: "baixa",
    icone: "⚠️",
    crimes: [
      { artigo: "Art. 286", nome: "Apologia ao Crime", meses: 12, multa: 800, fianca: 400 },
      { artigo: "Art. 333", nome: "Suborno", meses: 24, multa: 2000, fianca: 1000 },
      { artigo: "Art. 147", nome: "Ameaça", meses: 18, multa: 1200, fianca: 600 },
      { artigo: "Art. 340", nome: "Falsa Comunicação de Crime", meses: 12, multa: 800, fianca: 400 },
      { artigo: "Art. 265", nome: "Uso Indevido do 190/192", meses: 12, multa: 600, fianca: 300 },
      { artigo: "Art. 330", nome: "Desobediência", meses: 12, multa: 700, fianca: 350 },
      { artigo: "Art. 233", nome: "Atentado ao Pudor", meses: 18, multa: 1500, fianca: 750 },
      { artigo: "Art. 150", nome: "Invasão de Propriedade", meses: 24, multa: 1400, fianca: 700 },
      { artigo: "Art. 19 LCP", nome: "Uso de Máscara", meses: 12, multa: 500, fianca: 250 },
      { artigo: "Lei 10.826", nome: "Uso de Equipamentos Restritos", meses: 12, multa: 1000, fianca: 500 },
      { artigo: "Art. 19 LCP", nome: "Armas Brancas", meses: 12, multa: 700, fianca: 350 },
      { artigo: "Art. 299", nome: "Falsidade Ideológica", meses: 12, multa: 900, fianca: 450 },
      { artigo: "Art. 328", nome: "Exercício Ilegal da Profissão", meses: 15, multa: 3000, fianca: 1500 },
      { artigo: "Art. 135", nome: "Omissão de Socorro", meses: 12, multa: 800, fianca: 400 }
    ]
  },
  {
    titulo: "Crimes contra Autoridade (Sem Fiança)",
    gravidade: "alta",
    icone: "🛑",
    crimes: [
      { artigo: "Art. 331", nome: "Desacato", meses: 36, multa: 2000, fianca: false },
      { artigo: "Art. 329", nome: "Resistência à Prisão", meses: 24, multa: 1500, fianca: false },
      { artigo: "Art. 316", nome: "Abuso de Autoridade", meses: 36, multa: 2000, fianca: false },
      { artigo: "Art. 319", nome: "Prevaricação", meses: 24, multa: 1800, fianca: false },
      { artigo: "Art. 344", nome: "Obstrução da Justiça", meses: 36, multa: 2500, fianca: false },
      { artigo: "Art. 317/333", nome: "Corrupção Ativa/Passiva", meses: 48, multa: 3000, fianca: false }
    ]
  },
  {
    titulo: "Crimes de Trânsito",
    gravidade: "leve",
    icone: "🚦️",
    crimes: [
      { artigo: "Art. 311 CTB", nome: "Tentativa de Fuga", meses: 12, multa: 800, fianca: 400 },
      { artigo: "Art. 306 CTB", nome: "Condução Imprudente", meses: 12, multa: 700, fianca: 350 },
      { artigo: "Art. 193 CTB", nome: "Dirigir na Contramão", meses: 12, multa: 700, fianca: 350 },
      { artigo: "Art. 308 CTB", nome: "Alta Velocidade", meses: 12, multa: 1000, fianca: 500 },
      { artigo: "Art. 228 CTB", nome: "Poluição Sonora", meses: 6, multa: 500, fianca: 250 },
      { artigo: "Art. 230 CTB", nome: "Uso Excessivo de Insulfilm", meses: 6, multa: 500, fianca: 250 },
      { artigo: "Art. 230 CTB", nome: "Veículo Muito Danificado", meses: 12, multa: 800, fianca: 400 },
      { artigo: "Art. 230 CTB", nome: "Veículo Irregular", meses: 12, multa: 800, fianca: 400 },
      { artigo: "Art. 181 CTB", nome: "Veículo Ilegalmente Estacionado", meses: 6, multa: 400, fianca: 200 },
      { artigo: "Art. 302 CTB", nome: "Tentativa de Homicídio no Trânsito", meses: 72, multa: 3500, fianca: false }
    ]
  }
];

// ===================== RENDERIZAÇÃO DOS CRIMES =====================
crimeCategorias.forEach(cat => {
  const bloco = document.createElement("div");
  bloco.className = "crime-bloco";
  const colCount = getComputedStyle(crimeContainer).gridTemplateColumns.split(" ").length || 3;
  const index = crimeContainer.children.length;
  bloco.dataset.coluna = index % colCount;

  const header = document.createElement("div");
  header.className = "crime-header";
  header.innerHTML = `
    <span class="crime-icon">${cat.icone}</span>
    <span>${cat.titulo}</span>
  `;
  header.dataset.gravidade = cat.gravidade;

  const lista = document.createElement("div");
  lista.className = "crime-lista hidden";

  cat.crimes.forEach(c => {
    const item = document.createElement("div");
    item.className = "crime-item";
    item.innerHTML = `
      <strong>${c.artigo}</strong><br>
      <span class="crime-nome">${c.nome}</span>
    `;

    item.dataset.meses = c.meses;
    item.dataset.multa = c.multa;
    item.dataset.fianca = typeof c.fianca === "number" ? c.fianca : "false";
    item.dataset.nome = c.nome;
    item.dataset.artigo = c.artigo;

    item.onclick = () => {
      item.classList.toggle("selected");
    };

    lista.appendChild(item);
  });

  bloco.appendChild(header);
  bloco.appendChild(lista);
  crimeContainer.appendChild(bloco);
});

// ===================== NORMALIZAR TEXTO (REMOVE ACENTOS) =====================
function normalizarTexto(texto) {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

// ===================== PESQUISA DE CRIMES =====================
searchCrime.addEventListener("input", (e) => {
  const termo = normalizarTexto(e.target.value.trim());

  document.querySelectorAll("#crimeContainer .crime-bloco").forEach(bloco => {
    const header = bloco.querySelector(".crime-header");
    const lista = bloco.querySelector(".crime-lista");
    const itens = bloco.querySelectorAll(".crime-item");

    let encontrou = false;

    itens.forEach(item => {
      const texto = normalizarTexto(item.textContent);
      if (texto.includes(termo)) {
        item.style.display = "block";
        encontrou = true;
      } else {
        item.style.display = "none";
      }
    });

    if (termo === "") {
      header.classList.remove("open");
      lista.classList.add("hidden");
      itens.forEach(i => i.style.display = "block");
    } else if (encontrou) {
      header.classList.add("open");
      lista.classList.remove("hidden");
    } else {
      header.classList.remove("open");
      lista.classList.add("hidden");
    }
  });
});

// ===================== ATENUANTES =====================
const atenuantesBtns = [...document.querySelectorAll("#atenuantesBtns .crime-item")];

function getAtenuantes() {
  return atenuantesBtns
    .filter(b => b.classList.contains("selected"))
    .map(b => b.dataset.value);
}

atenuantesBtns.forEach(btn => {
  btn.onclick = () => {
    const v = btn.dataset.value;
    const ativos = getAtenuantes();

    if (v === "delacao" && !ativos.includes("delegado")) {
      return alert("⚠️ Delação só pode ser aplicada com Delegado Presente.");
    }

    if ((v === "reup" || v === "confesso") && !ativos.includes("advogado")) {
      return alert("⚠️ Necessário advogado constituído.");
    }

    btn.classList.toggle("selected");
  };
});

// ===================== CONTROLE ADVOGADO / DELEGADO =====================
const advogadoNome = document.getElementById("advogadoNome");
const advogadoPassaporte = document.getElementById("advogadoPassaporte");
const respNome = document.getElementById("respNome");
const respPassaporte = document.getElementById("respPassaporte");

function limparAdvogado() {
  advogadoNome.value = "";
  advogadoPassaporte.value = "";
  advogadoNome.disabled = true;
  advogadoPassaporte.disabled = true;
}

function limparDelegado() {
  respNome.value = "";
  respPassaporte.value = "";
  respNome.disabled = true;
  respPassaporte.disabled = true;
}

function atualizarCamposLegais() {
  const atenuantesSelecionados = getAtenuantes();

  if (atenuantesSelecionados.includes("advogado")) {
    advogadoNome.disabled = false;
    advogadoPassaporte.disabled = false;
  } else {
    limparAdvogado();
  }

  if (atenuantesSelecionados.includes("delegado")) {
    respNome.disabled = false;
    respPassaporte.disabled = false;
  } else {
    limparDelegado();
  }
}

atenuantesBtns.forEach(btn => {
  btn.addEventListener("click", atualizarCamposLegais);
});
atualizarCamposLegais();

// ===================== AGRAVANTES =====================
const agravantesBtns = [...document.querySelectorAll("#agravantesBtns .crime-item")];
agravantesBtns.forEach(btn => {
  btn.onclick = () => btn.classList.toggle("selected");
});

// ===================== CÁLCULO DE MODIFICADORES (SOMA / SUBTRAÇÃO DIRETA) =====================
function aplicarModificadores(valorBase) {
  const atenuantes = getAtenuantes();
  const agravantesQtd = document.querySelectorAll("#agravantesBtns .crime-item.selected").length;

  let percentual = 0;

  // Subtrai as porcentagens dos atenuantes selecionados
  if (atenuantes.includes("advogado"))    percentual -= 0.30; // -30%
  if (atenuantes.includes("reup"))        percentual -= 0.10; // -10%
  if (atenuantes.includes("confesso"))    percentual -= 0.10; // -10%
  if (atenuantes.includes("delacao"))     percentual -= 0.50; // -50%
  if (atenuantes.includes("colaboracao")) percentual -= 0.10; // -10%
  if (atenuantes.includes("porte_legal")) percentual -= 0.10; // -10%

  // Soma +10% para cada agravante selecionado
  percentual += (agravantesQtd * 0.10);

  // Evita valores negativos caso o desconto passe de 100%
  const multiplicadorFinal = Math.max(0, 1 + percentual);

  return Math.floor(valorBase * multiplicadorFinal);
}

// ===================== CÁLCULO DAS PENALIDADES =====================
function calcularPenalidades() {
  let penaBruta = 0;
  let multaBruta = 0;
  let fiancaBruta = 0;
  let fiancaPermitida = true;

  document.querySelectorAll("#crimeContainer .crime-item.selected").forEach(i => {
    const meses = Number(i.dataset.meses) || 0;
    const multa = Number(i.dataset.multa) || 0;
    const fiancaRaw = i.dataset.fianca;

    penaBruta += meses;
    multaBruta += multa;

    if (fiancaRaw !== "false") {
      fiancaBruta += Number(fiancaRaw) || 0;
    } else {
      fiancaPermitida = false;
    }
  });

  const penaFinal = penaBruta > 0 ? Math.max(1, aplicarModificadores(penaBruta)) : 0;
  const multaFinal = aplicarModificadores(multaBruta);
  const fiancaFinal = fiancaPermitida
    ? `R$ ${formatarMoeda(aplicarModificadores(fiancaBruta))}`
    : "Não aplicável";

  resultadoFinal.pena = penaFinal;
  resultadoFinal.multa = multaFinal;
  resultadoFinal.fianca = fiancaFinal;
}

// ===================== BOTÃO CALCULAR =====================
calcularBtn.onclick = () => {
  calcularPenalidades();
  gerarBoletimConferencia();
  boletimModal.classList.remove("hidden");
  alert("✅ Penalidades calculadas.");
};

// ===================== CHECKLIST =====================
const checklistItens = [...document.querySelectorAll(".check-item")];
confirmarChecklist.disabled = true;

function atualizarBotaoChecklist() {
  const todosMarcados = checklistItens.every(i => i.classList.contains("done"));
  confirmarChecklist.disabled = !todosMarcados;
}

checklistItens.forEach(i => {
  i.addEventListener("click", () => {
    i.classList.toggle("done");
    atualizarBotaoChecklist();
  });
});

// ==================== RELATÓRIO PARA TABLET =====================
function gerarListaCompactaCrimes() {
  let lista = [];
  document.querySelectorAll("#crimeContainer .crime-item.selected").forEach(i => {
    const artigo = i.dataset.artigo;
    const nome = i.dataset.nome;
    lista.push(`${artigo} – ${nome}`);
  });
  return lista.join(", ");
}

const sistemaTablet = document.getElementById("sistemaTablet");
if (sistemaTablet) {
  sistemaTablet.onclick = () => {
    calcularPenalidades();
    const listaCompacta = gerarListaCompactaCrimes();

    if (!listaCompacta) {
      alert("⚠️ Nenhum crime selecionado.");
      return;
    }

    navigator.clipboard.writeText(listaCompacta)
      .then(() => alert("📋 Lista compacta copiada para o sistema do tablet!"));
  };
}

// ===================== RELATÓRIO =====================
gerarRelatorio.onclick = () => {
  calcularPenalidades();
  checklistModal.classList.remove("hidden");
};

cancelarChecklist.onclick = () => {
  checklistModal.classList.add("hidden");
};

confirmarChecklist.onclick = () => {
  if (checklistItens.some(i => !i.classList.contains("done"))) {
    alert("⚠️ Marque todos os itens do checklist antes de confirmar!");
    return;
  }

  calcularPenalidades();
  const atenuantes = getAtenuantes();

  if (atenuantes.includes("advogado")) {
    if (!advogadoNome.value.trim() || !advogadoPassaporte.value.trim()) {
      alert("⚠️ Preencha os dados do advogado.");
      return;
    }
  }

  if (atenuantes.includes("delegado")) {
    if (!respNome.value.trim() || !respPassaporte.value.trim()) {
      alert("⚠️ Preencha os dados do delegado.");
      return;
    }
  }

  navigator.clipboard.writeText(gerarFichaCriminalDiscord())
    .then(() => alert("📋 Relatório formatado para Discord copiado!"));

  checklistModal.classList.add("hidden");
};

// ===================== BOLETIM DE CONFERÊNCIA =====================
const boletimModal = document.getElementById("boletimModal");
const boletimConteudo = document.getElementById("boletimConteudo");
const fecharBoletim = document.getElementById("fecharBoletim");

function gerarBoletimConferencia() {
  let crimesTexto = "";
  let penaBruta = 0;
  let multaBruta = 0;
  let fiancaBruta = 0;
  let fiancaPermitida = true;

  document.querySelectorAll("#crimeContainer .crime-item.selected").forEach(i => {
    crimesTexto += `• ${i.dataset.artigo} – ${i.dataset.nome}<br>`;
    penaBruta += Number(i.dataset.meses) || 0;
    multaBruta += Number(i.dataset.multa) || 0;

    if (i.dataset.fianca !== "false") {
      fiancaBruta += Number(i.dataset.fianca) || 0;
    } else {
      fiancaPermitida = false;
    }
  });

  boletimConteudo.innerHTML = `
    <div class="boletim-bloco">
      <h4>🚨 CRIMES IMPUTADOS</h4>
      <div class="boletim-lista">
        ${crimesTexto || "Nenhum crime selecionado."}
      </div>
    </div>

    <div class="boletim-bloco">
      <h4>📌 VALORES BRUTOS (ACUMULADOS)</h4>
      <ul>
        <li>⏳ Pena Bruta: <strong>${penaBruta}</strong> meses</li>
        <li>💰 Multa Bruta: <strong>R$ ${formatarMoeda(multaBruta)}</strong></li>
        <li>⚖️ Fiança Bruta: <strong>${fiancaPermitida ? "R$ " + formatarMoeda(fiancaBruta) : "Não aplicável"}</strong></li>
      </ul>
    </div>

    <div class="boletim-bloco boletim-destaque">
      <h4>⚖️ VALORES FINAIS (COM ATENUANTES / AGRAVANTES)</h4>
      <ul>
        <li>⏳ Pena Final: <strong>${resultadoFinal.pena}</strong> meses</li>
        <li>💰 Multa Final: <strong>R$ ${formatarMoeda(resultadoFinal.multa)}</strong></li>
        <li>⚖️ Fiança Final: <strong>${resultadoFinal.fianca}</strong></li>
      </ul>
    </div>
  `;
}

fecharBoletim.onclick = () => {
  boletimModal.classList.add("hidden");
};

// ===================== FICHA DISCORD =====================
function gerarFichaCriminalDiscord() {
  let crimesTexto = "";

  document.querySelectorAll("#crimeContainer .crime-item.selected").forEach(i => {
    const artigo = i.dataset.artigo;
    const nome = i.dataset.nome;
    const meses = i.dataset.meses;
    const multa = Number(i.dataset.multa);
    const fiancaRaw = i.dataset.fianca;

    const fianca = fiancaRaw !== "false"
      ? `R$ ${formatarMoeda(fiancaRaw)}`
      : "Não aplicável";

    crimesTexto += `• **${artigo} – ${nome}**\n  ⏳ Pena: ${meses} Meses | 💰 Multa: R$ ${formatarMoeda(multa)} | ⚖️ Fiança: ${fianca}\n\n`;
  });

  if (!crimesTexto) crimesTexto = "_Nenhum crime selecionado._";

  return `
📂 **FICHA CRIMINAL**

━━━━━━━━━━━━━━━━━━
👤 **DADOS DO RÉU**
━━━━━━━━━━━━━━━━━━
**Nome:** ${reuNome.value}  
**Passaporte:** ${reuPassaporte.value}  

━━━━━━━━━━━━━━━━━━
🚨 **CRIMES COMETIDOS**
━━━━━━━━━━━━━━━━━━
${crimesTexto}
━━━━━━━━━━━━━━━━━━
⚖️ **PENALIDADES FINAIS**
━━━━━━━━━━━━━━━━━━
⏳ **Pena Total:** ${resultadoFinal.pena} meses  
💰 **Multa Total:** R$ ${formatarMoeda(resultadoFinal.multa)}  
⚖️ **Fiança Total:** ${resultadoFinal.fianca}  

━━━━━━━━━━━━━━━━━━
👮 **GUARNIÇÃO**
━━━━━━━━━━━━━━━━━━
**Corporação:** ${guarnicao.value}  
**B.O.:** ${boAuto.value}  

**Oficial Responsável:**  
${oficialNome.value} (${oficialPassaporte.value})  

**Policiais Envolvidos:**  
${outrosOficiais.value || "Não informado"}  

━━━━━━━━━━━━━━━━━━
⚖️ **JURÍDICO**
━━━━━━━━━━━━━━━━━━
**Advogado:** ${advogadoNome.value || "Não informado"}  
**Delegado:** ${respNome.value || "Não informado"}  

━━━━━━━━━━━━━━━━━━
📝 **RELATÓRIO DA AÇÃO**
━━━━━━━━━━━━━━━━━━
(Descrever a ocorrência)
`;
}

// ===================== RESET APENAS CRIMES =====================
const resetCrimesBtn = document.getElementById("resetCrimes");

resetCrimesBtn.onclick = () => {
  document.querySelectorAll("#crimeContainer .crime-item.selected")
    .forEach(item => item.classList.remove("selected"));

  document.querySelectorAll("#crimeContainer .crime-header")
    .forEach(h => h.classList.remove("open"));

  document.querySelectorAll("#crimeContainer .crime-lista")
    .forEach(l => l.classList.add("hidden"));

  resultadoFinal = {
    pena: 0,
    multa: 0,
    fianca: ""
  };

  alert("🔄 Crimes limpos com sucesso.");
};

// ===================== TOOLTIP GLOBAL =====================
const tooltip = document.getElementById("tooltip");

document.addEventListener("mousemove", (e) => {
  const crime = e.target.closest("#crimeContainer .crime-item");
  const efeito = e.target.closest("#atenuantesBtns .crime-item, #agravantesBtns .crime-item");

  if (crime) {
    const fiancaRaw = crime.dataset.fianca;
    const textoFianca = fiancaRaw !== "false" ? `R$ ${formatarMoeda(fiancaRaw)}` : "Não aplicável";

    tooltip.innerHTML = `
      ⏳ Pena: <strong>${crime.dataset.meses} Meses</strong> | 
      💰 Multa: <strong>R$ ${formatarMoeda(crime.dataset.multa)}</strong> | 
      ⚖️ Fiança: <strong>${textoFianca}</strong>
    `;
    tooltip.style.opacity = "1";
  } else if (efeito) {
    const valor = efeito.dataset.value;
    tooltip.innerHTML = `
      ⚖️ Efeito:<br>
      <strong>${efeitosMapa[valor] || "Efeito não definido"}</strong>
    `;
    tooltip.style.opacity = "1";
  } else {
    tooltip.style.opacity = "0";
  }

  tooltip.style.left = e.clientX + 15 + "px";
  tooltip.style.top = e.clientY + 15 + "px";
});

// ===================== ABERTURA DE BLOCOS EXTERNOS =====================
document.querySelectorAll(
  ".crime-bloco:not(#crimeContainer .crime-bloco) .crime-header"
).forEach(header => {
  header.onclick = () => {
    header.classList.toggle("open");
    header.nextElementSibling.classList.toggle("hidden");
  };
});
