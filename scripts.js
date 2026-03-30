const nomeEl = document.getElementById('nome');
const emailEl =  document.getElementById('email');
const cepEl = document.getElementById('cep');
const logradouroEl = document.getElementById('logradouro');
const numeroEl = document.getElementById('numero');
const bairroEl = document.getElementById('bairro');
const cidadeEl = document.getElementById('cidade');
const estadoEl = document.getElementById('estado');
const btnBuscarCepEl = document.getElementById('btnBuscarCep');
const formCadastroEl = document.getElementById('formCadastro');
const mensagemEl = document.getElementById('mensagem');

function exibirMensagem(texto, tipo = 'erro') {
    mensagemEl.textContent = texto
    mensagemEl.classList.add(tipo)

    setTimeout(function() {
    mensagemEl.textContent = ''
    mensagemEl.classList.remove(tipo)
}, 3000)
}

function buscarCep() {
    const cepInformado = cepEl.value.replace(/\D/g, '')
    if (cepInformado.length !== 8) {
        exibirMensagem('Digite um CEP válido.')
        return
    }

    btnBuscarCepEl.disabled = true;
    btnBuscarCepEl.textContent = 'Buscando ...'

    fetch(`https://viacep.com.br/ws/${cepInformado}/json/`)
    .then(response => response.json())
    .then(data => {
        if(!data.erro){
            cepEl.value = data.cep;
            logradouroEl.value = data.logradouro;
            bairroEl.value = data.bairro;
            cidadeEl.value = data.localidade;
            estadoEl.value = data.uf;

            cidadeEl.disabled = false;
            estadoEl.disabled = false;
        }else{
            exibirMensagem("Cep não encontrado.")

            cidadeEl.disabled = true;
            estadoEl.disabled = true;

            cidadeEl.value = "";
            estadoEl.value = "";
        }
    })
    .catch(erro => console.error("Erro ao buscar CEP: ", erro))

    cidadeEl.disabled = true;
    estadoEl.disabled = true

    .finally(function() {
    btnBuscarCepEl.disabled = false
    btnBuscarCepEl.textContent = 'Buscar CEP'
    })
}

btnBuscarCepEl.addEventListener('click', buscarCep)

function salvarDados() {
    const dados = {
        nome:nomeEl.value,
        email:emailEl.value,
        cep:cepEl.value,
        logradouro:logradouroEl.value,
        numero:numeroEl.value,
        bairro:bairroEl.value,
        cidade:cidadeEl.value,
        estado:estadoEl.value
    }

    localStorage.setItem('cadastroUsuario', JSON.stringify(dados))
}

function restaurarDados() {
    const dados = JSON.parse(localStorage.getItem('cadastroUsuario'))

    if (dados) {
        nomeEl.value = dados.nome;
        emailEl.value = dados.email;
        cepEl.value = dados.cep;
        logradouroEl.value = dados.logradouro;
        numeroEl.value = dados.numero;
        bairroEl.value = dados.bairro;
        cidadeEl.value = dados.cidade;
        estadoEl.value = dados.estado;
    }
}

formCadastroEl.addEventListener('submit', function(e) {
    e.preventDefault()
    salvarDados()
    exibirMensagem('Cadastro salvo com sucesso!', 'sucesso')
})

restaurarDados()