const listaEventos = document.getElementById("listaEventos");
const modal = document.getElementById("eventModal");
const form = document.getElementById("cadEvento");
const buscarEvento = document.getElementById("buscarEvento");


function getEventos() {
    return JSON.parse(localStorage.getItem("eventos")) || [];
}


function salvarEventos(eventos) {
    localStorage.setItem("eventos", JSON.stringify(eventos));
}


function toggleModal(show) {

    if(show){
        modal.classList.remove("hidden-modal");
        document.body.style.overflow = "hidden";
    } else {
        modal.classList.add("hidden-modal");
        document.body.style.overflow = "";
    }
}


function formatarData(data){

    const novaData = new Date(data);

    return novaData.toLocaleString("pt-BR", {
        dateStyle:"short",
        timeStyle:"short"
    });
}


if(form){

    form.addEventListener("submit", function(e){

        e.preventDefault();

        const dados = new FormData(form);

        const novoEvento = {
            id: Date.now(),
            titulo: dados.get("titulo"),
            data: dados.get("data"),
            local: dados.get("local"),
            descricao: dados.get("descricao"),
            imagens: []
        };

        const eventos = getEventos();

        eventos.push(novoEvento);

        salvarEventos(eventos);

        form.reset();

        toggleModal(false);

        listarEventos();
    });

}


function listarEventos(lista = null){

    if(!listaEventos) return;

    listaEventos.innerHTML = "";

    const eventos = lista || getEventos();

    eventos.forEach(evento => {

        const card = document.createElement("div");

        card.className = `
            bg-white
            rounded-2xl
            overflow-hidden
            shadow-md
            hover:shadow-xl
            transition
        `;

        card.innerHTML = `

            <img
                src="https://picsum.photos/500/300?random=${evento.id}"
                class="w-full h-52 object-cover"
            >

            <div class="p-6">

                <h3 class="text-2xl font-bold mb-4">
                    ${evento.titulo}
                </h3>

                <div class="flex flex-col gap-2 text-gray-500 mb-6">

                    <div class="flex items-center gap-2">
                        <span class="material-symbols-outlined">
                            calendar_today
                        </span>

                        ${formatarData(evento.data)}
                    </div>

                    <div class="flex items-center gap-2">
                        <span class="material-symbols-outlined">
                            location_on
                        </span>

                        ${evento.local}
                    </div>

                </div>

                <div class="flex justify-between items-center border-t pt-4">

                    <button
                        onclick="verDetalhes(${evento.id})"
                        class="text-blue-600 font-bold flex items-center gap-1"
                    >

                        Ver Detalhes

                        <span class="material-symbols-outlined">
                            arrow_forward
                        </span>

                    </button>

                    <button
                        onclick="excluirEvento(${evento.id})"
                        class="text-red-500"
                    >

                        <span class="material-symbols-outlined">
                            delete
                        </span>

                    </button>

                </div>

            </div>
        `;

        listaEventos.appendChild(card);
    });
}

function excluirEvento(id){

    let eventos = getEventos();

    eventos = eventos.filter(evento => evento.id !== id);

    salvarEventos(eventos);

    listarEventos();
}


function verDetalhes(id){

    localStorage.setItem("eventoSelecionado", id);

    window.location.href = "detalhes.html";
}

function voltar(){

    window.location.href = "index.html";
}


function carregarDetalhes(){

    const id = localStorage.getItem("eventoSelecionado");

    if(!id) return;

    const eventos = getEventos();

    const evento = eventos.find(e => e.id == id);

    if(!evento) return;

    const tituloEvento = document.getElementById("tituloEvento");
    const dataEvento = document.getElementById("dataEvento");
    const localEvento = document.getElementById("localEvento");
    const descricaoEvento = document.getElementById("descricaoEvento");

    if(tituloEvento){

        tituloEvento.textContent = evento.titulo;
        dataEvento.textContent = formatarData(evento.data);
        localEvento.textContent = evento.local;
        descricaoEvento.textContent = evento.descricao;

        carregarImagens(evento);
    }
}


function uploadImagem(){

    const input = document.getElementById("inputImagem");

    const file = input.files[0];

    if(!file){
        alert("Selecione uma imagem");
        return;
    }

    const reader = new FileReader();

    reader.onload = function(){

        const id = localStorage.getItem("eventoSelecionado");

        const eventos = getEventos();

        const evento = eventos.find(e => e.id == id);

        if(!evento) return;

        if(!evento.imagens){
            evento.imagens = [];
        }

        evento.imagens.push(reader.result);

        salvarEventos(eventos);

        carregarImagens(evento);

        input.value = "";
    };

    reader.readAsDataURL(file);
}


function carregarImagens(evento){

    const listaImagens = document.getElementById("listaImagens");

    if(!listaImagens) return;

    listaImagens.innerHTML = "";

    if(!evento.imagens) return;

    evento.imagens.forEach(img => {

        const imagem = document.createElement("img");

        imagem.src = img;

        imagem.className = `
            w-full
            h-60
            object-cover
            rounded-2xl
            shadow-md
        `;

        listaImagens.appendChild(imagem);
    });
}


if(buscarEvento){

    buscarEvento.addEventListener("input", function(){

        const valor = this.value.toLowerCase();

        const eventos = getEventos();

        const filtrados = eventos.filter(evento =>

            evento.titulo.toLowerCase().includes(valor) ||
            evento.local.toLowerCase().includes(valor)

        );

        listarEventos(filtrados);
    });

}


listarEventos();
carregarDetalhes();