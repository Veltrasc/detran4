const origins = {
    listar: 'http://localhost:3000/listarLaudos/',
    consulta: 'http://localhost:3000/consultar/',
};

const LISTAR = async (placa) => {
    const response = await fetch(origins.listar + placa);
    return await response.json();
};

const CONSULTAR = async () => {
    try {
        const list = await LISTAR('MCN2242');

        if (list.length === 0) {
            console.log("Nenhum laudo encontrado.");
            return;
        }

        const data = list[0];
        const numeroLaudo = data?.numeroLaudo;
        const responseConsultar = await fetch(origins.consulta + numeroLaudo);
        const dataConsultar = await responseConsultar.json();

        console.log(`LISTA DE LAUDOS:\n${JSON.stringify(list, null, 2)}\n\n LAUDO CONSULTADO: ${numeroLaudo}\n\nDADOS DA CONSULTA: ${JSON.stringify(dataConsultar, null, 2)}`);

    } catch (error) {
        console.error("Erro durante a consulta:", error);
    }
};

CONSULTAR();
