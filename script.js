let cardContainer = document.querySelector(".card-container");
let dados = [];
let filtroRaridadeAtual = "Todas";

async function carregarDados() {
    try {
        const resposta = await fetch("data.json");
        dados = await resposta.json();
        renderizarCards(dados);
        adicionarEventosDeInteracao(); // <--- CHAMA A FUNÇÃO DE INTERAÇÃO APÓS CRIAR OS CARDS
    } catch (error) {
        console.error("Erro ao carregar os dados:", error);
    }

    document.querySelectorAll('.filtro-raridade-botao').forEach(button => {
        button.addEventListener('click', () => {
            document.querySelectorAll('.filtro-raridade-botao').forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            filtroRaridadeAtual = button.dataset.rarity; // Atualiza o filtro e renderiza os cards
            aplicarFiltros();
        });
    });
}

function aplicarFiltros() {
    const termoBusca = document.getElementById("input-busca").value.toLowerCase();
    let resultado = dados;

    if (filtroRaridadeAtual !== "Todas") {
        resultado = resultado.filter(dado => dado.tags.includes(filtroRaridadeAtual));
    }

    if (termoBusca.trim() !== "") {
        resultado = resultado.filter(dado =>
            dado.nome.toLowerCase().includes(termoBusca) ||
            dado.descrição.toLowerCase().includes(termoBusca) ||
            dado.tags.some(tag => tag.toLowerCase().includes(termoBusca))
        );
    }

    renderizarCards(resultado);
    adicionarEventosDeInteracao(); // REAPLICA EVENTOS APÓS RENDERIZAR NOVOS CARDS
}

function renderizarCards(cardsParaRenderizar) {
    cardContainer.innerHTML = "";
    for (let dado of cardsParaRenderizar) {
        let article = document.createElement("article");
        article.classList.add("card");

        const nomeArquivo = dado.arquivo_imagem || `${dado.nome.replace(/[^a-zA-Z0-9\s]/g, '').trim().replace(/\s+/g, '_')}.png`;

        // O segundo URL é um placeholder caso a imagem principal falhe.
        const imageUrl = `url('./img/${nomeArquivo}'), url('https://via.placeholder.com/300x400/9b0000/FFFFFF?text=Imagem+de+${dado.nome}')`;

        article.innerHTML = `
        <div class="card-header" style="background-image: ${imageUrl};">
            <h2>${dado.nome}</h2>
        </div>
        <div class="card-body">
            <p class="elixir">
                Custo de Elixir: ${dado.custo_elixir} 
                <img src="./img/Elixir.webp" alt="Elixir" class="elixir-icone"> 
            </p>
            <p><strong>Descrição:</strong> ${dado.descrição}</p>
            <p><strong>Tags:</strong> ${dado.tags.join(", ")}</p>
        </div>
        `
        cardContainer.appendChild(article);
    }
}

function adicionarEventosDeInteracao() {
    const cards = document.querySelectorAll('.card');

    cards.forEach(card => {
        // Remove listeners antigos para evitar duplicação (importante após a função aplicarFiltros)
        card.replaceWith(card.cloneNode(true));
    });

    // Resseleciona os novos cards (os clones sem listeners antigos)
    const newCards = document.querySelectorAll('.card');

    newCards.forEach(card => {
        // 1. Adiciona evento de clique (para telas touch/mobile)
        card.addEventListener('click', () => {
            // Alterna a classe 'card-open' para aplicar o estilo de revelação via CSS
            card.classList.toggle('card-open');
        });

        // 2. Adiciona evento de mouseover (para desktop)
        card.addEventListener('mouseover', () => {
            card.classList.add('card-open-hover');
        });

        // 3. Adiciona evento de mouseout para remover a classe do hover
        card.addEventListener('mouseout', () => {
            card.classList.remove('card-open-hover');
            // Opcional: Se a intenção é só hover, garante que não fique preso
        });
    });
}

window.onload = carregarDados;
document.getElementById('input-busca').addEventListener('input', aplicarFiltros);
document.getElementById('botao-busca').addEventListener('click', aplicarFiltros);