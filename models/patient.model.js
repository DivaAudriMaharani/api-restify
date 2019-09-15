const mongoose = require('mongoose')
const Schema = mongoose.Schema

const patientSchema = new Schema({
    patient_id: {
        type: String,
        required: true
    },
    patient_name: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    diagnosis:{
        type: String,
        required: true
    },
    room: {
        type: Number,
        required: true
    },
    date_in: {
        type: String,
        required: true
    },
    date_out: {
        type: String,
        required: true
    },
})

mongoose.model('patient', patientSchema)