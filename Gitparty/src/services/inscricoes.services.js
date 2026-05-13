const prisma = require("../data/prisma");

const limiteInscricoes = async (eventoID) => {
    const evento = await prisma.eventos.findUnique({
        where: { id : eventoID },
        include: {
            inscricoes: true
        }
    });

    const numeroInscricoes = evento.inscricoes.filter(inscricao => inscricao.status == "CONFIRMADA").length;

    if(numeroInscricoes == evento.capacidade_maxima) {
        return "LISTA_ESPERA";
    } else {
        return "";
    }
};

const inscricaoDuplicada = async (usuarioId, eventoId) => {
    const evento = await prisma.eventos.findUnique({
        where: { id: eventoId },
        include: {
            inscricoes: true
        }
    });

    console.log(usuarioId);

    const inscrito = evento.inscricoes.filter(inscricao => inscricao.usuariosId == usuarioId).length;

    console.log(inscrito)

    if(inscrito == 1 ) {
        throw new Error("Usuario ja inscrito no evento");
    }
}

module.exports = {
    limiteInscricoes,
    inscricaoDuplicada
}