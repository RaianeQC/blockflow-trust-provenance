//SPDX-License-Identifier: Apache-2.0
var blockflow = require('../blockchain-controller/invoke-transaction');

var bodyParser = require('body-parser')

// create application/json parser
var jsonParser = bodyParser.json();

// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false });

const shell = require('shelljs');
const path = require('path');
const hfc = require('fabric-client');



module.exports = {

  /*app.get('/get_all_workflow', function(req, res){
    blockflow.get_all_workflow(req, res);
  });*/

  async add_program(req, res, program) {

    console.log(program);
   
   var json =  JSON.stringify(program)

   //console.log("Verificar aqui"+json);

   //var obj = JSON.parse(json);

   const channelName = "mychannel";
   const peerNames = ["peer0.UFJF.com"];
   const userName = 'raiane'; 
   const orgName = 'UFJF'; 
   const chaincodeName =  "blockflow-chaincode";          
   const fcn = 'recordProgram';
   const nameNetworks = 'BlockchainCovid';

   const pathNetworks = '/home/raiane/Documentos/estudos-blockchain/mestrado-backup-11042020/blockflow1.0/networks/'+nameNetworks;

   shell.cd(pathNetworks);
        

   hfc.setConfigSetting('network-connection-profile-path',path.join( pathNetworks ,'/network-config.yaml'));
   hfc.setConfigSetting(orgName+'-connection-profile-path',path.join( pathNetworks, '/'+orgName+'.yaml'));
  

   //for(var attr in obj){

      var idProgram = program.idProgram
      var nameProgram = program.nameProgram     
      var created =  program.created
      var hasOutPort =  program.hasOutPort
      var hasInPort = program.hasInPort

      var args = [idProgram, nameProgram, created, hasOutPort, hasInPort];

      console.log(args);
   
      blockflow.invokeChaincode(peerNames, channelName, chaincodeName, fcn, args, userName, orgName)
   //   //blockflow.add_program(req, res, program);
  // }
 
  },

  async add_association (req, res, association ){

    const channelName = "mychannel";
    const peerNames = ["peer0.UFJF.com"];
    const userName = 'raiane'; 
    const orgName = 'UFJF'; 
    const chaincodeName =  "blockflow-chaincode";         
    const fcn = 'recordAssociation';

    const nameNetworks = 'BlockchainCovid';

    const pathNetworks = '/home/raiane/Documentos/estudos-blockchain/mestrado-backup-11042020/blockflow1.0/networks/'+nameNetworks;

    shell.cd(pathNetworks);
        

    hfc.setConfigSetting('network-connection-profile-path',path.join( pathNetworks ,'/network-config.yaml'));
    hfc.setConfigSetting(orgName+'-connection-profile-path',path.join( pathNetworks, '/'+orgName+'.yaml'));
   
  
      
       var idAssociation = association.idAssociation
       var hadPlanName = association.hadPlanName
       var hadPlanId = association.hadPlanId
       var userAgentId = association.userAgentId
       var userAgent = association.userAgent
      
       var args = [idAssociation, hadPlanName, hadPlanId, userAgentId, userAgent];
     

       blockflow.invokeChaincode(peerNames, channelName, chaincodeName, fcn, args, userName, orgName);
       //blockflow.add_association(req, res, association);
    //}
  
   },


   async add_programexcution(req, res, programExecution){

    const channelName = "mychannel";
    const peerNames = ["peer0.UFJF.com"];
    const userName = 'raiane'; 
    const orgName = 'UFJF'; 
    const chaincodeName =  "blockflow-chaincode";      
    const fcn = 'recordProgramexcution';

    const nameNetworks = 'BlockchainCovid';

    const pathNetworks = '/home/raiane/Documentos/estudos-blockchain/mestrado-backup-11042020/blockflow1.0/networks/'+nameNetworks;
 
    shell.cd(pathNetworks);
         
 
    hfc.setConfigSetting('network-connection-profile-path',path.join( pathNetworks ,'/network-config.yaml'));
    hfc.setConfigSetting(orgName+'-connection-profile-path',path.join( pathNetworks, '/'+orgName+'.yaml'));
   
  

       var idProgramExecution = programExecution.idProgramExecution
       var startTime = programExecution.startTime
       var endTime = programExecution.endTime
       var programName = programExecution.programName
    
       var args = [idProgramExecution,startTime, endTime, programName];

       blockflow.invokeChaincode(peerNames, channelName, chaincodeName, fcn, args, userName, orgName);

      
    
       
  
   },

   async add_qualifiedAssociation(req, res, qualifiedassociation){

    const channelName = "mychannel";
    const peerNames = ["peer0.UFJF.com"];
    const userName = 'raiane'; 
    const orgName = 'UFJF'; 
    const chaincodeName =  "blockflow-chaincode";        
    const fcn = 'recordQualifiedAssociation';
   
    const nameNetworks = 'BlockchainCovid';

   const pathNetworks = '/home/raiane/Documentos/estudos-blockchain/mestrado-backup-11042020/blockflow1.0/networks/'+nameNetworks;

   shell.cd(pathNetworks);
        

   hfc.setConfigSetting('network-connection-profile-path',path.join( pathNetworks ,'/network-config.yaml'));
   hfc.setConfigSetting(orgName+'-connection-profile-path',path.join( pathNetworks, '/'+orgName+'.yaml'));

       var agent = qualifiedassociation.agent
       var hadPlan = qualifiedassociation.hadPlan
       var idProgramExecution = qualifiedassociation.idProgramExecution
       var programExecutionName = qualifiedassociation.programExecutionName
       var idAssociation = qualifiedassociation.idAssociation
      
       
       var args = [
         idProgramExecution,
         programExecutionName,
         idAssociation,
         agent,
         hadPlan];

         blockflow.invokeChaincode(peerNames, channelName, chaincodeName, fcn, args, userName, orgName);

       //blockflow.add_qualifiedAssociation(req, res, qualifiedAssociation);
   
  
   },


   async add_wasAssociatedWith(req, res, wasassociatedwith){

    const channelName = "mychannel";
    const peerNames = ["peer0.UFJF.com"];
    const userName = 'raiane'; 
    const orgName = 'UFJF'; 
    const chaincodeName =  "blockflow-chaincode";         
    const fcn = 'recordwasAssociatedWith';
   
    const nameNetworks = 'BlockchainCovid';

    const pathNetworks = '/home/raiane/Documentos/estudos-blockchain/mestrado-backup-11042020/mestrado-08-08/blockflow1.0/networks/'+nameNetworks;
 
    shell.cd(pathNetworks);
         
 
    hfc.setConfigSetting('network-connection-profile-path',path.join( pathNetworks ,'/network-config.yaml'));
    hfc.setConfigSetting(orgName+'-connection-profile-path',path.join( pathNetworks, '/'+orgName+'.yaml'));

      var agent = wasassociatedwith.nameAgent
      var idAgent = wasassociatedwith.idAgent
      var programExecution = wasassociatedwith.programExecution
      var idProgramExecution =wasassociatedwith.idProgramExecution
      var idWasAssocietedWith = wasassociatedwith.idWasAssocietedWith
      
      
       var args = [agent, idAgent,  programExecution, idProgramExecution, idWasAssocietedWith];
       
       blockflow.invokeChaincode(peerNames, channelName, chaincodeName, fcn, args, userName, orgName);
       
       
       //blockflow.add_wasAssociateWith(req, res, wasassociatewith);
    
  
   },


   async add_entity(req, res, entityInput){

    const channelName = "mychannel";
    const peerNames = ["peer0.UFJF.com"];
    const userName = 'raiane'; 
    const orgName = 'UFJF'; 
    const chaincodeName =  "blockflow-chaincode";       
    const fcn = 'recordEntity';
   
    const nameNetworks = 'BlockchainCovid';

    const pathNetworks = '/home/raiane/Documentos/estudos-blockchain/mestrado-backup-11042020/blockflow1.0/networks/'+nameNetworks;
 
    shell.cd(pathNetworks);
         
 
    hfc.setConfigSetting('network-connection-profile-path',path.join( pathNetworks ,'/network-config.yaml'));
    hfc.setConfigSetting(orgName+'-connection-profile-path',path.join( pathNetworks, '/'+orgName+'.yaml'));


    var idEntity = entityInput.idEntity
    var typeEntity = entityInput.typeEntity
    var valueEntity = entityInput.valueEntity

      
      
    var args = [idEntity, typeEntity, valueEntity ];
       
    blockflow.invokeChaincode(peerNames, channelName, chaincodeName, fcn, args, userName, orgName);
       //blockflow.add_entity(req, res, entity);
    
  
   },

   async add_port(req, res, portInputPort){

    const channelName = "mychannel";
    const peerNames = ["peer0.UFJF.com"];
    const userName = 'raiane'; 
    const orgName = 'UFJF'; 
    const chaincodeName =  "BlockFlowCollaborative";     
    const fcn = 'recordPort';
   
    const nameNetworks = 'BlockchainCovid';

    const pathNetworks = '/home/raiane/Documentos/estudos-blockchain/mestrado-backup-11042020/blockflow1.0/networks/'+nameNetworks;
 
    shell.cd(pathNetworks);
         
 
    hfc.setConfigSetting('network-connection-profile-path',path.join( pathNetworks ,'/network-config.yaml'));
    hfc.setConfigSetting(orgName+'-connection-profile-path',path.join( pathNetworks, '/'+orgName+'.yaml'));

      var idPort = portInputPort.idPort
      var portType = portInputPort.portType
      var portValue = portInputPort.portValue

      
     
       var args = [idPort, portType, portValue ];
       
       blockflow.invokeChaincode(peerNames, channelName, chaincodeName, fcn, args, userName, orgName);
       //blockflow.add_port(req, res, port);
    
  
   },

   async add_hasOutputPort(req, res, hasOutputPort){

    const channelName = "mychannel";
    const peerNames = ["peer0.UFJF.com"];
    const userName = 'raiane'; 
    const orgName = 'UFJF'; 
    const chaincodeName =  "blockflow-chaincode";       
    const fcn = 'recordHasOutPort';
   
    const nameNetworks = 'BlockchainCovid';

    const pathNetworks = '/home/raiane/Documentos/estudos-blockchain/mestrado-backup-11042020/blockflow1.0/networks/'+nameNetworks;
 
    shell.cd(pathNetworks);
         
 
    hfc.setConfigSetting('network-connection-profile-path',path.join( pathNetworks ,'/network-config.yaml'));
    hfc.setConfigSetting(orgName+'-connection-profile-path',path.join( pathNetworks, '/'+orgName+'.yaml'));

    
      var hasOutputPortId = hasOutputPort.hasInputPortId
      var portId = hasOutputPort.portId
      var programID = hasOutputPort.programID
      var programName = hasOutputPort.programName
      var inputPortValue = hasOutputPort.inputPortValue
      
      console.log(hasOutputPortId, portId, programID,  programName, inputPortValue)
      var args = [hasOutputPortId, portId, programID, programName, inputPortValue];
      
      blockflow.invokeChaincode(peerNames, channelName, chaincodeName, fcn, args, userName, orgName);
      //blockflow.add_hasOutputPort(req, res, hasOutputPort);
    
  
   },


   async add_hasInputPort(req, res, hasInputPort ){

    const channelName = "mychannel";
    const peerNames = ["peer0.UFJF.com"];
    const userName = 'raiane'; 
    const orgName = 'UFJF'; 
    const chaincodeName =  "blockflow-chaincode";         
    const fcn = 'recordHasInPort';
   
    const nameNetworks = 'BlockchainCovid';

    const pathNetworks = '/home/raiane/Documentos/estudos-blockchain/mestrado-backup-11042020/blockflow1.0/networks/'+nameNetworks;
 
    shell.cd(pathNetworks);
         
 
    hfc.setConfigSetting('network-connection-profile-path',path.join( pathNetworks ,'/network-config.yaml'));
    hfc.setConfigSetting(orgName+'-connection-profile-path',path.join( pathNetworks, '/'+orgName+'.yaml'));


      var hasInputPortId = hasInputPort.hasInputPortId
      var portId = hasInputPort.portId
      var programID = hasInputPort.programID
      var programName = hasInputPort.programName
      var inputPortValue = hasInputPort.inputPortValue
    
      
      console.log(hasInputPortId, portId, programID, programName, inputPortValue)
      var args = [hasInputPortId, portId,  programID, programName, inputPortValue];
      
      blockflow.invokeChaincode(peerNames, channelName, chaincodeName, fcn, args, userName, orgName);
      //blockflow.add_hasInputPort(req, res, hasInputPort);
    
  
   },

   async add_usage(req, res, usage){

    const channelName = "mychannel";
    const peerNames = ["peer0.UFJF.com"];
    const userName = 'raiane'; 
    const orgName = 'UFJF'; 
    const chaincodeName =  "blockflow-chaincode";    
    const fcn = 'recordUsage';
   
    const nameNetworks = 'BlockchainCovid';

    const pathNetworks = '/home/raiane/Documentos/estudos-blockchain/mestrado-backup-11042020/blockflow1.0/networks/'+nameNetworks;
 
    shell.cd(pathNetworks);
         
 
    hfc.setConfigSetting('network-connection-profile-path',path.join( pathNetworks ,'/network-config.yaml'));
    hfc.setConfigSetting(orgName+'-connection-profile-path',path.join( pathNetworks, '/'+orgName+'.yaml'));
      
      var hadInputPort = usage.hadInputPort
      var hadEntity = usage.hadEntity
      var idUsage = usage.idUsage
      
      console.log(hadInputPort, hadEntity, idUsage)
      var args = [hadInputPort, hadEntity, idUsage ];
       
      blockflow.invokeChaincode(peerNames, channelName, chaincodeName, fcn, args, userName, orgName);
      
      //blockflow.add_usage(req, res, usage);
    
  
  },


   async add_qualifiedUsage(req, res, qualifiedUsage ){


    const channelName = "mychannel";
    const peerNames = ["peer0.UFJF.com"];
    const userName = 'raiane'; 
    const orgName = 'UFJF'; 
    const chaincodeName =  "blockflow-chaincode";        
    const fcn = 'recordQualifiedUsage';
   
    const nameNetworks = 'BlockchainCovid';

    const pathNetworks = '/home/raiane/Documentos/estudos-blockchain/mestrado-backup-11042020/blockflow1.0/networks/'+nameNetworks;
 
    shell.cd(pathNetworks);
         
 
    hfc.setConfigSetting('network-connection-profile-path',path.join( pathNetworks ,'/network-config.yaml'));
    hfc.setConfigSetting(orgName+'-connection-profile-path',path.join( pathNetworks, '/'+orgName+'.yaml'));

      var programExecution = qualifiedUsage.programExecution
      var idProgramExecution = qualifiedUsage.idProgramExecution
      var usageId = qualifiedUsage.usageId
      var idQualifiedUsage = qualifiedUsage.idQualifiedUsage
      var entityValue = qualifiedUsage.entityValue
     
      var args = [programExecution, idProgramExecution, usageId, idQualifiedUsage, entityValue]
     
      
      blockflow.invokeChaincode(peerNames, channelName, chaincodeName, fcn, args, userName, orgName);
      //blockflow.add_qualifiedUsage(req, res, qualifiedUsage);
    
  
   },

   async add_generation(req, res, generation){

    const channelName = "mychannel";
    const peerNames = ["peer0.UFJF.com"];
    const userName = 'raiane'; 
    const orgName = 'UFJF'; 
    const chaincodeName =  "blockflow-chaincode";         
    const fcn = 'recordGeneration';
    
    const nameNetworks = 'BlockchainCovid';

    const pathNetworks = '/home/raiane/Documentos/estudos-blockchain/mestrado-backup-11042020/blockflow1.0/networks/'+nameNetworks;
 
    shell.cd(pathNetworks);
         
 
    hfc.setConfigSetting('network-connection-profile-path',path.join( pathNetworks ,'/network-config.yaml'));
    hfc.setConfigSetting(orgName+'-connection-profile-path',path.join( pathNetworks, '/'+orgName+'.yaml'));

    var idGeneration = generation.idGeneration
    var hadOutputPort =generation.hadOutputPort
    var hadEntity = generation.hadEntity
     
    var args = [idGeneration, hadOutputPort, hadEntity]
      
      
    blockflow.invokeChaincode(peerNames, channelName, chaincodeName, fcn, args, userName, orgName);
      
      //blockflow.add_generation(req, res, generation);
    
  
   }, 


   async add_qualifiedGeneration(req, res, qualifiedGeneration){

    const channelName = "mychannel";
    const peerNames = ["peer0.UFJF.com"];
    const userName = 'raiane'; 
    const orgName = 'UFJF'; 
    const chaincodeName =  "blockflow-chaincode";          
    const fcn = 'recordQualifiedGeneration';
   
    const nameNetworks = 'BlockchainCovid';

    const pathNetworks = '/home/raiane/Documentos/estudos-blockchain/mestrado-backup-11042020/blockflow1.0/networks/'+nameNetworks;
 
    shell.cd(pathNetworks);
         
 
    hfc.setConfigSetting('network-connection-profile-path',path.join( pathNetworks ,'/network-config.yaml'));
    hfc.setConfigSetting(orgName+'-connection-profile-path',path.join( pathNetworks, '/'+orgName+'.yaml'));
    
      var idQualifiedGeneration = qualifiedGeneration.idQualifiedGeneration
      var programExecution = qualifiedGeneration.programExecution
      var programExecutionId = qualifiedGeneration.programExecutionId
      var generationId = qualifiedGeneration.generationId
      var entityValue = qualifiedGeneration.entityValue
     
      var args = [idQualifiedGeneration, programExecution, programExecutionId, generationId, entityValue]

      blockflow.invokeChaincode(peerNames, channelName, chaincodeName, fcn, args, userName, orgName);
      

      //blockflow.add_qualifiedGeneration(req, res, qualifiedGeneration);
    
  
   },

   async add_used(req, res, used){

    const channelName = "mychannel";
    const peerNames = ["peer0.UFJF.com"];
    const userName = 'raiane'; 
    const orgName = 'UFJF'; 
    const chaincodeName =  "blockflow-chaincode";        
    const fcn = 'recordUsed';
   
    const nameNetworks = 'BlockchainCovid';

    const pathNetworks = '/home/raiane/Documentos/estudos-blockchain/mestrado-backup-11042020/blockflow1.0/networks/'+nameNetworks;
 
    shell.cd(pathNetworks);
         
 
    hfc.setConfigSetting('network-connection-profile-path',path.join( pathNetworks ,'/network-config.yaml'));
    hfc.setConfigSetting(orgName+'-connection-profile-path',path.join( pathNetworks, '/'+orgName+'.yaml'));
    
      var idUsed = used.idUsed
      var programExecutionId = used.programExecutionId
      var programExecutionName = used.programExecutionName
      var idEntity = used.idEntity
      var entityValue = used.entityValue
     
      var args = [idUsed, programExecutionId, programExecutionName, idEntity, entityValue]

      blockflow.invokeChaincode(peerNames, channelName, chaincodeName, fcn, args, userName, orgName);

   },

   async add_wasGeneratedBy(req, res, wasGeneratedBy){

    const channelName = "mychannel";
    const peerNames = ["peer0.UFJF.com"];
    const userName = 'raiane'; 
    const orgName = 'UFJF'; 
    const chaincodeName =  "blockflow-chaincode";         
    const fcn = 'recordWasGeneratedBy';
   
    const nameNetworks = 'BlockchainCovid';

    const pathNetworks = '/home/raiane/Documentos/estudos-blockchain/mestrado-backup-11042020/blockflow1.0/networks/'+nameNetworks;
 
    shell.cd(pathNetworks);
         
 
    hfc.setConfigSetting('network-connection-profile-path',path.join( pathNetworks ,'/network-config.yaml'));
    hfc.setConfigSetting(orgName+'-connection-profile-path',path.join( pathNetworks, '/'+orgName+'.yaml'));
    
      var idWasGeneratedBy = used.idWasGeneratedBy
      var programExecutionId = used.programExecutionId
      var programExecutionName = used.programExecutionName
      var idEntity = used.idEntity
      var entityValue = used.entityValue
     
      var args = [idWasGeneratedBy, programExecutionId, programExecutionName, idEntity, entityValue]

      blockflow.invokeChaincode(peerNames, channelName, chaincodeName, fcn, args, userName, orgName);

   }




   


   








   



   


   


   
 


  /*app.post('/add_program', urlencodedParser, function(req, res){

    console.log(req.body)
     console.log('ID:' + req.body.id + 'Name program'+ req.body.nameprogram+ 'Created:'+req.body.created )
   
    
  });*/

 

 /* app.get('/get_tuna/:id', function(req, res){
    tuna.get_tuna(req, res);
  });
  app.get('/get_all_tuna', function(req, res){
    tuna.get_all_tuna(req, res);
  });
  app.get('/change_holder/:holder', function(req, res){
    tuna.change_holder(req, res);
  });*/
}
