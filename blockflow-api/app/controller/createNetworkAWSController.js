const path = require('path');
const fs = require('fs');
const fsex = require('fs-extra');
const shell = require('shelljs');
const zip  = require('zip-a-folder');
const Network = require('../model/networkModel');
const Organization = require('../model/organizationModel');
const OrganizationChannel = require('../model/organizationChannelModel');
const Peer = require('../model/peerModel')
const Channel = require('../model/channelModel');
const User = require('../model/userModel');
const CA = require('../model/caModel');
const Orderer = require('../model/ordererModel');
const Client = require('ssh2').Client;
const Conn = new Client();



module.exports = {

    async createAndSaveNetwork(req, res){
        //Params get
        const {nameNetworkExperiment, description, organizationName, numPeer, organizationsChannel, channelName} = req.body;
        
        //template crypto declared 
        const templatecrypto = path.join(process.cwd(), 'template/crypto');
        const peerFileCrypto = path.resolve(__dirname, templatecrypto, 'peer-cryptogen.yaml');
        const cryptogenFile = path.resolve(__dirname, templatecrypto, 'cryptogen.yaml');

        //template configtx declared 
        const templateconfigtx = path.join(process.cwd(), 'template/configtx');
        const ordererpeerFile = path.resolve(__dirname, templateconfigtx, 'ordererpeer-configtx-base.yaml');
        const peerFile = path.resolve(__dirname, templateconfigtx, 'peer-configtx-base.yaml');       
        const applicationFile = path.resolve(__dirname, templateconfigtx, 'aplication-configtx-base.yaml');
        const ordererFile = path.resolve(__dirname, templateconfigtx, 'orderer-configtx-base.yaml');
        const ordererGenesisFile = path.resolve(__dirname, templateconfigtx, 'orderegenesis-configtx-base.yaml');
        const channelFile = path.resolve(__dirname, templateconfigtx, 'channel-configtx-base.yaml');
        const configtxtemplate = path.resolve(__dirname, templateconfigtx, 'configtx.yaml');
        let organizationInChannelFormated = [];
        const networks = path.join(process.cwd(), 'networks');
        const pathNetworks = networks+"/"+nameNetworkExperiment;
        const bin =  networks+"/bin/"; 

        
         //template compose declared 
        const templateCompose = path.join(process.cwd(), 'template/baseaws');
        const peerFileCompose = path.resolve(__dirname, templateCompose, 'docker-compose-peer.yaml');
        const baseFile = path.resolve(__dirname, templateCompose, 'base.yaml' )
        const couchDBFile = path.resolve(__dirname, templateCompose, 'docker-compose-couchdb.yaml');
        const caFile = path.resolve(__dirname, templateCompose, 'docker-compose-ca.yaml');
        const ordererFileCompose = path.resolve(__dirname, templateCompose,   'docker-compose-orderer.yaml');
        let portnumber = 7051;
        let portnumber2 = 7051;
        let portpeer2  = 7080;
        let portorderer = 7050;
        let couchdbnumber = 0;
        let portnumbercouch = 5984;
        let portca = 9054;
        let networkname = nameNetworkExperiment;
        let ordererPeer = [];
        let ordererca = [];

         //template networkconfigcloud
         const templateNetworkConfig = path.join(process.cwd(), 'template/networkconfigcloud');
         const networkConfigBaseFile =  path.resolve(__dirname, templateNetworkConfig, 'network-config.yaml');
         const networkConfigChannelFile = path.resolve(__dirname, templateNetworkConfig, 'channel.yaml');
         const networkConfigPeerChannelFile = path.resolve(__dirname, templateNetworkConfig, 'peerchannel.yaml');
         const networkConfigChaincodeFile = path.resolve(__dirname, templateNetworkConfig, 'chaincode.yaml');
         const networkConfigOrgMSPFile = path.resolve(__dirname, templateNetworkConfig, 'organizationsOrgMSP.yaml');
         const networkConfigOrganizationCAFile = path.resolve(__dirname, templateNetworkConfig, 'organizationsCA.yaml');
         const networkConfigOrdererFile = path.resolve(__dirname, templateNetworkConfig, 'orderers.yaml');
         const networkConfigPeerFile = path.resolve(__dirname, templateNetworkConfig, 'peer.yaml');
         const netConfigCertificateAuthoritiesFile = path.resolve(__dirname, templateNetworkConfig, 'certificateAuthorities.yaml');
         const networkConfigCaFile = path.resolve(__dirname, templateNetworkConfig, 'ca.yaml');
         const networkConfigOrg = path.resolve(__dirname, templateNetworkConfig, 'org.yaml');
         let portnumberConfig = 7051;
         let peerOrganizations = [];
         let portcaNetworkConfig = 9054;


        //chaincode-smartcontract
        const chaincodetemplatepath = path.join(process.cwd(), 'template/chaincode/');
        const chaincodesmartcontract =  path.resolve(__dirname, chaincodetemplatepath, 'blockflow-app');
        const chaincodesmartcontractgo =  path.resolve(__dirname, chaincodetemplatepath, 'blockflow-chaincode.go');

        const readFilePromise = (file) => {
            return new Promise((resolve, reject) => {
                fs.readFile(file, (err, data) =>{
                    if(err) return reject('Promise Reject')
                    resolve(data)
                })
            });
        }; 

        const copyFilePromise = (file, destination) =>{
            return new Promise((resolve, reject) =>{
                fs.copyFile(file, destination, (err) => {
                     if (err) reject('Promise Reject');
                     resolve('Promise success')
                });
            })
        }
    
        const appendFilePromise = (file, contents) => {
            return new Promise((resolve, reject) => {
                fs.appendFile(file, contents, (err) =>{
                    if(err) return reject('Promise Reject')
                    resolve('Success')
                });
            });
        };  


        const writeFilePromise = (file, contents) => {
            return new Promise((resolve, reject) => {
                fs.writeFile(file, contents, (err) =>{
                    if(err) return reject('Promise Reject')
                    resolve('Success')
                });
            });
        }; 
        
        
        const readDirPromise = (path) => {
            return new Promise((resolve, reject) => {
                fs.readdir(path, function(err, items) {
                    var skca;
                    for (var i=0; i<items.length; i++) {
                        var file =  items[i];
                        
                        if(file.includes("sk")){                           

                            resolve(file);
                        }
                                     
                    }
                   
                });
              
            });
        }; 


        const replacePromise = (constents, stringreplace, value) => {
            return new Promise((resolve, reject) => {                     
                if(stringreplace == 'orgname'){
                    var newvalue =  String(constents).replace(/orgname/g, value);
                    resolve(newvalue);
                }else if(stringreplace == 'countpeer'){
                    var newvalue =  String(constents).replace(/countpeer/g, value);
                    resolve(newvalue);
                }else if(stringreplace == 'OrganizationsOrgs'){
                    console.log(value);
                    var newvalue =  String(constents).replace(/OrganizationsOrgs/g, value);
                    resolve(newvalue);
                }else if(stringreplace == 'Channelname'){
                    var newvalue =  String(constents).replace(/Channelname/g, value);
                    resolve(newvalue);
                }else      if(stringreplace == 'peernumber'){
                    var newvalue =  String(constents).replace(/peernumber/g, 'peer'+value);
                    resolve(newvalue);
                }else if(stringreplace == 'orgname'){
                    var newvalue =  String(constents).replace(/orgname/g, value);
                    resolve(newvalue);
                }else if(stringreplace == 'portnumber'){
                    var newvalue =  String(constents).replace(/portnumber/g, value);
                    resolve(newvalue);

                }else if(stringreplace == 'couchdbname'){
                    var newvalue =  String(constents).replace(/couchdbname/g, 'couchdb'+value);
                    resolve(newvalue);

                }else if(stringreplace == 'portcouch'){
                    var newvalue =  String(constents).replace(/portcouch/g, value);
                    resolve(newvalue);

                }else if(stringreplace == 'networkname'){
                    var newvalue =  String(constents).replace(/networkname/g, value);
                    resolve(newvalue);

                }else if(stringreplace == 'portca'){
                    var newvalue =  String(constents).replace(/portca/g, value);
                    resolve(newvalue);

                }else if(stringreplace == 'portpeer2'){
                    var newvalue =  String(constents).replace(/portpeer2/g, value);
                    resolve(newvalue);

                }else if(stringreplace == 'portpeer'){
                    var newvalue =  String(constents).replace(/portpeer/g, value);
                    resolve(newvalue);

                }else if(stringreplace == 'portorderer'){
                    var newvalue =  String(constents).replace(/portorderer/g, value);
                    resolve(newvalue);

                }else if(stringreplace == 'ordererpeer'){
                    var newvalue =  String(constents).replace(/ordererpeer/g, value);
                    resolve(newvalue);

                }else if(stringreplace == 'keyorg'){
                    var newvalue =  String(constents).replace(/keyorg/g, value);
                    resolve(newvalue);

                }else if(stringreplace == 'description'){
                    var newvalue =  String(constents).replace(/description/g, value);
                    resolve(newvalue);

                }else if(stringreplace == 'peersOrgs'){
                    var newvalue =  String(constents).replace(/peersOrgs/g, value);
                    resolve(newvalue);

                }else if(stringreplace == 'ordererca'){
                    var newvalue =  String(constents).replace(/ordererca/g, value);
                    resolve(newvalue);

                }                
            });
        }
        
        
       
        fs.stat(pathNetworks, async function(err, stats){
            if(err){
                await fs.mkdir(pathNetworks.trim());
                await fs.mkdir(pathNetworks+"/crypto-config"); 
               
                await fs.mkdir(pathNetworks+"/channel-artifacts");  
                await fsex.ensureDir(pathNetworks+"/src/github.com/chaincode");
                const chaincodepathNetwork = path.resolve(__dirname, pathNetworks+'/src/github.com/chaincode');
              
                await fsex.copy(chaincodesmartcontract, chaincodepathNetwork+"/blockflow-app");
                await fsex.copy(chaincodesmartcontractgo, chaincodepathNetwork+"/blockflow-chaincode.go");

                
                await fs.copyFileSync(cryptogenFile, pathNetworks+"/crypto-config.yaml");
                
                
                const cryptoFile = path.resolve(__dirname, pathNetworks, 'crypto-config.yaml');
                await fs.copyFileSync(configtxtemplate, pathNetworks+"/configtx.yaml");
                
                const configtx = path.resolve(__dirname, pathNetworks+"/configtx.yaml");

                await fs.copyFileSync(baseFile, pathNetworks+"/base.yaml");   
                const basePeerFilePath = path.resolve(__dirname, pathNetworks+"/base.yaml");
                const constentsBasePeerContents = await readFilePromise(basePeerFilePath);
                const constentsBasePeerContents2 =  await Promise.resolve(replacePromise(constentsBasePeerContents,"networkname",networkname.toLowerCase()));              
                await Promise.resolve(writeFilePromise(basePeerFilePath, constentsBasePeerContents2));             

                              

                const ordererPeerContents = await readFilePromise(ordererpeerFile);                           
                await Promise.resolve(appendFilePromise(configtx, ordererPeerContents));


                //Network Config 
                await fs.copyFileSync(networkConfigBaseFile, pathNetworks+"/network-config.yaml");
                const networkConfigFile = path.resolve(__dirname, pathNetworks+"/network-config.yaml");
                const constentsnetworkConfig = await readFilePromise(networkConfigFile);
                const networkConfigNetwork =  await Promise.resolve(replacePromise(constentsnetworkConfig,"networkname",networkname.toLowerCase()));
                const networkConfigDescription =  await Promise.resolve(replacePromise(networkConfigNetwork,"description",description));
                await Promise.resolve(writeFilePromise(networkConfigFile, networkConfigDescription));
                const constentschannelnetwork = await readFilePromise(networkConfigChannelFile);
                const constentschannelreplace =  await Promise.resolve(replacePromise(constentschannelnetwork,"Channelname",channelName.toLowerCase()));
                await Promise.resolve(appendFilePromise(networkConfigFile, constentschannelreplace));


                const network = await Network.create({
                    networkname: nameNetworkExperiment,
                    description: description,
                    dirnetwork: pathNetworks,
                    type: 'CloudAWS'

                });

                await Promise.all(organizationName.map(async (organizationvalue, index)=>{                
                   
                    const organization = new Organization({
                            organizationName : organizationvalue,
                            numPeer: numPeer[index],
                            network: network._id
                    });
  
                    await organization.save();

                    network.organizations.push(organization);  
                    
                    const ca = new CA({
                        caname: 'ca.'+organizationvalue+".com",
                        organization: organization._id,
                        network: network._id,
                        composeFileName: "docker-compose-ca-"+organizationvalue+".yaml",
                        configured: false,
                        running: false,
                     });

                     await ca.save();

                    const peerasync  = async _ => { 

                        var peerCont = numPeer[index];
    
                        for(var i = 0; i<peerCont; i++){

                            const peer = new Peer({
                                peername: 'peer'+i+'.'+organizationvalue+'.com',
                                organization: organization._id,
                                network: network._id,
                                composeFileName: "docker-compose-peer"+i+"-"+organizationvalue+".yaml",
                                configured: false,
                                running: false,                           
                            })

                            await peer.save()

                            organization.peer.push(peer)

                        }                      
                    }

                    peerasync();                
                
                }));

                const channel = await Channel.create({
                    channelName: channelName,
                    channelConfigPath: '/channel-artifacts/'+channelName.toLowerCase()+'.tx',
                    network: network._id,
                    
                });
                
                network.channels = channel._id;

                await network.save();

                await Promise.all(organizationsChannel.map(async (organizationchannel, index)=>{
                    const organizationChannel = new OrganizationChannel({
                        organizationName : organizationchannel,
                        channel: channel._id                  

                    });

                    await organizationChannel.save();

                    channel.organizations.push(organizationChannel);
                }));


                const orderer = await Orderer.create({
                    orderername: 'orderer.example.com',
                    network: network._id,
                    composeFileName: "docker-compose-orderer.yaml",
                    configured: false,
                    running: false,

                })


                //Crypto File Create and Generate Keys and Certificate
                const initt = async _ =>{

                    for(let index = 0; index<organizationName.length;  index++){
                        const nameorganization = organizationName[index];               
                        const peers = numPeer[index];              

                        const constentsPeerContents = await readFilePromise(peerFileCrypto);
                        const newValue =  await Promise.resolve(replacePromise(constentsPeerContents,"orgname",nameorganization));
                        const newValue2 =  await Promise.resolve(replacePromise(newValue,"countpeer",peers));              
                        
                        await Promise.resolve(appendFilePromise(cryptoFile, newValue2));                    
                    }

                    shell.exec(bin +'cryptogen generate --config='+pathNetworks+'/crypto-config.yaml --output='+pathNetworks+'/crypto-config');

                    
                };

                initt();

                //ConfigTX
                const init = async _ =>{
                    let valorPortSet = 0;

                    for(let index = 0; index<organizationName.length;  index++){

                        const nameorganization = organizationName[index];
                        const peers = numPeer[index];
                                           
          
                        const constentsPeerContents = await readFilePromise(peerFile);
                        const newValue =  await Promise.resolve(replacePromise(constentsPeerContents,"orgname",nameorganization));                          
                        
                       
                        for(let index2 = 0; index2<peers; index2++){
                            portnumber2++;
                            if(index2 == 0){
                                valorPortSet = portnumber2;
                            }
                        }

                        const newValueportpeer =  await Promise.resolve(replacePromise(newValue,"portpeer",valorPortSet));
                        
                        await Promise.resolve(appendFilePromise(configtx, newValueportpeer));

                      
                    }

                    const constentsApplicationContents = await readFilePromise(applicationFile);
                    await Promise.resolve(appendFilePromise(configtx, constentsApplicationContents));
            
                    const constentsOrdererContents = await readFilePromise(ordererFile);
                    let portorderer1 = portorderer;
                    const newconstentsOrdererContents =  await Promise.resolve(replacePromise(constentsOrdererContents,"portorderer",portorderer1++));              
                    await Promise.resolve(appendFilePromise(configtx, newconstentsOrdererContents));


                    for(let index = 0; index<organizationsChannel.length;  index++){

                            organizationInChannelFormated.push('                -  *'+organizationsChannel[index]+'\n');        

                    }

                
                    const constentsOrderergenesisContents = await readFilePromise(ordererGenesisFile); 
                    let org = String(organizationInChannelFormated);
                    const newValue2 =  await Promise.resolve(replacePromise(constentsOrderergenesisContents,"OrganizationsOrgs",org.replace(/\'/g,'' ).replace(/\'/g, '').replace(/\,/g, '')));                 
                    await Promise.resolve(appendFilePromise(configtx, newValue2));


                    const constentsChannel = await readFilePromise(channelFile); 
                    const newValue3 =  await Promise.resolve(replacePromise(constentsChannel,"Channelname",channelName));      
                    const newValue4 =  await Promise.resolve(replacePromise(newValue3,"OrganizationsOrgs",org.replace(/\'/g,' ' ).replace(/\'/g, '').replace(/\,/g, ''))); 
                    
                    await Promise.resolve(appendFilePromise(configtx, newValue4));

                };

                init();

                //docker-compose.yaml
                const inittt = async _ =>{

                    for(let index = 0; index<organizationName.length; index++){
                        const nameorganization = organizationName[index];
                        
                        const peers = numPeer[index];
                             
                        
                        
                        
                        for(let index2 = 0; index2<peers; index2++){
                            
                            await copyFilePromise(peerFileCompose, pathNetworks+"/docker-compose-peer"+index2+"-"+nameorganization+".yaml"); 
                            await fsex.ensureDir(pathNetworks+"/peer"+index2+"."+nameorganization+".com");

                            
                        
                        }   

                        await copyFilePromise(caFile, pathNetworks+"/docker-compose-ca-"+nameorganization+".yaml");
                        await fsex.ensureDir(pathNetworks+"/ca."+nameorganization+".com"); 
                    
                    }

                        for(let index = 0; index<organizationName.length; index++){
                        const nameorganization = organizationName[index];
                        
                        const peers = numPeer[index];
                                          
                        
                        for(let index2 = 0; index2<peers; index2++){

                                        
                            var basePeerComposeFilePath = path.resolve(__dirname, pathNetworks+"/docker-compose-peer"+index2+"-"+nameorganization+".yaml");
                            
                            const constents = await readFilePromise(basePeerComposeFilePath);
                           
                            const newValue =  await Promise.resolve(replacePromise(constents,"peernumber",index2));
                            const newValue2 =  await Promise.resolve(replacePromise(newValue,"orgname",nameorganization));
                            const newValue3 =  await Promise.resolve(replacePromise(newValue2,"portnumber",portnumber));
                            const newValue4 =  await Promise.resolve(replacePromise(newValue3,"couchdbname",couchdbnumber));
                            const newValue5 =  await Promise.resolve(replacePromise(newValue4,"portcouch",portnumbercouch));
                            const newValue6 =  await Promise.resolve(replacePromise(newValue5,"networkname",networkname.toLowerCase()));
                            const newValueport2 =  await Promise.resolve(replacePromise(newValue6,"portpeer2",portpeer2));
                            await Promise.resolve(writeFilePromise(basePeerComposeFilePath, newValueport2));             
                           
                            const contentscouch = await readFilePromise(couchDBFile);                        
                            const newValue7 =  await Promise.resolve(replacePromise(contentscouch,"couchdbname",couchdbnumber));
                            const newValue8 =  await Promise.resolve(replacePromise(newValue7,"portcouch",portnumbercouch)) 
                            const newValue9 =  await Promise.resolve(replacePromise(newValue8,"networkname",networkname.toLowerCase()));                     
                            await Promise.resolve(appendFilePromise(basePeerComposeFilePath, newValue9));

                            portnumber++;
                            portpeer2++;
                            couchdbnumber++;
                            portnumbercouch++;
                          
                    
                        }

                          
                        ordererPeer.push('          - ./crypto-config/peerOrganizations/'+nameorganization+'.com/peers/peer0.'+nameorganization+'.com/:/etc/hyperledger/crypto/peer'+nameorganization+'\n');
                        ordererca.push(' /etc/hyperledger/crypto/peer'+nameorganization+'/tls/ca.crt');
            

                        var caFileNetwork = path.resolve(__dirname, pathNetworks+"/docker-compose-ca-"+nameorganization+".yaml");
                        portca++;
                        const contentsca = await readFilePromise(caFileNetwork);                    
                        const newValueca =  await Promise.resolve(replacePromise(contentsca,"orgname",nameorganization));                        
                        const newValueca2 =  await Promise.resolve(replacePromise(newValueca,"portca",portca));
                        const newValueca3 =  await Promise.resolve(replacePromise(newValueca2,"networkname",networkname.toLowerCase()));
                        
                        const skvalue = await Promise.resolve(readDirPromise(pathNetworks+'/crypto-config/peerOrganizations/'+nameorganization+'.com/ca/'));
                        const newValueca4 =  await Promise.resolve(replacePromise(newValueca3,"keyorg",skvalue));  
                        await Promise.resolve(writeFilePromise(caFileNetwork, newValueca4));       
                        
                    }
    
                    
                    await copyFilePromise(ordererFileCompose, pathNetworks+"/docker-compose-orderer.yaml");
                    await fsex.ensureDir(pathNetworks+"/orderer.example.com"); 
                    var ordererCopyFile = path.resolve(__dirname, pathNetworks+"/docker-compose-orderer.yaml");
                    const contentsOrderer = await readFilePromise(ordererCopyFile); 
                    let portorderer1 = portorderer;
                    const newconstentsorderer =  await Promise.resolve(replacePromise(contentsOrderer,"portorderer",portorderer1++));                            
                    const ordererPeerString = String(ordererPeer);                    
                    const orderervalue =  await Promise.resolve(replacePromise(newconstentsorderer,"ordererpeer",ordererPeerString.replace(/\'/g,'' ).replace(/\'/g, '').replace(/\,/g, '')));                                     
                    const orderervalue2 =  await Promise.resolve(replacePromise(orderervalue,"networkname",networkname.toLowerCase()));
                    const orderercaString = String(ordererca); 
                    const orderervalue3 =  await Promise.resolve(replacePromise(orderervalue2,"ordererca",orderercaString.replace(/\'/g,'' ).replace(/\'/g, '')));                                      
                    await Promise.resolve(writeFilePromise(ordererCopyFile, orderervalue3));    
                   
                
                    shell.cd(pathNetworks);
                    shell.exec(bin +'configtxgen -profile OrdererGenesis -outputBlock ./channel-artifacts/genesis.block');
                    shell.exec(bin +'configtxgen -profile '+channelName+' -outputCreateChannelTx ./channel-artifacts/'+channelName.toLowerCase()+'.tx -channelID '+channelName.toLowerCase());

                    for(let index = 0; index<organizationName.length; index++){
                        const nameorganization = organizationName[index];
                        shell.exec(bin +'configtxgen -profile '+channelName+' -outputAnchorPeersUpdate ./channel-artifacts/'+nameorganization+'MSPanchors.tx -channelID '+channelName.toLowerCase()+' -asOrg '+nameorganization+'MSP');
                    }
                    
                };

                inittt();



                 //network-config.yaml
                 const networkConfig = async _ =>{

                        for(let index = 0; index<organizationName.length; index++){
                            const nameorganization = organizationName[index];                        
                            const peers = numPeer[index];                                         
                        
                            for(let index2 = 0; index2<peers; index2++){
                                const constentsPeerChannel = await readFilePromise(networkConfigPeerChannelFile);                    
                                          
                                const newValue =  await Promise.resolve(replacePromise(constentsPeerChannel,"peernumber",index2));
                                const newValue2 =  await Promise.resolve(replacePromise(newValue,"orgname",nameorganization));
                                await Promise.resolve(appendFilePromise(networkConfigFile, newValue2));


                            }

                        }

                        const constentsChaincode = await readFilePromise(networkConfigChaincodeFile);
                        await Promise.resolve(appendFilePromise(networkConfigFile, constentsChaincode));

                        
                        for(let index = 0; index<organizationName.length; index++){
                            const nameorganization = organizationName[index];                        
                            const peers = numPeer[index];
                            const constentsOrgMSP = await readFilePromise(networkConfigOrgMSPFile);
                            const replaceconstentsOrgMSP =  await Promise.resolve(replacePromise(constentsOrgMSP,"orgname",nameorganization));                                         
                        
                            for(let index2 = 0; index2<peers; index2++){
                                peerOrganizations.push("     - "+"peer"+index2+"."+nameorganization+".com \n")
                            }

                            const peerOrganizationsString = String(peerOrganizations);  
                            const replaceconstentsOrgMSPPeer =  await Promise.resolve(replacePromise(replaceconstentsOrgMSP,"peersOrgs",peerOrganizationsString.replace(/\'/g,'' ).replace(/\'/g, '').replace(/\,/g, '')));                                                    
                            await Promise.resolve(appendFilePromise(networkConfigFile, replaceconstentsOrgMSPPeer));
                            peerOrganizations = [];


                            const constentsOrgCA = await readFilePromise(networkConfigOrganizationCAFile);
                            const replaceconstentsOrgCA =  await Promise.resolve(replacePromise(constentsOrgCA,"orgname",nameorganization)); 
                            const replaceconstentsNetwork =  await Promise.resolve(replacePromise(replaceconstentsOrgCA,"networkname",nameNetworkExperiment));                            
                            const skvalue = await Promise.resolve(readDirPromise(pathNetworks+'/crypto-config/peerOrganizations/'+nameorganization+'.com/users/Admin@'+nameorganization+'.com/msp/keystore/'));
                            const replaceconstentssk =  await Promise.resolve(replacePromise(replaceconstentsNetwork,"keyorg",skvalue)); 
                            await Promise.resolve(appendFilePromise(networkConfigFile, replaceconstentssk));

                        }


                        const constentsOrderer = await readFilePromise(networkConfigOrdererFile);
                        let portorderer1 = portorderer;
                        const newcontentsOrderer =  await Promise.resolve(replacePromise(constentsOrderer,"portorderer",portorderer1++));
                        const newcontentsOrdererNetwork =  await Promise.resolve(replacePromise(newcontentsOrderer,"networkname",nameNetworkExperiment)); 
                        await Promise.resolve(appendFilePromise(networkConfigFile, newcontentsOrdererNetwork));


                        for(let index = 0; index<organizationName.length; index++){
                            const nameorganization = organizationName[index];                        
                            const peers = numPeer[index]; 
                        
                            for(let index2 = 0; index2<peers; index2++){

                               

                                const constentsNetConfigPeer = await readFilePromise(networkConfigPeerFile);
                                const replaceconstentsOrgPortPeer =  await Promise.resolve(replacePromise(constentsNetConfigPeer,"portpeer",portnumberConfig));
                                const replaceconstentsOrgPeer =  await Promise.resolve(replacePromise(replaceconstentsOrgPortPeer,"orgname",nameorganization));
                                const replaceconstentsOrgPeerNumber =  await Promise.resolve(replacePromise(replaceconstentsOrgPeer,"peernumber",index2));                                
                                const replaceconstentsOrgPeerNetwork =  await Promise.resolve(replacePromise(replaceconstentsOrgPeerNumber,"networkname",nameNetworkExperiment));                            
                                await Promise.resolve(appendFilePromise(networkConfigFile, replaceconstentsOrgPeerNetwork));

                                portnumberConfig++;
                            }   
                                
                        }


                        

                        const constentsCertificateAuthorities = await readFilePromise(netConfigCertificateAuthoritiesFile);
                        await Promise.resolve(appendFilePromise(networkConfigFile, constentsCertificateAuthorities));

                        for(let index = 0; index<organizationName.length; index++){
                            const nameorganization = organizationName[index];   
                            portcaNetworkConfig++;
                            const constentsNetConfigCa = await readFilePromise(networkConfigCaFile);
                            const replaceconstentsPortCa =  await Promise.resolve(replacePromise(constentsNetConfigCa,"portca",portcaNetworkConfig));
                            const replaceconstentsOrgCa =  await Promise.resolve(replacePromise(replaceconstentsPortCa,"orgname",nameorganization));
                            const replaceconstentsOrgCaNetwork =  await Promise.resolve(replacePromise(replaceconstentsOrgCa,"networkname",nameNetworkExperiment));  
                            await Promise.resolve(appendFilePromise(networkConfigFile, replaceconstentsOrgCaNetwork));
                        }


                        for(let index = 0; index<organizationName.length; index++){
                            const nameorganization = organizationName[index];
                            
                            await fs.copyFileSync(networkConfigOrg, pathNetworks+"/"+nameorganization+".yaml");
                            const orgnameFile = path.resolve(__dirname, pathNetworks+"/"+nameorganization+".yaml");
                            const constentsOrgname = await readFilePromise(orgnameFile);
                            const replaceconstentsOrg =  await Promise.resolve(replacePromise(constentsOrgname,"orgname",nameorganization));
                            const replaceconstentsOrgNetwork =  await Promise.resolve(replacePromise(replaceconstentsOrg,"networkname",nameNetworkExperiment));  
                            const networkConfigDescription =  await Promise.resolve(replacePromise(replaceconstentsOrgNetwork,"description",description));
                            await Promise.resolve(writeFilePromise(orgnameFile, networkConfigDescription));
                        }
                        
                        
                };

                networkConfig();          



               res.send(network);
                
            }else {
                console.log("Network Já exist")
            }

        })
    },

    async getDetails(req, res){

      const network = await Network.findById(req.params.id).populate('channels');

      return res.json(network);

    },
    
    async startNetwork(req, res){

        const pathNetworks = req.query.dir;

        const composeFile = pathNetworks+'/docker-compose.yaml';
        
        shell.exec('docker-compose -f '+composeFile+' up -d');
        
    },

    async stopNetwork(req, res){
        const pathNetworks = req.query.dir;

        const composeFile = pathNetworks+'/docker-compose.yaml';
        
        shell.exec('docker-compose -f '+composeFile+' down');

    },

    async listPeerForAddNetwork(req, res){    
        
               
        let peers = await  Peer.find().where('network').equals(req.params.id).populate('organization');

  
        return res.send(peers);


    },

    async listCAsNetworks(req, res){
        
        let cas = await CA.find().where('network').equals(req.params.id).populate('organization');

        return res.send(cas);

    },

    async listOrdererNetwork(req, res){

        let orderer = await Orderer.find().where('network').equals(req.params.id).populate('network');

        return res.send(orderer);
    },
    
    async listPeerUserNetwork(req, res){

      let users = await User.find({organization : req.params.org})

      return res.json(users);

    },

    async uploadFileKeyCerticate(req,res){

          var filename = req.file.originalname;

          const peer = await Peer.findById(req.body.peerId2);

          const diretorio = peer.peername+'/'+filename;

          await Peer.findByIdAndUpdate({ _id : req.body.peerId2 }, {keyPrivate : diretorio }, {useFindAndModify : false});

          /*fs.chmodSync(origem, '777')
         
          fsex.moveSync(origem,destino);*/
  

    },

    async addPeerUserNetwork(req, res){

        const networkid = req.query.networkid;

        const peerOrg = req.query.peerOrg;

        const peerUserOrgId = req.query.peerUserOrgId;

        let peer =  await Peer.findOneAndUpdate({network : networkid, peername : peerOrg }, {user : peerUserOrgId },{useFindAndModify: false});

        return res.send(peer);

    },

    async saveIPpublic(req, res){
        const peerId = req.query.peerId;
        
        const  ipPublic = req.query.ipPublic;

        await Peer.findByIdAndUpdate({ _id : peerId }, {ipPublic : ipPublic }, {useFindAndModify : false});


    },

    async saveIPprivate(req, res){
        
        const peerId = req.query.peerId;
        
        const  ipPrivate = req.query.ipPrivate;

        await Peer.findByIdAndUpdate({ _id : peerId }, {ipPrivate : ipPrivate }, {useFindAndModify : false});


    },

    async savePublicDNS(req, res){

        const readFilePromise = (file) => {
            return new Promise((resolve, reject) => {
                fs.readFile(file, (err, data) =>{
                    if(err) return reject('Promise Reject')
                    resolve(data)
                })
            });
        }; 

        const replacePromise = (constents, stringReplace, value) => {
            return new Promise((resolve, reject) => {                     
                    var newvalue =  String(constents).replace(stringReplace, value);
                    resolve(newvalue);
                
            });
        };

        const writeFilePromise = (file, contents) => {
            return new Promise((resolve, reject) => {
                fs.writeFile(file, contents, (err) =>{
                    if(err) return reject('Promise Reject')
                    resolve('Success')
                });
            });
        };
        
        const peerId = req.query.peerId;
        
        const  publicDNS = req.query.publicdns;

        const peer = await Peer.findById(peerId);

        await Peer.findByIdAndUpdate({ _id : peerId }, {publicDNS : publicDNS }, {useFindAndModify : false});

        const network = await Network.findById(peer.network._id);

        const networkconfigFile = network.dirnetwork+"/network-config.yaml";       

        const constentsNetwork = await readFilePromise(networkconfigFile);

        let position = peer.peername.indexOf('.com');

        var peerName = peer.peername.substring(0, position);
      
        const stringReplace = "grpcs://"+peerName;

        let replaceconstentsPeer;

        if(constentsNetwork.includes(stringReplace)){

            replaceconstentsPeer  =  await Promise.resolve(replacePromise(constentsNetwork, stringReplace ,"grpcs://"+publicDNS));
        
        }else if(constentsNetwork.includes("grpcs://"+peer.publicDNS)){

            replaceconstentsPeer =  await Promise.resolve(replacePromise(constentsNetwork, "grpcs://"+peer.publicDNS ,"grpcs://"+publicDNS));
       
        }

        await Promise.resolve(writeFilePromise(networkconfigFile, replaceconstentsPeer));


    },

    async saveIPpublicCA(req, res){
        const caId = req.query.caId;
        
        const  ippublicCA = req.query.ippublicCA;

        await CA.findByIdAndUpdate({ _id : caId }, {ipPublic : ippublicCA }, {useFindAndModify : false});


    },

    async saveIPprivateCA(req, res){
        
        const caId = req.query.caId;
        
        const  ipPrivateCA = req.query.ipPrivateCA;

        await CA.findByIdAndUpdate({ _id : caId }, {ipPrivate : ipPrivateCA }, {useFindAndModify : false});


    },

    async savePublicDNSCA(req, res){

        const readFilePromise = (file) => {
            return new Promise((resolve, reject) => {
                fs.readFile(file, (err, data) =>{
                    if(err) return reject('Promise Reject')
                    resolve(data)
                })
            });
        }; 

        const replacePromise = (constents, stringReplace, value) => {
            return new Promise((resolve, reject) => {                     
                    var newvalue =  String(constents).replace(stringReplace, value);
                    resolve(newvalue);
                
            });
        };

        const writeFilePromise = (file, contents) => {
            return new Promise((resolve, reject) => {
                fs.writeFile(file, contents, (err) =>{
                    if(err) return reject('Promise Reject')
                    resolve('Success')
                });
            });
        }; 
        
        const caId = req.query.caId;     
        
        const  publicdnsCA = req.query.publicdnsCA;

        const ca = await CA.findById(caId);

        await CA.findByIdAndUpdate({ _id : caId }, {publicDNS : publicdnsCA }, {useFindAndModify : false});

        const network = await Network.findById(ca.network._id);

        const networkconfigFile = network.dirnetwork+"/network-config.yaml";       

        const constentsNetwork = await readFilePromise(networkconfigFile);

        let position = ca.caname.indexOf('.com');

        var caName = ca.caname.substring(0, position);
      
        const stringReplace = "url: https://"+caName;

        let replaceconstentsCA;

        if(constentsNetwork.includes(stringReplace)){

            replaceconstentsCA  =  await Promise.resolve(replacePromise(constentsNetwork, stringReplace ,"url: https://"+publicdnsCA));
        
        }else if(constentsNetwork.includes("url: https://"+ca.publicDNS)){

            replaceconstentsCA =  await Promise.resolve(replacePromise(constentsNetwork, "url: https://"+ca.publicDNS ,"url: https://"+publicdnsCA));
       
        }

        await Promise.resolve(writeFilePromise(networkconfigFile, replaceconstentsCA));
    },

    async uploadFileKeyCerticateCA(req,res){

        var filename = req.file.originalname;

        const ca = await CA.findById(req.body.caId2);

        const diretorio = ca.caname+'/'+filename;


        await CA.findByIdAndUpdate({ _id : req.body.caId2 }, {keyPrivate : diretorio }, {useFindAndModify : false});

  },

    async saveIPpublicOrderer(req, res){

        const ordererId = req.query.ordererId;
        
        const  ipPublicOrderer = req.query.ipPublicOrderer;

        await Orderer.findByIdAndUpdate({ _id : ordererId }, {ipPublic : ipPublicOrderer }, {useFindAndModify : false});


    },

    async saveIPprivateOrderer(req, res){
        
        const ordererId = req.query.ordererId;
        
        const  ipPrivateOrderer = req.query.ipPrivateOrderer;

        await Orderer.findByIdAndUpdate({ _id : ordererId }, {ipPrivate : ipPrivateOrderer }, {useFindAndModify : false});


    },

    async savePublicDNSOrderer(req, res){
        
        const ordererId = req.query.ordererId;
               
        const  publicdnsOrderer = req.query.publicdnsOrderer;

        await Orderer.findByIdAndUpdate({ _id : ordererId }, {publicDNS : publicdnsOrderer }, {useFindAndModify : false});

    },

    async uploadFileKeyCerticateOrderer(req,res){

            var filename = req.file.originalname;

            const orderer = await Orderer.findById(req.body.ordererId2);

            const diretorio = orderer.orderername+'/'+filename;

            console.log(diretorio)


            await Orderer.findByIdAndUpdate({ _id : req.body.ordererId2 }, {keyPrivate : diretorio }, {useFindAndModify : false});


    },

    async ckeckedPeer(req,res){
        
        const peer = await Peer.findById(req.query.peerId);

        if(Boolean(peer.ipPublic) && Boolean(peer.ipPrivate) && Boolean(peer.publicDNS) && Boolean(peer.keyPrivate)){
                      
            await Peer.findByIdAndUpdate({ _id : req.query.peerId }, {configured : true }, {useFindAndModify : false});

        }       
    },

    async ckeckedCA(req,res){
        
        const ca = await CA.findById(req.query.caId);

        if(Boolean(ca.ipPublic) && Boolean(ca.ipPrivate) && Boolean(ca.publicDNS) && Boolean(ca.keyPrivate)){
            
            await CA.findByIdAndUpdate({ _id : req.query.caId }, {configured : true }, {useFindAndModify : false});
        }
        
    },

    async ckeckedOrderer(req,res){
        
        const orderer = await Orderer.findById(req.query.ordererId);

        if(Boolean(orderer.ipPublic) && Boolean(orderer.ipPrivate) && Boolean(orderer.publicDNS) && Boolean(orderer.keyPrivate)){

            await Orderer.findByIdAndUpdate({ _id : req.query.ordererId }, {configured : true }, {useFindAndModify : false});

        }
        
    },

    async createdconfignetwork(req, res){

        const readFilePromise = (file) => {
            return new Promise((resolve, reject) => {
                fs.readFile(file, (err, data) =>{
                    if(err) return reject('Promise Reject')
                    resolve(data)
                })
            });
        }; 

        const replacePromise = (constents, stringReplace, value) => {
            return new Promise((resolve, reject) => {                     
                    var newvalue =  String(constents).replace(stringReplace, value);
                    resolve(newvalue);
                
            });
        };

        const writeFilePromise = (file, contents) => {
            return new Promise((resolve, reject) => {
                fs.writeFile(file, contents, (err) =>{
                    if(err) return reject('Promise Reject')
                    resolve('Success')
                });
            });
        }; 

           
        let extrashosts = [];

        let network = await Network.findById(req.params.id);

        let peers = await  Peer.find().where('network').equals(req.params.id);

        let cas = await  CA.find().where('network').equals(req.params.id);

        let orderer = await Orderer.find().where('network').equals(req.params.id)

        cas.map((ca)=>{            
            extrashosts.push('          - \"'+ca.caname+":"+ca.ipPublic+'\"\n');
        })

        
        peers.map((peer)=>{            
            extrashosts.push('          - \"'+peer.peername+":"+peer.ipPublic+'\"\n');
        })

        orderer.map(orderer => {            
            extrashosts.push('          - \"'+orderer.orderername+":"+orderer.ipPublic+'\"');    
        })

        
        extrashosts.map((item) => {
                console.log(item);
        });

        for (var i=0; i<peers.length; i++) {
            const peerconfigFile = network.dirnetwork+"/"+peers[i].composeFileName;      
            const constentsPeerFileContents = await readFilePromise(peerconfigFile);
            const extrashostsFilter = extrashosts.filter((it) =>  it !== '          - \"'+peers[i].peername+":"+peers[i].ipPublic+'\"\n')
            let host = String(extrashostsFilter);
            const constentsPeerFileContentsReplace =  await Promise.resolve(replacePromise(constentsPeerFileContents,"extrahostspeerscaorderers",host.replace(/\'/g,'' ).replace(/\'/g, '').replace(/\,/g, '')));                 
            await Promise.resolve(writeFilePromise(peerconfigFile, constentsPeerFileContentsReplace)); 
            await fsex.copy(network.dirnetwork+"/"+peers[i].composeFileName, network.dirnetwork+"/"+peers[i].peername+"/"+peers[i].composeFileName);
            await fsex.copy(network.dirnetwork+"/base.yaml", network.dirnetwork+"/"+peers[i].peername+"/base.yaml"); 
            await fsex.copy(network.dirnetwork+"/crypto-config", network.dirnetwork+"/"+peers[i].peername+"/crypto-config/");
            await fsex.copy(network.dirnetwork+"/channel-artifacts", network.dirnetwork+"/"+peers[i].peername+"/channel-artifacts/");
        }

        for (var i=0; i<cas.length; i++) {
            const caconfigFile = network.dirnetwork+"/"+cas[i].composeFileName;      
            const constentsCAFileContents = await readFilePromise(caconfigFile);
            const extrashostsFilter = extrashosts.filter((it) =>  it !== '          - \"'+cas[i].caname+":"+cas[i].ipPublic+'\"\n')
            let host = String(extrashostsFilter);
            const constentsCAFileContentsReplace =  await Promise.resolve(replacePromise(constentsCAFileContents,"extrahostspeerscaorderers",host.replace(/\'/g,'' ).replace(/\'/g, '').replace(/\,/g, '')));  
            await Promise.resolve(writeFilePromise(caconfigFile, constentsCAFileContentsReplace));
            await fsex.copy(network.dirnetwork+"/"+cas[i].composeFileName, network.dirnetwork+"/"+cas[i].caname+"/"+cas[i].composeFileName);
            await fsex.copy(network.dirnetwork+"/crypto-config", network.dirnetwork+"/"+cas[i].caname+"/crypto-config/");
            await fsex.copy(network.dirnetwork+"/channel-artifacts", network.dirnetwork+"/"+cas[i].caname+"/channel-artifacts/");                     
        }

        for (var i=0; i<orderer.length; i++) {
            const ordererconfigFile = network.dirnetwork+"/"+orderer[i].composeFileName;      
            const constentsOrdererFileContents = await readFilePromise(ordererconfigFile);
            const extrashostsFilter = extrashosts.filter((it) =>  it !== '          - \"'+orderer[i].orderername+":"+orderer[i].ipPublic+'\"')
            let host = String(extrashostsFilter);
            const constentsOrdererFileContentsReplace =  await Promise.resolve(replacePromise(constentsOrdererFileContents,"extrahostspeerscaorderers",host.replace(/\'/g,'' ).replace(/\'/g, '').replace(/\,/g, '')));                 
            await Promise.resolve(writeFilePromise(ordererconfigFile, constentsOrdererFileContentsReplace));
            await fsex.copy(network.dirnetwork+"/"+orderer[i].composeFileName, network.dirnetwork+"/"+orderer[i].orderername+"/"+orderer[i].composeFileName);
            await fsex.copy(network.dirnetwork+"/crypto-config", network.dirnetwork+"/"+orderer[i].orderername+"/crypto-config/");
            await fsex.copy(network.dirnetwork+"/channel-artifacts", network.dirnetwork+"/"+orderer[i].orderername+"/channel-artifacts/");        
        }

        for (var i=0; i<peers.length; i++) {   
            await zip.zip(network.dirnetwork+"/"+peers[i].peername, network.dirnetwork+"/"+peers[i].peername+".zip");
        }

        for (var i=0; i<cas.length; i++) {      
            await zip.zip(network.dirnetwork+"/"+cas[i].caname, network.dirnetwork+"/"+cas[i].caname+".zip");
        }


        for (var i=0; i<orderer.length; i++) {  
            await zip.zip(network.dirnetwork+"/"+orderer[i].orderername, network.dirnetwork+"/"+orderer[i].orderername+".zip"); 
        }

            
    },

    async upPeer(req, res){
        
        const peerId = req.params.id;

        const peer = await Peer.findById(peerId);

        const network = await Network.findById(peer.network._id);

        const dirPeer = network.dirnetwork+"/"+peer.peername+".zip";

        const peerPrivateKey = network.dirnetwork+"/"+peer.keyPrivate;

        const peerIpPublic = peer.ipPublic;

        await fs.chmod(peerPrivateKey, '777')
        await shell.exec("sudo scp -i "+peerPrivateKey+" "+dirPeer+" ubuntu@"+peerIpPublic+":/home/ubuntu/");

    },

    async commandCloud(req, res){

        const peerId = req.params.id;

        const peer = await Peer.findById(peerId);

        const network = await Network.findById(peer.network._id);

        const peerPrivateKey = network.dirnetwork+"/"+peer.keyPrivate;

        const peerDNS = peer.publicDNS;


        Conn.on('ready', function() {
            console.log('Client :: ready');
            const cmd = 'mkdir '+network.networkname +' && unzip '+peer.peername+".zip -d "+network.networkname+ ' && cd '+network.networkname+'/ && docker-compose -f '+peer.composeFileName+' up -d ';
            Conn.exec(cmd,function(err, stream) {
              if (err) throw err;
              stream.on('close', function() {
                console.log('Stream :: close');
                Conn.end();
              }).on('data', function(data) {
                console.log('OUTPUT: ' + data);
              });
              stream.end('ls -l\nexit\n');
            });
          }).connect({
            host: ''+peerDNS,
            port: 22,
            username: 'ubuntu',
            privateKey: require('fs').readFileSync(''+peerPrivateKey)
          });
    },

    async upOrderer(req, res){
        
        const ordererId = req.params.id;

        const orderer = await Orderer.findById(ordererId);

        const network = await Network.findById(orderer.network._id);

        const dirOrderer = network.dirnetwork+"/"+orderer.orderername+".zip";

        const ordererPrivateKey = network.dirnetwork+"/"+orderer.keyPrivate;

        const ordererIpPublic = orderer.ipPublic;

        await fs.chmod(ordererPrivateKey, '777')
        await shell.exec("sudo scp -i "+ordererPrivateKey+" "+dirOrderer+" ubuntu@"+ordererIpPublic+":/home/ubuntu/");

    },

    async commandCloudOrderer(req, res){

        const ordererId = req.params.id;

        const orderer = await Orderer.findById(ordererId);

        const network = await Network.findById(orderer.network._id);

        const ordererPrivateKey = network.dirnetwork+"/"+orderer.keyPrivate;

        const ordererDNS = orderer.publicDNS;


        Conn.on('ready', function() {
            console.log('Client :: ready');
            const cmd = 'mkdir '+network.networkname +' && unzip '+orderer.orderername+".zip -d "+network.networkname+ ' && cd '+network.networkname+'/ && docker-compose -f '+orderer.composeFileName+' up -d ';
            Conn.exec(cmd,function(err, stream) {
              if (err) throw err;
              stream.on('close', function() {
                console.log('Stream :: close');
                Conn.end();
              }).on('data', function(data) {
                console.log('OUTPUT: ' + data);
              });
              stream.end('ls -l\nexit\n');
            });
          }).connect({
            host: ''+ordererDNS,
            port: 22,
            username: 'ubuntu',
            privateKey: require('fs').readFileSync(''+ordererPrivateKey)
          });
    },

    async upCA(req, res){
        
        const caId = req.params.id;

        const ca = await CA.findById(caId);

        const network = await Network.findById(ca.network._id);

        const dirCA = network.dirnetwork+"/"+ca.caname+".zip";

        const caPrivateKey = network.dirnetwork+"/"+ca.keyPrivate;

        const caIpPublic = ca.ipPublic;

        await fs.chmod(caPrivateKey, '777')
        await shell.exec("sudo scp -i "+caPrivateKey+" "+dirCA+" ubuntu@"+caIpPublic+":/home/ubuntu/");

    },

    async commandCloudCA(req, res){

        const caId = req.params.id;

        const ca = await CA.findById(caId);

        const network = await Network.findById(ca.network._id);

        const caPrivateKey = network.dirnetwork+"/"+ca.keyPrivate;

        const caDNS = ca.publicDNS;


        Conn.on('ready', function() {
            console.log('Client :: ready');
            const cmd = 'unzip '+ca.caname+".zip -d "+network.networkname+ ' && cd '+network.networkname+'/ && docker-compose -f '+ca.composeFileName+' up -d ';
            Conn.exec(cmd,function(err, stream) {
              if (err) throw err;
              stream.on('close', function() {
                console.log('Stream :: close');
                Conn.end();
              }).on('data', function(data) {
                console.log('OUTPUT: ' + data);
              });
              stream.end('ls -l\nexit\n');
            });
          }).connect({
            host: ''+caDNS,
            port: 22,
            username: 'ubuntu',
            privateKey: require('fs').readFileSync(''+caPrivateKey)
          });
    }
}