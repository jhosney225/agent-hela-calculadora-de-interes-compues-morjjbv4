
```javascript
import Anthropic from "@anthropic-ai/sdk";
import * as readline from "readline";

const client = new Anthropic();
const conversationHistory = [];

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, (answer) => {
      resolve(answer);
    });
  });
}

async function chat(userMessage) {
  conversationHistory.push({
    role: "user",
    content: userMessage,
  });

  const response = await client.messages.create({
    model: "claude-3-5-sonnet-20241022",
    max_tokens: 8096,
    system: `Eres un experto en finanzas e inversiones. Tu tarea es ayudar a los usuarios a calcular interés compuesto y hacer análisis de inversiones a largo plazo.

Cuando el usuario proporcione datos de inversión, calcula automáticamente:
1. El monto final después del período especificado
2. El interés total ganado
3. El rendimiento anualizado
4. Análisis comparativo con diferentes tasas

Para calcular interés compuesto, usa la fórmula:
A = P(1 + r/n)^(nt)
Donde:
- A = Monto final
- P = Capital inicial (Principal)
- r = Tasa de interés anual (como decimal)
- n = Número de veces que se capitaliza por año
- t = Tiempo en años

Cuando calcules, siempre proporciona:
- Los números exactos
- Explicación clara del cálculo
- Comparativas si es relevante
- Recomendaciones financieras prudentes

El usuario puede preguntar en español. Responde siempre en español.`,
    messages: conversationHistory,
  });

  const assistantMessage = response.content[0].text;
  conversationHistory.push({
    role: "assistant",
    content: assistantMessage,
  });

  return assistantMessage;
}

function calculateCompoundInterest(principal, rate, time, frequency = 1) {
  // A = P(1 + r/n)^(nt)
  const amount = principal * Math.pow(1 + rate / (frequency * 100), frequency * time);
  const interest = amount - principal;

  return {
    finalAmount: parseFloat(amount.toFixed(2)),
    totalInterest: parseFloat(interest.toFixed(2)),
    annualizedReturn: parseFloat(((Math.pow(amount / principal, 1 / time) - 1) * 100).toFixed(2)),
  };
}

async function demonstrateCalculations() {
  console.log("\n=== DEMOSTRACIÓN DE CÁLCULOS DE INTERÉS COMPUESTO ===\n");

  // Example 1: $10,000 at 5% for 10 years, compounded annually
  const ex1 = calculateCompoundInterest(10000, 5, 10, 1);
  console.log("Ejemplo 1: Inversión de $10,000 al 5% anual durante 10 años");
  console.log(`- Monto final: $${ex1.finalAmount.toLocaleString("es-MX")}`);
  console.log(`- Interés total: $${ex1.totalInterest.toLocaleString("es-MX")}`);
  console.log(`- Rendimiento anualizado: ${ex1.annualizedReturn}%\n`);

  // Example 2: $5,000 at 7% for 20 years, compounded quarterly
  const ex2 = calculateCompoundInterest(5000, 7, 20, 4);
  console.log("Ejemplo 2: Inversión de $5,000 al 7% anual durante 20 años (capitalización trimestral)");
  console.log(`- Monto final: $${ex2.finalAmount.toLocaleString("es-MX")}`);
  console.log(`- Interés total: $${ex2.totalInterest.toLocaleString("es-MX")}`);
  console.log(`- Rendimiento anualizado: ${ex2.annualizedReturn}%\n`);

  // Example 3: $25,000 at 6% for 15 years, compounded monthly
  const ex3 = calculateCompoundInterest(25000, 6, 15, 12);
  console.log("Ejemplo 3: Inversión de $25,000 al 6% anual durante 15 años (capitalización mensual)");
  console.log(`- Monto final: $${ex3.finalAmount.toLocaleString("es-MX")}`);
  console.log(`- Interés total: $${ex3.totalInterest.toLocaleString("es-MX")}`);
  console.log(`- Rendimiento anualizado: ${ex3.annualizedReturn}%\n`);
}

async function main() {
  console.log("╔════════════════════════════════════════════════════════╗");
  console.log("║     CALCULADORA DE INTERÉS COMPUESTO PARA INVERSIONES   ║");
  console.log("║                    (Asistente con IA)                    ║");
  console.log("╚════════════════════════════════════════════════════════╝");

  // Show demonstration calculations
  await demonstrateCalculations();

  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
  console.log("Iniciando asistente de inversiones con IA...\n");
  console.log(
    "Puedes hacer preguntas sobre cálculos de interés compuesto, análisis de invers