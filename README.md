#Sobre
    Este é um exemplo de API com autenticação em JWT (JsonWebToken)
    usando base de dados MongoDB. O mesmo tem reset de senha com envio de 
    email.

#Autor
    Julio Barros, academico na UFGD em Dourados, Mato Grosso do Sul.

#Instalação
    Após clonar o projeto basta executar o comando <npm install> e aguardar o termino da instalação das dependências. 

#Execução
    Após instalar as dependências basta executar o comando <node app.js> ou <nodemon app.js>, se o nodemon estiver instalado, que a aplicação irá executar na porta 3000. Se a porta 3000 estiver ocupada, basta alterar no arquivo <app.js>.

#Estrutura das Pastas e arquivos
    /app -> onde fica os controles, middlewares e models da aplicação.
    /app/controllers -> onde fica os controles da aplicação, cada controle tem rotas para as tarefas que sua aplicação precisa fazer.
    /app/middlewares -> onde fica os middlewares para controle de acesso e requisições não autenticado na api.
    /app/models -> onde fica o modelo das coleções de dados, no model será definido os atributos de cada coleção e suas caracteristicas.
    
    /config -> ficam os arquivos de configuração, no caso deste exemplo fica a configuração de conexão com o Banco de Dados MongoDB.

    /modules -> ficam os arquivos de modulos adicionais de execução de tarefas mais expecíficas, neste caso o modulo de envio de e-mails.

    /resources -> ficam arquivos externos para uso em casos expecificos
    /resources/mail -> fica arquivos externos para o caso de uso de envio de emails
    /resources/mail/auth -> contem um .html com a formatação da msg que será enviada para reset de senha.

    .env.example -> este arquivo fica as informações de configuração de ambiente do projeto, neste fica os dados de conexão com o banco de dados, dados de conexão com o servidor de email e o key da aplicação. Neste pode ser adicionado outros dados de configuração de ambiente.

    .gitignore -> este arquivo você lista os arquivos ou pastas que não ira ser enviado para o repositório que esta sendo utilizado.

    app.js -> este é o core da aplicação, neste mesmo fica toda a inicialização do projeto.

    package.json e package-lock.json -> ficam configurações de dependencias da aplicação.
