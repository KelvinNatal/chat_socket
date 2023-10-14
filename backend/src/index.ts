import App from './app';

const app = new App();

app.server.listen(3555, () => {
    console.log("Servidor Rodando");
});