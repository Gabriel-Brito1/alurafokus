const html = document.querySelector('html')
const focoBt = document.querySelector('.app__card-button--foco')
const curtoBt = document.querySelector('.app__card-button--curto')
const longoBt = document.querySelector('.app__card-button--longo')
const banner = document.querySelector('.app__image')
const titulo = document.querySelector('.app__title')
const botoes = document.querySelectorAll('.app__card-button')
const startPauseBt = document.querySelector('#start-pause')
const musicaFocoInput = document.querySelector('#alternar-musica') 
const iniciarOuPausarBt = document.querySelector('#start-pause span')
const iconeIniciarOuPausarBt = document.querySelector('.app__card-primary-butto-icon')
const tempoTela = document.querySelector('#timer')

const musica = new Audio('./sons/luna-rise-part-one.mp3')
const inicio = new Audio('./sons/play.wav')
const pausa = new Audio ('./sons/pause.mp3')
const beep = new Audio('./sons/beep.mp3')

let minutos = 60

let tempoDecorridoSegundos = 25 * minutos
let intervaloId = null

musica.loop = true

musicaFocoInput.addEventListener('change', function() {
    if (musica.paused) {
        musica.play()
    }
    else {
        musica.pause()
    }
})

focoBt.addEventListener('click', function() {
    tempoDecorridoSegundos = 25 * minutos
    alterarContexto('foco')
    focoBt.classList.add('active')
});

curtoBt.addEventListener('click', function() {
    tempoDecorridoSegundos = 5 * minutos
    alterarContexto('descanso-curto')
    curtoBt.classList.add('active')
});

longoBt.addEventListener('click', function() {
    tempoDecorridoSegundos = 15 * minutos
    alterarContexto('descanso-longo')
    longoBt.classList.add('active')
}) ; 

function alterarContexto(contexto) {
    botoes.forEach(function (contexto) {
        contexto.classList.remove('active')
    })
    html.setAttribute('data-contexto', contexto)
    banner.setAttribute('src', `./imagens/${contexto}.png`)
    mostrarTempo()
    switch (contexto) {
        case 'foco':
            titulo.innerHTML = `
            Otimize sua produtividade,<br><strong class="app__title-strong">mergulhe no que importa.</strong>
            `
            break;
    
        case 'descanso-curto':
            titulo.innerHTML = `
            Que tal dar uma respirada?<br><strong class="app__title-strong">Faça uma pausa curta!</strong>
            `
            break;

        case 'descanso-longo':
            titulo.innerHTML = `
            Hora de voltar à superfície.<br><strong class="app__title-strong">Faça uma pausa longa.</strong>
            `
            break;
    }
}

const contagemRegressiva = function() {
    if (tempoDecorridoSegundos <= 0) {
        beep.play()
        iniciarOuPausarBt.textContent = "Começar"
        iconeIniciarOuPausarBt.setAttribute('src', './imagens/play_arrow.png')
        const focoAtivo = html.getAttribute('data-contexto') == 'foco'
        if (focoAtivo) {
            const evento = new CustomEvent('FocoFinalizado')
            document.dispatchEvent(evento)
        }
        zerar()
        return
    }
    tempoDecorridoSegundos -= 1
    mostrarTempo()
}

startPauseBt.addEventListener('click', iniciarOuPausar)

function iniciarOuPausar() {
    if (intervaloId) {
        zerar()
        pausa.play()
        iniciarOuPausarBt.textContent = "Começar"
        iconeIniciarOuPausarBt.setAttribute('src', './imagens/play_arrow.png')
        return
    }
    inicio.play()
    intervaloId = setInterval(contagemRegressiva, 1000)
    iniciarOuPausarBt.textContent = 'Pausar'
    iconeIniciarOuPausarBt.setAttribute('src', './imagens/pause.png')
}

function zerar() {
    clearInterval(intervaloId)
    intervaloId = null
}

function mostrarTempo() {
    const tempo = new Date(tempoDecorridoSegundos*1000)
    const tempoFormatado = tempo.toLocaleTimeString('pt-Br',{minute: '2-digit', second: '2-digit'})
    tempoTela.innerHTML = `${tempoFormatado}`
}

mostrarTempo()