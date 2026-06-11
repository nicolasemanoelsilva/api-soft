const autocannon = require("autocannon");

function executarTeste(configuracao) {
  return new Promise((resolve, reject) => {
    const instancia = autocannon(configuracao, (erro, resultado) => {
      if (erro) {
        reject(erro);
      } else {
        resolve(resultado);
      }
    });

    autocannon.track(instancia);
  });
}

async function iniciar() {
  console.log("Iniciando teste de performance do DOMINK...");

  const resultado = await executarTeste({
    url: "http://localhost:3001/auth/login",
    method: "POST",
    connections: 10,
    duration: 10,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: "admin@teste.com",
      senha: "123456",
    }),
  });

  console.log("\nResumo do teste:");
  console.log(`Requisições por segundo: ${resultado.requests.average}`);
  console.log(`Latência média: ${resultado.latency.average} ms`);
  console.log(`Latência máxima: ${resultado.latency.max} ms`);
  console.log(`Total de requisições: ${resultado.requests.total}`);
  console.log(`Erros: ${resultado.errors}`);
  console.log(`Timeouts: ${resultado.timeouts}`);
}

iniciar().catch((error) => {
  console.error("Erro no teste de performance:", error);
});