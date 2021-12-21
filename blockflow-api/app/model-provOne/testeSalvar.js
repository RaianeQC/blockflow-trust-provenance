const Program = require('./programModel')

var uuidv4 = require('uuid/v4'); 

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

const helper = require('../blockchain-controller/helperDesempenho.js');
//const logger = helper.getLogger('invoke-chaincode');

const util = require('util');

async function add  () {
     
       var inicio =  new Date().getMilliseconds()
       var inicio2 =  Date.now()
       var inicio3 =  new Date()
       var hrstart = process.hrtime()
       console.log("Milli: " + inicio)
       console.log("Date now" +  inicio2 )
       console.log("Date new" +  inicio3 )
        for(var i =0; i < 10; i++){
            await Program.create({     
                idProgram: uuidv4(), 
                nameProgram: "getUser", 
                created:new Date().toISOString(),
                hasOutPort:uuidv4(),
                hasInPort: uuidv4()      
             });
        }
        var latencia = new Date().getMilliseconds() - inicio
        var latencia2 = Date.now() - inicio2
        var latencia3 = new Date() - inicio2
        hrend = process.hrtime(hrstart)
       
        console.log("Latencia Milli: "+ latencia + "s" )
        console.log("Latencia Date now: "+ latencia2 + "s" )
        console.log("Latencia New date: "+ latencia3 + "s" )
        console.info('Execution time (hr): %ds %dms', hrend[0], hrend[1] / 1000000)

}

async function add_program() {

    /*console.log(program);
   
   var json =  JSON.stringify(program)*/

   //console.log("Verificar aqui"+json);

   //var obj = JSON.parse(json);

   const channelName = "mychannel";
   const peerNames = ["peer0.ORG1.com"];
   const userName = 'Alice'; 
   const orgName = 'ORG1'; 
   const chaincodeName =  "blockflow-chaincode";        
   const fcn = 'recordProgram';
   const nameNetworks = 'ExperimentationWithBlockchain';

   const pathNetworks = '/home/raiane/Documentos/estudos-blockchain/mestrado-backup-171019/blockflow1.0/networks/'+nameNetworks;

   shell.cd(pathNetworks);
        

   hfc.setConfigSetting('network-connection-profile-path',path.join( pathNetworks ,'/network-config.yaml'));
   hfc.setConfigSetting(orgName+'-connection-profile-path',path.join( pathNetworks, '/'+orgName+'.yaml'));
  

   
 
    
   let error_message = null;
   let tx_id_string = null;
   let client = null;
   let channel = null;


   var hrstart = process.hrtime()
      for(var i =0; i < 1000; i++){
       var program = {     
            idProgram: uuidv4(), 
            nameProgram: "getUserNow", 
            created:  Date.now().toString,
            hasOutPort:uuidv4(),
            hasInPort: uuidv4()      
         };
         
          var idProgram = program.idProgram
          var nameProgram = program.nameProgram     
          var created =  program.created
          var hasOutPort =  program.hasOutPort
          var hasInPort = program.hasInPort
    
         var args = [idProgram, nameProgram, created, hasOutPort, hasInPort];


         let error_message = null;
         let tx_id_string = null;
         let client = null;
         let channel = null;
         
             // first setup the client for this org
             client = await helper.getClientForOrg(orgName, userName);
             //logger.debug('Successfully got the fabric client for the organization "%s"', orgName);
             channel = client.getChannel(channelName);
            
             const tx_id = client.newTransactionID();
             // will need the transaction ID string for the event registration later
             tx_id_string = tx_id.getTransactionID();
     
             // send proposal to endorser
             const request = {
                 targets: peerNames,
                 chaincodeId: chaincodeName,
                 fcn: fcn,
                 args: args,
                 chainId: channelName,
                 txId: tx_id
             };
             
             let results = await channel.sendTransactionProposal(request);
     
             // the returned object has both the endorsement results
             // and the actual proposal, the proposal will be needed
             // later when we send a transaction to the orderer
             const proposalResponses = results[0];
             const proposal = results[1];

             const orderer_request = {
                txId: tx_id,
                proposalResponses: proposalResponses,
                proposal: proposal
            };
            const sendPromise = channel.sendTransaction(orderer_request);

            var hrend = process.hrtime(hrstart)
            console.info('Execution time (hr): %ds %dms', hrend[0], hrend[1] / 1000000)

        }
      
     
             // look at the responses to see if they are all are good
             // response will also include signatures required to be committed
             /*let all_good = true;
             for (const i in proposalResponses) {
                 if (proposalResponses[i] instanceof Error) {
                     all_good = false;
                     error_message = util.format('invoke chaincode proposal resulted in an error :: %s', proposalResponses[i].toString());
                     logger.error(error_message);
                 } else if (proposalResponses[i].response && proposalResponses[i].response.status === 200) {
                     logger.info('invoke chaincode proposal was good');
                 } else {
                     all_good = false;
                     error_message = util.format('invoke chaincode proposal failed for an unknown reason %j', proposalResponses[i]);
                     logger.error(error_message);
                 }
             }
     
             if (all_good) {
                 logger.info(util.format(
                     'Successfully sent Proposal and received ProposalResponse: Status - %s, message - "%s", metadata - "%s", endorsement signature: %s',
                     proposalResponses[0].response.status, proposalResponses[0].response.message,
                     proposalResponses[0].response.payload, proposalResponses[0].endorsement.signature));
     
                 // wait for the channel-based event hub to tell us
                 // that the commit was good or bad on each peer in our organization
                 const promises = [];
                 let event_hubs = channel.getChannelEventHubsForOrg();
                 event_hubs.forEach((eh) => {
                     logger.debug('invokeEventPromise - setting up event');
                     let invokeEventPromise = new Promise((resolve, reject) => {
                         let event_timeout = setTimeout(() => {
                             let message = 'REQUEST_TIMEOUT:' + eh.getPeerAddr();
                             logger.error(message);
                             eh.disconnect();
                         }, 3000);
                         eh.registerTxEvent(tx_id_string, (tx, code, block_num) => {
                             logger.info('The chaincode invoke chaincode transaction has been committed on peer %s',eh.getPeerAddr());
                             logger.info('Transaction %s has status of %s in blocl %s', tx, code, block_num);
                          
                             clearTimeout(event_timeout);
     
                             if (code !== 'VALID') {
                                 let message = util.format('The invoke chaincode transaction was invalid, code:%s',code);
                                 logger.error(message);
                                 reject(new Error(message));
                             } else {
                                 let message = 'The invoke chaincode transaction was valid.';
                                 logger.info(message);
                                 resolve(message);
                             }
                         }, (err) => {
                             clearTimeout(event_timeout);
                             logger.error(err);
                             reject(err);
                         },
                             // the default for 'unregister' is true for transaction listeners
                             // so no real need to set here, however for 'disconnect'
                             // the default is false as most event hubs are long running
                             // in this use case we are using it only once
                             {unregister: true, disconnect: true}
                         );
                         eh.connect();
                     });
                     promises.push(invokeEventPromise);
                 });*/
     
              
                 // put the send to the orderer last so that the events get registered and
                 // are ready for the orderering and committing
                /* promises.push(sendPromise);
                 let results = await Promise.all(promises);
                 logger.debug(util.format('------->>> R E S P O N S E : %j', results));
                 let response = results.pop(); //  orderer results are last in the results
                 if (response.status === 'SUCCESS') {
                     logger.info('Successfully sent transaction to the orderer.');
                 } else {
                     error_message = util.format('Failed to order the transaction. Error code: %s',response.status);
                     logger.debug(error_message);
                 }
     
                 // now see what each of the event hubs reported
                 for(let i in results) {
                     let event_hub_result = results[i];
                     let event_hub = event_hubs[i];
                     logger.debug('Event results for event hub :%s',event_hub.getPeerAddr());
                     if(typeof event_hub_result === 'string') {
                         logger.debug(event_hub_result);
                     } else {
                         if(!error_message) error_message = event_hub_result.toString();
                         logger.debug(event_hub_result.toString());
                     }
                 }
             }
         } catch (error) {
             logger.error('Failed to invoke due to error: ' + error.stack ? error.stack : error);
             error_message = error.toString();
         } finally {
             if (channel) {
                 channel.close();
             }
         }
     
         let success = true;
         let message = util.format(
             'Successfully invoked the chaincode %s to the channel \'%s\' for transaction ID: %s',
             orgName, channelName, tx_id_string);
         if (error_message) {
             message = util.format('Failed to invoke chaincode. cause:%s',error_message);
             success = false;
             logger.error(message);
         } else {
             logger.info(message);
         }*/
   
       
        
    
       
    

    
    var hrend = process.hrtime(hrstart)
	console.info('Execution time (hr): %ds %dms', hrend[0], hrend[1] / 1000000)

  

     
  }


  add_program ();

