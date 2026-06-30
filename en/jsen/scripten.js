
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
        opts: ["Verdadeiro", "Falso"],
        c: 0
    },
    {
        q: "Uma manchete diz: 'Estudo científico prova que comer chocolate cura todas as doenças'. Qual é o sinal mais claro de que essa notícia pode ser falsa?",
        opts: ["A notícia usa linguagem científica complexa", "Não cita fontes confiáveis ou estudos revisados por pares", "Está compartilhada por um amigo próximo", "Tem imagens chamativas de chocolate"],
        c: 1
    },
    {
        q: "Se você recebe uma notícia alarmante no WhatsApp, qual seria a atitude mais segura antes de compartilhar?",
        opts: ["Compartilhar imediatamente", "Procurar em sites confiáveis ou fact-checking", "Ignorar a notícia", "Compartilhar se o remetente for confiável"],
        c: 1
    },
    {
        q: "Qual das opções abaixo não é uma forma comum de fake news?",
        opts: ["Satírico ou humorístico", "Parcialmente verdadeiro com contexto errado", "Notícias com fontes corretas", "Conteúdos completamente inventados"],
        c: 2
    }
];

let perguntasEN = [
    {
        q: "Which source is most reliable for checking news before sharing it?",
        opts: ["Social media with many shares", "Personal blogs without references", "Fact-checking sites like Aos Fatos or Lupa", "WhatsApp messages from acquaintances"],
        c: 2
    },
    {
        q: "Fake news spreads faster than real news on social media.",
        opts: ["True", "False"],
        c: 0
    },
    {
        q: "A headline says: 'Scientific study proves chocolate cures all diseases'. What is the clearest sign it may be fake?",
        opts: ["Complex scientific language", "No reliable sources or peer-reviewed studies", "Shared by a friend", "Flashy chocolate images"],
        c: 1
    },
    {
        q: "What is the safest action before sharing alarming WhatsApp news?",
        opts: ["Share immediately", "Verify on trusted sources", "Ignore it", "Share if sender is trusted"],
        c: 1
    },
    {
        q: "Which is NOT a common form of fake news?",
        opts: ["Satire", "Misleading context", "Properly sourced news", "Completely fabricated content"],
        c: 2
    }
];

var atual = -1, score = 0;

let perguntas =
    (typeof idiomaAtual !== "undefined" && idiomaAtual === "en")
        ? perguntasEN
        : perguntasPT;



function proximaPergunta() {
    atual++;

    var btn = document.getElementById('btn-quiz');
    var area = document.getElementById('opcoes');
    var texto = document.getElementById('pergunta');
    var feedback = document.getElementById('feedback');

    if (feedback) feedback.innerText = "";

    if (atual < perguntas.length) {
        texto.innerText = perguntas[atual].q;

        btn.style.display = "none";
        area.innerHTML = "";

        perguntas[atual].opts.forEach(function(opt, i) {
            area.innerHTML += `<button class="quiz-opt" onclick="validar(${i})">${opt}</button>`;
        });

    } else {

        let fimTitulo = (idiomaAtual === "pt") ? "Fim do Desafio!" : "End of Challenge!";
        let fimTexto = (idiomaAtual === "pt")
            ? `Você acertou ${score} de ${perguntas.length}.`
            : `You got ${score} out of ${perguntas.length} correct.`;

        let btnReiniciar = (idiomaAtual === "pt") ? "Reiniciar" : "Restart";

        document.getElementById('quiz-content').innerHTML = `
            <h3>${fimTitulo}</h3>
            <p>${fimTexto}</p>
            <button class="btn-main" onclick="location.reload()">${btnReiniciar}</button>
        `;
    }
}

function validar(escolha) {
    var feedback = document.getElementById('feedback');
    var btn = document.getElementById('btn-quiz');

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
        alert("Please enter a headline.");
        return;
    }

    resultado.style.display = "block";

    resultado.innerHTML = `
        <div class="loading-box">
            <h3>🔎 Analyzing...</h3>
            <p>Please wait a few seconds.</p>
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
                            role: "system",
                            content: "You are a professional fact-checking assistant. Always respond only in English. Return only valid JSON."
                        },
                        {
                            role: "user",
                            content: `
Analyze this news headline:

"${manchete}"

IMPORTANT:
- Respond ONLY in English.
- Return ONLY valid JSON.

{
  "score": 85,
  "level": "High Credibility",
  "explanation": "Short analysis.",
  "tips": [
    "Tip 1",
    "Tip 2",
    "Tip 3"
  ]
}
`
                        }
                    ]
                })
            }
        );

        const dados = await resposta.json();

        if (!resposta.ok) {
            throw new Error(dados.error?.message || "API request failed");
        }

        let texto = dados.choices[0].message.content;

        texto = texto
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .trim();

        const analysis = JSON.parse(texto);

        let cor = "#22c55e";

        if (analysis.score < 70) cor = "#f59e0b";
        if (analysis.score < 40) cor = "#ef4444";

        resultado.innerHTML = `
            <div class="detector-card">

                <div class="badge">${analysis.level}</div>

                <div class="score">${analysis.score}%</div>

                <div class="progress">
                    <div class="progress-fill"
                        style="width:${analysis.score}%; background:${cor};">
                    </div>
                </div>

                <div class="analysis-box">
                    <h4>📋 Analysis</h4>
                    <p>${analysis.explanation}</p>
                </div>

                <div class="tips-box">
                    <h4>🛡️ Recommendations</h4>
                    <ul>
                        ${analysis.tips.map(t => `<li>${t}</li>`).join("")}
                    </ul>
                </div>

            </div>
        `;

    } catch (error) {

        console.error(error);

        resultado.innerHTML = `
            <div class="error-box">
                <h3>❌ Error</h3>
                <p>${error.message}</p>
            </div>
        `;
    }
}
