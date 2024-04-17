import mongoose from "mongoose";

const csvSchema = new mongoose.Schema({
    filename: {
        type: String,
        required: true,
    },
    header_row: {
        type: [Object],
    },
    data_rows: {
        type: [Object],
    },
}, {
    timestamps: true,
});

export const csvSchemaModel = mongoose.model('CSV', csvSchema);