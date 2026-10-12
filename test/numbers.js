module.exports = {

    decimal: {
        encode: {
            "0": "0:i",
            "123": "3:i;2:i;1:i",
            "12`": "0:i-below;1:i-below",
        },
        transcribe: {
            annatar: {
                "0 1 2 3 4 5 6 7 8 9": "ð% ñ% ò% ó% ô% õT ö% ÷% øT ù%",
            },
            parmaite: {
                "0 1 2 3 4 5 6 7 8 9": "ðT ñT ò% ó% ôG õT ö% ÷% øG ù%",
            },
        },
    },

    duodecimal: {
        encode: {
            "0": "0:i-below",
            "12": "0:i-below;1:i-below",
            "144": "0:i-below;0:i-below;1:i-below",
            "131": "11:i-below;10:i-below",
            "123`": "3:i;2:i;1:i",
        },
        transcribe: {
            annatar: {
                "0 1 2 3 4 5 6 7 8 9 10 11": "ðË ñË òÉ óÈ ôË õÉ öË ÷È øÉ ùÈ úË ûË",
            },
            parmaite: {
                "0 1 2 3 4 5 6 7 8 9 10 11": "ðÉ ñÉ òÈ óÈ ôÊ õÈ öÊ ÷Ê øË ùÈ úÉ ûÊ",
            },
        },
    },
};
