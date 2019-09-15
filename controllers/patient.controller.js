const uuidv4 = require('uuid/v4')
const mongoose = require('mongoose')
var PDFDocument = require('pdfkit');
const fs = require('fs')
const model = require('../models/patient.model')
const Patient = mongoose.model('patient')
const response = require('../helper/wrapper')
const { ERROR: httpError } = require('../helper/httpError')

const patientController = {
    getHandler: (req, res) => {
        Patient.find((err, value) => {
            if(err){
                return response.wrapper_error(res, httpError.INTERNAL_ERROR, 'An error has occured')
            }
    
            if(value.length > 0){
                response.wrapper_success(res, 200, 'Request has been processed', value)
            } else {
                response.wrapper_error(res, httpError.NOT_FOUND, 'Data patient is not found')
            }
        })
    },

    getOneHandler: (req, res) => {
        Patient.find({patient_id: req.params.id}, (err, value) => {
            if(err){
                return response.wrapper_error(res, httpError.INTERNAL_ERROR, 'An error has occured')
            }

            if(value.length > 0){
                response.wrapper_success(res, 200, 'Request has been processed', value)
            } else {
                response.wrapper_error(res, httpError.NOT_FOUND, 'Data patient is not found')
            }

        })
    },

    postHandler: (req, res) => {
        let payload = {
            patient_id: uuidv4(),
            patient_name: req.body.patient_name,
            gender: req.body.gender,
            address: req.body.address,
            diagnosis: req.body.diagnosis,
            room: req.body.room,
            date_in: req.body.date_in,
            date_out: '-'
        }

        Patient.create(payload, (err, value) => {
            if(err){
                return response.wrapper_error(res, httpError.INTERNAL_ERROR, 'An error has occured')
            }

            response.wrapper_success(res, 201, 'Patient has been inserted', value)
        })
    },

    putHandler: (req, res) => {
        let payload = {
            patient_id: req.params.id
        }

        Patient.findOneAndUpdate(payload, req.body, (err, value) => {
            if(err){
                return res.status(500).send({'error':'An error has occurred'})
            }

            if(value != null){
                response.wrapper_success(res, 202, 'Patient has been updated', value)
            } else {
                response.wrapper_error(res, httpError.INTERNAL_ERROR, 'Failed to update patient')
            }
        })
    },

    deleteHandler: (req, res) => {
        let payload = {
            patient_id: req.params.id
        }

        Patient.findOneAndRemove(payload, (err, value) => {
            if(err){
                return response.wrapper_error(res, httpError.INTERNAL_ERROR, 'An error has occurred')
            }

            if(value != null){
                res.send({
                    'code': 204,
                    'success': 'true',
                    'message': `Patient ${value.patient_name} has been deleted`
                })
            } else {
                response.wrapper_error(res, httpError.INTERNAL_ERROR, 'Failed to delete publisher')
            }
        })
    },

    exportHandler: (req, res) => {
        let payload = {
            patient_id: req.params.id
        }          

        Patient.findOne(payload, (err, value) => {

            if(err){
                return response.wrapper_error(res, httpError.INTERNAL_ERROR, 'An error has occurred')
            }

            if(value){
                // fs.appendFile(`${value.patient_name}.pdf`, pdf, function (err) {
                //     if (err) throw err;
                //     console.log('Saved!');
                // })

                let pdf = new PDFDocument({
                    size: 'A5',
                    info: {
                      Title: 'Rumah Sakit Biar Sembuh',
                    },
                    fontSize: 12
                });

                pdf.text('Rumah Sakit Biar Sembuh', {
                    align: 'center',
                    fontSize1: 14
                })
                pdf.moveDown(1.5)
    
                pdf.text(`Nama                         : ${value.patient_name}`)
                pdf.moveDown(0.5)
                pdf.text(`Jenis Kelamin            : ${value.gender}`)
                pdf.moveDown(0.5)
                pdf.text(`Alamat                       : ${value.address}`)
                pdf.moveDown(0.5)
                pdf.text(`Diagnosa                   : ${value.diagnosis}`)
                pdf.moveDown(0.5)
                pdf.text(`Ruang                        : ${value.room}`)
                pdf.moveDown(0.5)
                pdf.text(`Tanggal masuk          : ${value.date_in}`)
                pdf.moveDown(0.5)
                pdf.text(`Tanggal keluar           : ${value.date_out}`)

                pdf.pipe(
                    fs.createWriteStream(`${value.patient_name}.pdf`)
                )
                pdf.end();

                res.send({
                    'code': 200,
                    'sucsess': true,
                    'message': `Patient ${value.patient_name} has been saved`
                })
                
            } else {
                response.wrapper_error(res, httpError.NOT_FOUND, 'Data patient is not found')
            }
        })
        
    }
}

module.exports = patientController