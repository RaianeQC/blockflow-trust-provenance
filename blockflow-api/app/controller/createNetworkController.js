const path = require('path');
const fs = require('fs');
const fsex = require('fs-extra')
const shell = require('shelljs')
const Network = require('../model/networkModel')
const Organization = require('../model/organizationModel')
const OrganizationChannel = require('../model/organizationChannelModel')
const Peer = require('../model/peerModel')
const Channel = require('../model/channelModel')
const User = require('../model/userModel');

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
        const templateCompose = path.join(process.cwd(), 'template/base');
        const peerFileCompose = path.resolve(__dirname, templateCompose, 'docker-compose-peer.yaml');
        const baseFile = path.resolve(__dirname, templateCompose, 'base.yaml' )
        const couchDBFile = path.resolve(__dirname, templateCompose, 'docker-compose-couchdb.yaml');
        const caFile = path.resolve(__dirname, templateCompose, 'docker-compose-ca.yaml');
        const ordererFileCompose = path.resolve(__dirname, templateCompose,   'docker-compose-orderer.yaml');
        const composeBaseFilePathCopy =  path.resolve(__dirname, templateCompose, 'docker-compose.yaml');
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

         //template networkconfig
         const templateNetworkConfig = path.join(process.cwd(), 'template/networkconfig');
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

                await fs.copyFileSync(composeBaseFilePathCopy, pathNetworks+"/docker-compose.yaml");

                await fs.copyFileSync(baseFile, pathNetworks+"/base.yaml");   
                const basePeerFilePath = path.resolve(__dirname, pathNetworks+"/base.yaml");
                const constentsBasePeerContents = await readFilePromise(basePeerFilePath);
                const constentsBasePeerContents2 =  await Promise.resolve(replacePromise(constentsBasePeerContents,"networkname",networkname.toLowerCase()));              
                await Promise.resolve(writeFilePromise(basePeerFilePath, constentsBasePeerContents2));             

                const composeBaseFilePath = path.resolve(__dirname, pathNetworks+"/docker-compose.yaml");
                const constentsBaseContents = await readFilePromise(composeBaseFilePath);
                const composefilenetwork =  await Promise.resolve(replacePromise(constentsBaseContents,"networkname",networkname.toLowerCase()));              
                await Promise.resolve(writeFilePromise(composeBaseFilePath, composefilenetwork));

                

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
                    dirnetwork: pathNetworks

                });

                await Promise.all(organizationName.map(async (organizationvalue, index)=>{                
                   
                    const organization = new Organization({
                            organizationName : organizationvalue,
                            numPeer: numPeer[index],
                            network: network._id
                    });
                        
                    await organization.save();

                    network.organizations.push(organization);                

                    const peerasync  = async _ => { 

                        var peerCont = numPeer[index];
    
                        for(var i = 0; i<peerCont; i++){

                            const peer = new Peer({
                                peername: 'peer'+i+'.'+organizationvalue+'.com',
                                organization: organization._id,
                                network: network._id,                           
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
                            const constents = await readFilePromise(peerFileCompose);                       
                            
                                                       
                            const newValue =  await Promise.resolve(replacePromise(constents,"peernumber",index2));
                            const newValue2 =  await Promise.resolve(replacePromise(newValue,"orgname",nameorganization));
                            const newValue3 =  await Promise.resolve(replacePromise(newValue2,"portnumber",portnumber));
                            const newValue4 =  await Promise.resolve(replacePromise(newValue3,"couchdbname",couchdbnumber));
                            const newValue5 =  await Promise.resolve(replacePromise(newValue4,"portcouch",portnumbercouch));
                            const newValue6 =  await Promise.resolve(replacePromise(newValue5,"networkname",networkname.toLowerCase()));
                            const newValueport2 =  await Promise.resolve(replacePromise(newValue6,"portpeer2",portpeer2));
                            await Promise.resolve(appendFilePromise(composeBaseFilePath, newValueport2));
                           
                            const contentscouch = await readFilePromise(couchDBFile);                        
                            const newValue7 =  await Promise.resolve(replacePromise(contentscouch,"couchdbname",couchdbnumber));
                            const newValue8 =  await Promise.resolve(replacePromise(newValue7,"portcouch",portnumbercouch)) 
                            const newValue9 =  await Promise.resolve(replacePromise(newValue8,"networkname",networkname.toLowerCase()));                     
                            await Promise.resolve(appendFilePromise(composeBaseFilePath, newValue9));

                            portnumber = portnumber+1000;
                            portpeer2++;
                            couchdbnumber++;
                            portnumbercouch++;
                    
                        }

                          
                        ordererPeer.push('            - ./crypto-config/peerOrganizations/'+nameorganization+'.com/peers/peer0.'+nameorganization+'.com/:/etc/hyperledger/crypto/peer'+nameorganization+'\n');
                        ordererca.push(' /etc/hyperledger/crypto/peer'+nameorganization+'/tls/ca.crt');
            
                        portca++;
                        const contentsca = await readFilePromise(caFile);                    
                        const newValueca =  await Promise.resolve(replacePromise(contentsca,"orgname",nameorganization));                        
                        const newValueca2 =  await Promise.resolve(replacePromise(newValueca,"portca",portca));
                        const newValueca3 =  await Promise.resolve(replacePromise(newValueca2,"networkname",networkname.toLowerCase()));
                        //colocar codigo aqui
                        const skvalue = await Promise.resolve(readDirPromise(pathNetworks+'/crypto-config/peerOrganizations/'+nameorganization+'.com/ca/'));
                        const newValueca4 =  await Promise.resolve(replacePromise(newValueca3,"keyorg",skvalue));     
                        await Promise.resolve(appendFilePromise(composeBaseFilePath, newValueca4));
                    }
    
                    const contentsOrderer = await readFilePromise(ordererFileCompose);
                    let portorderer1 = portorderer;
                    const newconstentsorderer =  await Promise.resolve(replacePromise(contentsOrderer,"portorderer",portorderer1++));                            
                    const ordererPeerString = String(ordererPeer);                    
                    const orderervalue =  await Promise.resolve(replacePromise(newconstentsorderer,"ordererpeer",ordererPeerString.replace(/\'/g,'' ).replace(/\'/g, '').replace(/\,/g, '')));                                     
                    const orderervalue2 =  await Promise.resolve(replacePromise(orderervalue,"networkname",networkname.toLowerCase()));
                    const orderercaString = String(ordererca); 
                    const orderervalue3 =  await Promise.resolve(replacePromise(orderervalue2,"ordererca",orderercaString.replace(/\'/g,'' ).replace(/\'/g, '')));                                      
                    await Promise.resolve(appendFilePromise(composeBaseFilePath, orderervalue3)); 
                
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

                                portnumberConfig = portnumberConfig+1000;
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
                console.log("Network Name Já exist")
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
    async listPeerUserNetwork(req, res){

      let users = await User.find({organization : req.params.org})

      return res.json(users);

    },

    async addPeerUserNetwork(req, res){

        const networkid = req.query.networkid;

        const peerOrg = req.query.peerOrg;

        const peerUserOrgId = req.query.peerUserOrgId;

        let peer =  await Peer.findOneAndUpdate({network : networkid, peername : peerOrg }, {user : peerUserOrgId },{useFindAndModify: false});

        return res.send(peer);

    },

         
}
