import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// TESTE RÁPIDO
app.get("/", (req, res) => {
  res.send("Backend rodando 🚀");
});

// ⚠️ depois você conecta seu tRPC aqui

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server rodando na porta ${PORT}`);
});