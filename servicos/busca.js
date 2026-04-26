function executar_busca(modelo, termo) {
    if (!termo || termo.trim() === '') {
        return modelo.listar_perguntas();
    }
    return modelo.buscar_perguntas(termo.trim());
}

module.exports = { executar_busca };