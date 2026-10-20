// Datos editables de World 1-1. Coordenadas en celdas de 18 px.
export const LEVEL = {
    ground: [[0, 37], [41, 75], [79, 116], [121, 151], [155, 192]],
    platforms: [[26, 13, 5], [63, 13, 5], [89, 12, 6], [112, 14, 5], [146, 12, 6]],
    blocks: [
        ['brick', 10, 14], ['question', 11, 14], ['brick', 12, 14], ['hard', 13, 14],
        ['brick', 20, 14], ['brick', 21, 14], ['question', 22, 14],
        ['hard', 48, 14], ['question', 49, 14], ['brick', 50, 14], ['brick', 51, 14],
        ['brick', 83, 14], ['question', 84, 14], ['brick', 85, 14],
        ['hard', 103, 14], ['hard', 104, 14], ['question', 105, 14],
        ['brick', 132, 14], ['question', 133, 14], ['brick', 134, 14],
        ['hard', 164, 16], ['hard', 165, 16], ['hard', 165, 15],
        ['hard', 166, 16], ['hard', 166, 15], ['hard', 166, 14]
    ],
    pipes: [[31, 2, false], [57, 3, true], [97, 2, true], [139, 3, true], [172, 2, false]],
    goombas: [24, 46, 69, 87, 108, 130, 159],
    coinRows: [[6, 16, 4], [26, 11, 5], [36, 13, 5], [63, 11, 5], [74, 13, 5],
        [89, 10, 6], [115, 11, 6], [146, 10, 6], [150, 13, 5], [177, 15, 5]],
    goal: 185
};
