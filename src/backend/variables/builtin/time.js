// Migration: done

"use strict";

const moment = require("moment");

const { OutputDataType, VariableCategory } = require("../../../shared/variable-constants");

const model = {
    definition: {
        handle: "time",
        description: "Outputs the current time.",
        categories: [VariableCategory.COMMON],
        possibleDataOutput: [OutputDataType.TEXT],
        examples: [
            {
                usage: "time[format]",
                description: 'Outputs the current time in a specific format. Format uses <a href="https://momentjs.com/docs/#/displaying/format/">moment.js</a> formatting rules.'
            }
        ]
    },
    evaluator: (_, format = 'h:mm a') => {
        const now = moment();
        return now.format(format.toString());
    }
};

module.exports = model;
