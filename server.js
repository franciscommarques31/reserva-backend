const app = require('./api/index');

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`🚀 Backend local a correr na porta ${PORT}`);
});
