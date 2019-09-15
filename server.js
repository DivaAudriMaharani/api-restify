const restify = require('restify')
const project = require('./package.json')
const patientController = require('./controllers/patient.controller')

function AppServer(){
    // create server
    this.server = restify.createServer({
        name: `${project.name}-server`,
        version: project.version
    })

    this.server.use(restify.plugins.bodyParser())
    this.server.use(restify.plugins.queryParser())

    // root
    this.server.get('/', (req, res) => {
        res.send({ success:true, data:'index', message:'This service is running properly', code:200 });
    })

    // patient route
    this.server.get('/patient', patientController.getHandler)
    this.server.get('/patient/:id', patientController.getOneHandler)
    this.server.post('/patient', patientController.postHandler)
    this.server.put('/patient/:id', patientController.putHandler)
    this.server.del('/patient/:id', patientController.deleteHandler)
    this.server.get('/patient/export/:id', patientController.exportHandler)
}

module.exports = AppServer