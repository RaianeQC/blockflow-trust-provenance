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
        var outputvalue = req.params.outputvalue;
        var taskname = req.params.taskname;
        var startTime = new Date().toISOString();
        var endTime = new Date().toISOString();

        const tokenreq = req.headers.authorization;

        console.log(tokenreq)
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


        var agent = {
            idAgent: uuidv4(), 
            nameAgent: "Alice"
        }

        var portInputPort = {
            idPort: uuidv4(), 
            portType:"inputPort", 
            portValue:inputvalue 
        };
       
        var outputPort = {
            idPort: uuidv4(), 
            portType:"outputPort", 
            portValue:outputvalue 
        };

        var program = {
            idProgram: uuidv4(), 
            nameProgram:taskname, 
            created:new Date().toISOString(),
            hasOutPort: outputPort,
            hasInPort: portInputPort
        };
      

        var association = {
            idAssociation: uuidv4(), 
            hadPlanName: program.nameProgram, 
            hadPlanId:program.idProgram, 
            userAgentId:agent.idAgent, 
            userAgent:agent.nameAgent 
        };
        
        var programExecution = {
            idProgramExecution:uuidv4(), 
            startTime: startTime, 
            endTime:endTime, 
            programName:taskname+"_exe"
        };
    
        var qualifiedassociation = {
            idProgramExecution:programExecution.idProgramExecution,
            programExecutionName:programExecution.programName,
            idAssociation:association.idAssociation,
            agent: association.userAgent,
            hadPlan: association.hadPlanName
        };

       var wasassociatedwith = {
           agent: agent.nameAgent, 
           idAgent: agent.idAgent,  
           programExecution:programExecution.programName, 
           idProgramExecution:programExecution.idProgramExecution, 
           idWasAssocietedWith:uuidv4()
        };

       
       var hasInputPort = {
           hasInputPortId:uuidv4(), 
           portId:portInputPort.idPort, 
           programID: program.idProgram, 
           programName:program.nameProgram, 
           inputPortValue:portInputPort.portValue
        };

        var entityInput = {
            idEntity:uuidv4(), 
            typeEntity:"data", 
            valueEntity:inputvalue 
        };

        var usage = {
            hadInputPort: portInputPort.idPort, 
            hadEntity:entityInput.idEntity, 
            idUsage:uuidv4()
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

        var entityOutput = {
            idEntity:uuidv4(), 
            typeEntity:"data", 
            valueEntity:outputvalue 
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

        var used = {
            idUsed:uuidv4(),
            programExecutionId: programExecution.idProgramExecution,
            programExecutionName: programExecution.programName,
            idEntity: entityInput.idEntity,
            entityValue: entityInput.valueEntity
        };

        var wasGeneratedBy = {
            idWasGeneratedBy: uuidv4(),
            programExecutionId: programExecution.idProgramExecution,
            programExecutionName: programExecution.programName,
            idEntity: entityOutput.idEntity,           
            entityValue: entityOutput.valueEntity  
        };

        blockflow.add_program(req, res, program);
        blockflow.add_association(req, res, association);
        blockflow.add_programexcution(req, res, programExecution);
        blockflow.add_qualifiedAssociation(req, res, qualifiedassociation);
        blockflow.add_wasAssociatedWith(req, res, wasassociatedwith);
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
        blockflow.add_used(req,res,used);
        blockflow.add_wasGeneratedBy(req,res,wasGeneratedBy);
    
    });


 
    
  }