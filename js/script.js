// O idiomaAtual é definido diretamente no HTML de cada página (pt ou en)

function verificarScroll() {
    var elementos = document.querySelectorAll('.animate-up');
    var alturaJanela = window.innerHeight * 0.85;
    elementos.forEach(function(item) {
        var topoElemento = item.getBoundingClientRect().top;
        if (topoElemento < alturaJanela) item.classList.add('visible');
    });
}
window.addEventListener('scroll', verificarScroll);
window.addEventListener('load', verificarScroll);

let perguntasPT = [
   {
        q: "Qual das seguintes fontes é mais confiável para checar uma notícia antes de compartilhá-la?",
        opts: ["Redes sociais com muitos compartilhamentos", "Blogs pessoais sem referência de dados", "Sites de verificação de fatos reconhecidos, como Aos Fatos ou Lupa", "Mensagens de WhatsApp de conhecidos"],
        c: 2
    },
    {
        q: "Notícias falsas se espalham mais rápido que notícias verdadeiras nas redes sociais.",
        opts: ["Verdadeiro", "Falso", ],
        c: 0
    },
    {
        q: "Uma manchete diz: “Estudo científico prova que comer chocolate cura todas as doenças”. Qual é o sinal mais claro de que essa notícia pode ser falsa?",
        opts: ["A notícia usa linguagem científica complexa", "Não cita fontes confiáveis ou estudos revisados por pares", "Está compartilhada por um amigo próximo", "Tem imagens chamativas de chocolate"],
        c: 1
    },
    {
        q: "Se você recebe uma notícia alarmante no WhatsApp, qual seria a atitude mais segura antes de compartilhar?",
        opts: ["Compartilhar imediatamente para avisar os amigos", "Procurar a notícia em sites de jornalismo confiável ou fact-checking", "Ignorar a notícia sem verificar", "Compartilhar apenas se o remetente for confiável"],
        c: 1
    },
    {
        q: "Qual das opções abaixo não é uma forma comum de fake news?",
        opts: ["Satírico ou humorístico", "Parcialmente verdadeiro, mas com contexto errado", "Notícias com fontes citadas corretamente", "Conteúdos completamente inventados"],
        c: 2
    }
];

let perguntasEN = [
    {
        q: "Which of the following sources is most reliable for checking news before sharing it?",
        opts: ["Social media with many shares", "Personal blogs without data references", "Recognized fact-checking sites, such as Aos Fatos or Lupa", "WhatsApp messages from acquaintances"],
        c: 2
    },
    {
        q: "Fake news spreads faster than true news on social media.",
        opts: ["True", "False"],
        c: 0
    },
    {
        q: "A headline says: 'Scientific study proves eating chocolate cures all diseases'. What is the clearest sign that this news might be fake?",
        opts: ["The news uses complex scientific language", "It does not cite reliable sources or peer-reviewed studies", "It is shared by a close friend", "It has flashy images of chocolate"],
        c: 1
    },
    {
        q: "If you receive alarming news on WhatsApp, what would be the safest action before sharing?",
        opts: ["Share immediately to warn friends", "Look for the news on reliable journalism or fact-checking websites", "Ignore the news without checking", "Share only if the sender is reliable"],
        c: 1
    },
    {
        q: "Which of the options below is not a common form of fake news?",
        opts: ["Satirical or humorous", "Partially true, but with the wrong context", "News with correctly cited sources", "Completely invented content"],
        c: 2
    }
];

var atual = -1, score = 0;
let perguntas = (typeof idiomaAtual !== 'undefined' && idiomaAtual === "en") ? perguntasEN : perguntasPT; 

function proximaPergunta() {
    atual++;
    var btn = document.getElementById('btn-quiz'), area = document.getElementById('opcoes'), texto = document.getElementById('pergunta'), feedback = document.getElementById('feedback');
    if (feedback) feedback.innerText = "";
    if (atual < perguntas.length) {
        texto.innerText = perguntas[atual].q;
        btn.style.display = "none";
        area.innerHTML = "";
        perguntas[atual].opts.forEach(function(opt, i) {
            area.innerHTML += '<button class="quiz-opt" onclick="validar(' + i + ')">' + opt + '</button>';
        });
    } else {
        let fimTitulo = (idiomaAtual === "pt") ? "Fim do Desafio!" : "End of Challenge!";
        let fimTexto = (idiomaAtual === "pt") ? "Você acertou " + score + " de " + perguntas.length + "." : "You got " + score + " out of " + perguntas.length + " correct.";
        let btnReiniciar = (idiomaAtual === "pt") ? "Reiniciar" : "Restart";
        
        document.getElementById('quiz-content').innerHTML = "<h3>" + fimTitulo + "</h3><p>" + fimTexto + "</p><button class='btn-main' onclick='location.reload()'>" + btnReiniciar + "</button>";
    }
}

function validar(escolha) {
    var feedback = document.getElementById('feedback'), btn = document.getElementById('btn-quiz');
    if (escolha == perguntas[atual].c) { 
        score++; 
        feedback.innerText = (idiomaAtual === "pt") ? "Correto! ✅" : "Correct! ✅"; 
        feedback.style.color = "green"; 
    } else { 
        feedback.innerText = (idiomaAtual === "pt") ? "Errado! ❌" : "Wrong! ❌"; 
        feedback.style.color = "red"; 
    }
    btn.style.display = "inline-block";
    btn.innerText = (idiomaAtual === "pt") ? "Próxima" : "Next";
    document.getElementById('opcoes').innerHTML = "";
}







const API_KEY = "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";


async function simularVerificacao() {

    const manchete = document.getElementById("input-verify").value;
    const resultado = document.getElementById("res-verify");

    if (!manchete.trim()) {
        alert("Digite uma manchete.");
        return;
    }
    
    resultado.style.display = "block";

    resultado.innerHTML = `
        <div class="loading-box">
            <h3>🔎 Analisando...</h3>
            <p>Aguarde alguns segundos.</p>
        </div>
    `;

    try {

        const resposta = await fetch(
            "https://api.groq.com/openai/v1/chat/completions",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${API_KEY}`
                },
                body: JSON.stringify({
                    model: "llama-3.3-70b-versatile",
                    temperature: 0.3,
                    messages: [
                        {
                            role: "user",
                            content: `
Analise esta manchete:

"${manchete}"

Retorne SOMENTE JSON válido:

{
  "pontuacao": 85,
  "nivel": "Alta Credibilidade",
  "explicacao": "texto",
  "dicas": [
    "dica 1",
    "dica 2",
    "dica 3"
  ]
}
`
                        }
                    ]
                })
            }
        );

        const dados = await resposta.json();

        console.log(dados);

        if (!resposta.ok) {
            throw new Error(
                dados.error?.message ||
                "Erro ao consultar a API"
            );
        }

        let texto = dados.choices[0].message.content;

        texto = texto
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .trim();

        const analise = JSON.parse(texto);

        let cor = "#22c55e";

        if (analise.pontuacao < 70) {
            cor = "#f59e0b";
        }

        if (analise.pontuacao < 40) {
            cor = "#ef4444";
        }

        resultado.innerHTML = `
            <div class="detector-card">

                <div class="badge">
                    ${analise.nivel}
                </div>

                <div class="score">
                    ${analise.pontuacao}%
                </div>

                <div class="progress">
                    <div
                        class="progress-fill"
                        style="
                            width:${analise.pontuacao}%;
                            background:${cor};
                        ">
                    </div>
                </div>

                <div class="analysis-box">
                    <h4>📋 Análise</h4>
                    <p>${analise.explicacao}</p>
                </div>

                <div class="tips-box">
                    <h4>🛡️ Recomendações</h4>
                    <ul>
                        ${analise.dicas.map(
                            item => `<li>${item}</li>`
                        ).join("")}
                    </ul>
                </div>

            </div>
        `;

    } catch (error) {

        console.error(error);

        resultado.innerHTML = `
            <div class="error-box">
                <h3>❌ Erro</h3>
                <p>${error.message}</p>
            </div>
        `;
    }
    
}
