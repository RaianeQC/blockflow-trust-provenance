var blockflow = require('./provONERouter.js');

var bodyParser = require('body-parser')

var uuidv4 = require('uuid/v4'); 

// create application/json parser
var jsonParser = bodyParser.json()

// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })



module.exports = function(app){

    app.post('/wrapper/:inputvalue/:outputvalue/:taskname', function(req, res){
       
        var inputvalue = req.params.inputvalue;
        var startTime = new Date().toISOString();

        var outputvalue = req.params.outputvalue;
        var endTime = new Date().toISOString();
        
        var taskname = req.params.taskname;

        if( req.params.inputvalue != undefined && req.params.taskname != undefined){

            var program = {
                idProgram: uuidv4(), 
                nameProgram:taskname, 
                createdProgram:new Date().toISOString(),
               
            };

            var portInputPort = { //port
                idPort: uuidv4(), 
                portType: "inputPort",
                program: program,
                programId: program.idProgram           
            };
        
            var hasInputPort = {
                hasInputPortId:uuidv4(), 
                portId:portInputPort.idPort, 
                programID: program.idProgram, 
                programName:program.nameProgram, 
                inputPortValue:portInputPort.portValue
             };

            var entityIn = { //entity
                idEntity:uuidv4(), 
                typeEntity:"data", 
                valueEntity:inputvalue 
            };

            var hasDefaultParam = {
                idHasDefaultParam: uuidv4(),
                entityIn: entityIn,
                idEntity: entityIn.idEntity,
                portIn: portIn,
                idPort: portIn.idPort
            }

            var programExecution = {
                idProgramExecution:uuidv4(),
                programExecutionName: program.nameProgram+"_exe" ,
                startTime: startTime, 
                endTime:endTime
                
            };

            var wasassociatewith = {
                agent: agent.nameAgent, 
                idAgent: agent.idAgent,  
                programExecution:programExecution.programName, 
                idProgramExecution:programExecution.idProgramExecution, 
                idWasAssocietedWith:uuidv4()
             };
     

        }
       
        

        console.log("Inputvalue: "+inputvalue)
        console.log(new Date().toISOString())
        console.log(uuidv4())
        console.log('----------------')
        console.log("Taskname: "+taskname)
        console.log('----------------')
        console.log("Outpuvalue: "+outputvalue)        
        console.log('----------------');
        console.log(new Date().toISOString())
        console.log("\n")


        var User = {
            idUser: uuidv4(), 
            nameUser: "Raiane Coelho"
        }

       

        var hasOutPort = {
            idHasOutPort: uuidv4(),
            idProgram: program.idProgram,
            idPort:  portOut.idPort, 

        };

       

        var portIn = { //port
            idPort: uuidv4(), 
            portType: "inputPort",             
        };
       
        var portOut = { //port
            idPort: uuidv4(), 
            portType:"outputPort", 
            
        };

        

        var entityOut = { //entity
            idEntity: uuidv4(), 
            typeEntity: "data", 
            valueEntity:outputvalue 
        };

        


        

        var used = {
            idUsed: uuidv4(),
            idEntity: entityIn.idEntity,
            idProgramExecution: programExecution.idProgramExecution
        };

        var wasGeneratedBy = {
            idWasgeneratedBy = uuidv4(),
            idEntity = entityOut.idEntity,
            idProgramExecution: programExecution.idProgramExecution
        };

        var usage = {
            idUsage:uuidv4(),            
            hadInputPort: portInputPort.idPort, 
            hadEntity:entityInput.idEntity, 
            
         };

         
     
      

        var association = {
            idAssociation: uuidv4(), 
            hadPlanName: program.nameProgram, 
            hadPlanId:program.idProgram, 
            userAgentId:agent.idAgent, 
            userAgent:agent.nameAgent 
        };
        
      
    
        var qualifiedassociation = {
            idProgramExecution:programExecution.idProgramExecution,
            programExecutionName:programExecution.programName,
            idAssociation:association.idAssociation,
            agent: association.userAgent,
            hadPlan: association.hadPlanName
        };

       
       
       

     
        

       var qualifiedUsage = {
           programExecution: programExecution.programName, 
           idProgramExecution:programExecution.idProgramExecution,  
           usageId:usage.idUsage, 
           idQualifiedUsage:uuidv4(), 
           entityValue:entityInput.valueEntity
        };

        var outputPort = {
            idPort: uuidv4(), 
            portType:"outputPort", 
            portValue:outputvalue 
        };

        var hasOutputPort = {
            hasOutputPortId:uuidv4(),
            portId:outputPort.idPort, 
            programID:program.idProgram,
            programName:program.nameProgram, 
            inputPortValue:outputPort.portValue
        };

       

        var generation = {
            idGeneration:uuidv4(), 
            hadOutputPort: outputPort.idPort, 
            hadEntity:entityOutput.idEntity 
        };

        var qualifiedGeneration = {
            idQualifiedGeneration:uuidv4(),
            programExecution:programExecution.programName,
            programExecutionId:programExecution.idProgramExecution, 
            generationId:generation.idGeneration, 
            entityValue:entityOutput.valueEntity
        };

        blockflow.add_program(req, res, program);
        blockflow.add_association(req, res, association);
        blockflow.add_programexcution(req, res, programExecution);
        blockflow.add_qualifiedAssociation(req, res, qualifiedassociation);
        blockflow.add_wasAssociateWith(req, res, wasassociatewith);
        blockflow.add_port(req, res, portInputPort);
        blockflow.add_hasInputPort(req, res, hasInputPort);
        blockflow.add_entity(req, res, entityInput);        
        blockflow.add_usage(req, res, usage);
        blockflow.add_qualifiedUsage(req, res, qualifiedUsage);
        blockflow.add_port(req, res, outputPort);
        blockflow.add_hasOutputPort(req, res, hasOutputPort);
        blockflow.add_entity(req, res, entityOutput);
        blockflow.add_generation(req, res, generation);
        blockflow.add_qualifiedGeneration(req, res, qualifiedGeneration);
    
    });


 
    
  }