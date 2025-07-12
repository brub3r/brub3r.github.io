// jogo.js completo atualizado

const itensPorNivel = {
  facil: {
    tempo: 50,
    itens: [
      "casca-banana",
      "jornal",
      "garrafa-pet",
      "garrafa-vidro",
      "papelao",
      "lata-aluminio",
      "clipe",
      "panela",
      "tampa",
    ],
  },
  medio: {
    tempo: 30,
    itens: [
      "casca-banana",
      "jornal",
      "garrafa-pet",
      "garrafa-vidro",
      "papelao",
      "caixa-leite",
      "maca",
      "copo-papel-plastico",
      "espelho",
      "guardanapo",
      "lata-aluminio",
      "clipe",
      "panela",
      "tampa",
    ],
  },
  dificil: {
    tempo: 20,
    itens: [
      "casca-banana",
      "jornal",
      "garrafa-pet",
      "garrafa-vidro",
      "papelao",
      "caixa-leite",
      "maca",
      "copo-papel-plastico",
      "espelho",
      "guardanapo",
      "lata-aluminio",
      "clipe",
      "panela",
      "tampa",
      "papelao",
      "jornal",
      "copo-papel-plastico",
      "maca",
      "espelho",
    ],
  },
};

const classificacaoItens = {
  "casca-banana": "organico",
  maca: "organico",
  guardanapo: "organico",
  jornal: "papel",
  papelao: "papel",
  "caixa-leite": "papel",
  "garrafa-pet": "plastico",
  "copo-papel-plastico": "plastico",
  "garrafa-vidro": "vidro",
  espelho: "vidro",
  "lata-aluminio": "metal",
  clipe: "metal",
  panela: "metal",
  tampa: "metal",
};

const tiposLixeiras = ["papel", "plastico", "vidro", "organico", "metal"];

const niveisBtns = document.querySelectorAll(".nivel-btn");
const jogoContainer = document.getElementById("jogo-container");
const tempoDisplay = document.getElementById("tempo");
const pontuacaoDisplay = document.getElementById("pontuacao");
const backgroundEl = document.getElementById("background");

let tempoRestante, intervaloTempo, pontuacao, totalItens, acertos;
let nivelAtual;
let emojisCriados = false;
let somTocado = false;

niveisBtns.forEach((btn) => {
  btn.addEventListener("click", () => iniciarJogo(btn.dataset.nivel));
});

function iniciarJogo(nivel) {
  emojisCriados = false;
  somTocado = false;
  nivelAtual = nivel;
  const config = itensPorNivel[nivel];
  tempoRestante = config.tempo;
  pontuacao = 0;
  acertos = 0;
  totalItens = config.itens.length;

  atualizarPontuacao();
  atualizarTempo();
  atualizarFundo();

  jogoContainer.innerHTML = "";

  // Criar container das lixeiras
  const lixeirasContainer = document.createElement("div");
  lixeirasContainer.style.display = "flex";
  lixeirasContainer.style.justifyContent = "space-around";
  lixeirasContainer.style.marginBottom = "20px";

  tiposLixeiras.forEach((tipo) => {
    const lixeira = document.createElement("div");
    lixeira.classList.add("lixeira");
    lixeira.dataset.tipo = tipo;
    lixeira.innerHTML = `
      <img src="../../img/lixeira-${tipo}.jpg" alt="Lixeira ${tipo}" width=${
      tipo != "organico" ? "85" : "122"
    }"><br>
      <strong>${tipo.toUpperCase()}</strong>
    `;
    lixeira.addEventListener("dragover", (e) => e.preventDefault());
    lixeira.addEventListener("drop", soltarItem);
    lixeirasContainer.appendChild(lixeira);
  });

  jogoContainer.appendChild(lixeirasContainer);

  // Criar container dos resíduos (fixos abaixo das lixeiras)
  const itensContainer = document.createElement("div");
  itensContainer.style.display = "flex";
  itensContainer.style.flexWrap = "wrap";
  itensContainer.style.justifyContent = "center";
  itensContainer.style.gap = "10px";

  config.itens.forEach((nome) => {
    const item = document.createElement("div");
    item.classList.add("residuo");
    item.innerHTML = `
      <img data-nome="${nome}" src="../../img/${nome}.png" alt="${nome}" width="70" height="70"></br><strong>${nome.toUpperCase()}</strong>`;
    item.draggable = true;
    item.dataset.nome = nome;
    item.addEventListener("dragstart", arrastarItem);
    itensContainer.appendChild(item);
  });

  jogoContainer.appendChild(itensContainer);

  // Iniciar contagem regressiva do tempo
  clearInterval(intervaloTempo);
  intervaloTempo = setInterval(() => {
    tempoRestante--;
    atualizarTempo();
    if (tempoRestante <= 0) {
      finalizarJogo(false);
    }
  }, 1000);
}

function arrastarItem(e) {
  e.dataTransfer.setData("text/plain", e.target.dataset.nome);
}

function soltarItem(e) {
  e.preventDefault();
  const nome = e.dataTransfer.getData("text/plain");
  console.log("nome:", nome);
  const tipoCorreto = classificacaoItens[nome];
  const tipoLixeira = e.currentTarget.dataset.tipo;

  const itemEl = document.querySelector(`div[data-nome="${nome}"]`);
  console.log("itemEl:", itemEl);
  if (!itemEl) return;
  console.log("tipoCorreto:", tipoCorreto);

  console.log("tipoLixeira:", tipoLixeira);
  if (tipoCorreto === tipoLixeira) {
    pontuacao += 10;
    acertos++;
    itemEl.remove();
    atualizarFundo();
  } else {
    pontuacao -= 5;
    itemEl.classList.add("shake");
    setTimeout(() => itemEl.classList.remove("shake"), 500);
  }

  atualizarPontuacao();

  if (acertos === totalItens) {
    finalizarJogo(true);
  }
}

function atualizarPontuacao() {
  pontuacaoDisplay.textContent = pontuacao;
}

function atualizarTempo() {
  tempoDisplay.textContent = tempoRestante;
}

function atualizarFundo() {
  const porcentagemAcertos = acertos / totalItens;

  if (acertos === totalItens) {
    backgroundEl.style.backgroundImage = "none";
  } else if (porcentagemAcertos >= 0.5) {
    backgroundEl.style.backgroundImage =
      "url('../../img/fundo-intermediario.jpg')";
  } else {
    backgroundEl.style.backgroundImage = "url('../../img/fundo-poluido.jpg')";
  }
}

function finalizarJogo(completo) {
  clearInterval(intervaloTempo);
  if (completo) {
    atualizarFundo(); // Garante fundo limpo ao fim
    const resultadoContainer = document.createElement("div");
    resultadoContainer.style.display = "flex";
    resultadoContainer.style.justifyContent = "space-around";
    resultadoContainer.style.marginBottom = "20px";
    resultadoContainer.classList.add("resultado");
    resultadoContainer.classList.add("pulsar");
    resultadoContainer.innerHTML = `
      <strong>🎉 Parabéns! Você reciclou tudo! ♻️ Pontuação: ${pontuacao}</strong>
    `;
    jogoContainer.appendChild(resultadoContainer);
    mostrarEmojis();
  } else {
    const resultadoContainer = document.createElement("div");
    resultadoContainer.style.display = "flex";
    resultadoContainer.style.justifyContent = "space-around";
    resultadoContainer.style.marginBottom = "20px";
    resultadoContainer.classList.add("resultado");
    resultadoContainer.innerHTML = `
      <strong>Tempo esgotado! Sua pontuação: ${pontuacao}</strong>
    `;
    jogoContainer.appendChild(resultadoContainer);
  }

  // Salvar recorde
  const melhor = localStorage.getItem("melhorPontuacao") || 0;
  if (pontuacao > melhor) {
    localStorage.setItem("melhorPontuacao", pontuacao);
    const resultadoContainer = document.createElement("div");
    resultadoContainer.style.display = "flex";
    resultadoContainer.style.justifyContent = "space-around";
    resultadoContainer.style.marginBottom = "20px";
    resultadoContainer.classList.add("resultado");
    resultadoContainer.classList.add("pulsar");
    resultadoContainer.innerHTML = `
      <strong>🎉 Novo recorde! 🎉</strong>
    `;
    jogoContainer.appendChild(resultadoContainer);
  }

  // Parabéns
  function mostrarEmojis() {
    if (!emojisCriados) {
      for (let i = 0; i < 30; i++) criarEmoji();
      emojisCriados = true;
    }

    if (!somTocado) {
      document.getElementById("som-vitoria").play();
      somTocado = true;
    }
  }

  function criarEmoji() {
    const reciclagemEmoji = document.createElement("div");
    reciclagemEmoji.classList.add("reciclagemEmoji");
    reciclagemEmoji.textContent = "♻️";
    reciclagemEmoji.style.left = Math.random() * window.innerWidth + "px";
    reciclagemEmoji.style.animationDuration = Math.random() * 3 + 3 + "s";
    document.body.appendChild(reciclagemEmoji);
    setTimeout(() => reciclagemEmoji.remove(), 7000);
  }
}
