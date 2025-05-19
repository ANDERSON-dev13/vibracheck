document.getElementById("form-vibracao").addEventListener("submit", function (e) {
    e.preventDefault();

    // Validação básica
    const potencia = parseFloat(document.getElementById("potencia").value);
    if (isNaN(potencia) || potencia < 0) {
        alert("Por favor, insira uma potência válida.");
        return;
    }

    const leituras = {
        H1: parseFloat(document.getElementById("h1").value),
        V1: parseFloat(document.getElementById("v1").value),
        H2: parseFloat(document.getElementById("h2").value),
        V2: parseFloat(document.getElementById("v2").value),
        A2: parseFloat(document.getElementById("a2").value),
        H3: parseFloat(document.getElementById("h3").value),
        V3: parseFloat(document.getElementById("v3").value),
        H4: parseFloat(document.getElementById("h4").value),
        V4: parseFloat(document.getElementById("v4").value),
    };

    for (const ponto in leituras) {
        if (isNaN(leituras[ponto]) || leituras[ponto] < 0) {
            alert(`Por favor, insira um valor válido para ${ponto}.`);
            return;
        }
    }

    const grupo = potencia <= 300 ? "Grupo 1" : "Grupo 2";

    function classificarISO(valor) {
        if (valor <= 2.8) return "A";
        if (valor <= 7.1) return "B";
        if (valor <= 11.2) return "C";
        return "D";
    }

    function corCategoria(categoria) {
        const classes = { A: "categoria-verde", B: "categoria-amarelo", C: "categoria-laranja", D: "categoria-vermelho" };
        return classes[categoria];
    }

    function classificarBlake(valor) {
        if (valor < 2) return "Aceitação de novo/revisado (<2 mm/s)";
        if (valor < 3) return "Operação normal (<3 mm/s)";
        if (valor <= 7) return "Vigilância (3-7 mm/s)";
        return "Impróprio para operação (>7 mm/s)";
    }

    let resultado = `<p><strong>Grupo:</strong> ${grupo}</p>`;
    resultado += `<table><tr><th>Ponto</th><th>Valor (mm/s)</th><th>Categoria ISO</th><th>Status Blake</th></tr>`;

    let contagemCategoria = { A: 0, B: 0, C: 0, D: 0 };

    for (const ponto in leituras) {
        const valor = leituras[ponto];
        const categoria = classificarISO(valor);
        contagemCategoria[categoria]++;
        const classeCor = corCategoria(categoria);
        const status = classificarBlake(valor);
        resultado += `<tr><td>${ponto}</td><td>${valor.toFixed(2)}</td><td class="${classeCor}">${categoria}</td><td>${status}</td></tr>`;
    }
    resultado += `</table>`;

    let analiseFinal = "<h3>Conclusão Automática</h3><p>";
    if (contagemCategoria["D"] >= 3) {
        analiseFinal += "Com base nas leituras, o equipamento opera na faixa <strong>crítica</strong>, sendo recomendada <strong>ação corretiva imediata</strong>, especialmente no lado da bomba.";
    } else if (contagemCategoria["C"] >= 3) {
        analiseFinal += "O equipamento apresenta vibrações elevadas que requerem <strong>monitoramento frequente</strong>. Recomenda-se acompanhamento nas próximas análises.";
    } else {
        analiseFinal += "O equipamento opera em condições <strong>aceitáveis</strong> segundo os critérios da norma ISO 10816-3.";
    }
    analiseFinal += "</p>";

    resultado += analiseFinal;
    document.getElementById("output").innerHTML = resultado;
});

document.getElementById("resetBtn").addEventListener("click", function () {
    document.getElementById("form-vibracao").reset();
    document.getElementById("output").innerHTML = "";
});
