const adicionarTarefaBt = document.querySelector('.app__button--add-task')
const adicionarTarefaForm = document.querySelector('.app__form-add-task')
const cancelarBt = document.querySelector('.app__form-footer__button--cancel')
const textarea = document.querySelector('.app__form-textarea')
const tarefasUl = document.querySelector('.app__section-task-list')
const descricaoTarefaPgf = document.querySelector('.app__section-active-task-description')

const removerConcluidasBt = document.querySelector('#btn-remover-concluidas')
const removerTodasBt = document.querySelector('#btn-remover-todas')

let tarefas = JSON.parse(localStorage.getItem('tarefas')) || []
let tarefaSelecionada = null
let tarefaSelecionadaLi = null

function atualizarTarefas() {
    localStorage.setItem('tarefas', JSON.stringify(tarefas))
}

function criarElementoTarefa(tarefa) {
    const li = document.createElement('li')
    li.classList.add('app__section-task-list-item')

    const svg = document.createElement('svg')
    svg.innerHTML = `
    <svg class="app__section-task-icon-status" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="12" fill="#FFF"></circle>
        <path d="M9 16.1719L19.5938 5.57812L21 6.98438L9 18.9844L3.42188 13.4062L4.82812 12L9 16.1719Z" fill="#01080E"></path>
    </svg>
    `
    const p = document.createElement('p')
    p.classList.add('app__section-task-list-item-description')
    p.textContent = tarefa.descricao

    const button = document.createElement('button')
    button.classList.add('app_button-edit')

    button.onclick = function() {
        const novaDescricao = prompt('Qual é o novo nome da tarefa?')
        if (novaDescricao) {
            p.textContent = novaDescricao
            tarefa.descricao = novaDescricao
            atualizarTarefas()
        }
    }

    const imgButton = document.createElement('img')
    imgButton.setAttribute('src', './imagens/edit.png')

    button.append(imgButton)
    li.append(svg)
    li.append(p)
    li.append(button)

    if (tarefa.completa) {
        li.classList.add('app__section-task-list-item-complete')
        button.setAttribute('disabled', true)
    } else {
        li.onclick = function() {
            document.querySelectorAll('.app__section-task-list-item-active')
                .forEach(elemento => {
                    elemento.classList.remove('app__section-task-list-item-active')
                });
                
            if (tarefaSelecionada == tarefa) {
                descricaoTarefaPgf.textContent = ''
                tarefaSelecionada = null
                tarefaSelecionadaLi = null
                return
            }
            tarefaSelecionada = tarefa
            tarefaSelecionadaLi = li
            descricaoTarefaPgf.textContent = tarefa.descricao
            li.classList.add('app__section-task-list-item-active')
        }
    }

    

    return li
}

adicionarTarefaBt.addEventListener('click', function() {
    adicionarTarefaForm.classList.toggle('hidden')
})

adicionarTarefaForm.addEventListener('submit', function(evento) {
    evento.preventDefault()
    const tarefa = {
        descricao: textarea.value
    }
    tarefas.push(tarefa)
    const elementoTarefa = criarElementoTarefa(tarefa)
    tarefasUl.append(elementoTarefa)
    atualizarTarefas()
    textarea.value = ''
    adicionarTarefaForm.classList.add('hidden')
})

cancelarBt.addEventListener('click', function() {
    textarea.value = ''
    adicionarTarefaForm.classList.add('hidden')
})

tarefas.forEach(tarefa => {
    const elementoTarefa = criarElementoTarefa(tarefa)
    tarefasUl.append(elementoTarefa)
});

document.addEventListener('FocoFinalizado', function() {
    if (tarefaSelecionada && tarefaSelecionadaLi) {
        tarefaSelecionadaLi.classList.remove('app__section-task-list-item-active')
        tarefaSelecionadaLi.classList.add('app__section-task-list-item-complete')
        tarefaSelecionadaLi.querySelector('button').setAttribute('disabled', true)
        tarefaSelecionada.completa = true
        atualizarTarefas()
    }
    
})

const removerTarefas = function(somenteCompletas) {
    const seletor = somenteCompletas ? '.app__section-task-list-item-complete' : '.app__section-task-list-item'
    document.querySelectorAll(seletor).forEach(elemento => {
        elemento.remove()
    })

    tarefas = somenteCompletas ? tarefas.filter(tarefa => !tarefa.completa) : []
    atualizarTarefas()
}

removerConcluidasBt.onclick = function() {removerTarefas(true)}
removerTodasBt.onclick = function() {removerTarefas(false)}