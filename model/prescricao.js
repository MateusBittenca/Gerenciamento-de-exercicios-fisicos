module.exports = {
    hipertrofia: { series: 3, reps: '8-12', descanso_seg: 90 },
    forca: { series: 4, reps: '4-6', descanso_seg: 150 },
    adaptacao: { series: 3, reps: '12-15', descanso_seg: 60 },
    funcional: { series: 3, reps: '10-12', descanso_seg: 60 },
    padrao: { series: 3, reps: '10', descanso_seg: 60 }
};

module.exports.paraObjetivo = function (objetivo) {
    const mapa = module.exports;
    return mapa[objetivo] || mapa.padrao;
};
