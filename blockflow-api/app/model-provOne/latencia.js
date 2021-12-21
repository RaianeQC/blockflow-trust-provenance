const mongoose = require('../database/connection')

const LatenciaSchema = new mongoose.Schema({ 

    quantidadeDados: {
        type: String
    },
    
    tempo: {
        type: string
    },
    
    objeto: {
        type: String 
    },
    
    tipoPlataforma: {
        type: String 
    },
    
   

    
      
})

const Latencia = mongoose.model('Latencia', LatenciaSchema);

module.exports = Latencia;