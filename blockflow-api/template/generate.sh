#!/bin/sh
#
# Copyright IBM Corp All Rights Reserved
#
# SPDX-License-Identifier: Apache-2.0
#
export PATH=${PWD}/../bin:${PWD}:$PATH
export FABRIC_CFG_PATH=${PWD}


# remove previous crypto material and config transactions
#rm -fr config/*
#rm -fr crypto-config/*




# generate crypto material
#crypto-config.yaml serve para gerar os certificados necessários for different parties, including nodes and administrators 
#Todos os certificados são gerados usando a ferramenta cryptogen com o arquivo de configuração 
#crypto-config.yaml . O resultado é um diretório crypto-config recém-criado e 
#todos os certificados são armazenados dentro dele.
cryptogen generate --config=./crypto-config.yaml
if [ "$?" -ne 0 ]; then
  echo "Failed to generate crypto material..."
  exit 1
fi

#configtx.yaml Este arquivo mantém toda a rede de negócios que estamos construindo. 
#A ferramenta que estamos usando é o configtxgen e o arquivo de configuração é configtx.yaml .
# generate genesis block for orderer
#Primeiro geramos o bloco de gênese usando o perfil OrdererGenesis . O resultado é um arquivo chamado genesis.block .
../bin/configtxgen -profile OneOrgOrdererGenesis -outputBlock ./config/genesis.block
if [ "$?" -ne 0 ]; then
  echo "Failed to generate orderer genesis block..."
  exit 1
fi


#configtx.yaml Este arquivo mantém toda a rede de negócios que estamos construindo. 
# generate channel configuration transaction
../bin/configtxgen -profile OneOrgChannel -outputCreateChannelTx ./config/channel.tx -channelID $CHANNEL_NAME
if [ "$?" -ne 0 ]; then
  echo "Failed to generate channel configuration transaction..."
  exit 1
fi

# generate anchor peer transaction
# teremos todos os pares como pares de âncora em cada canal no nosso caso somente um se eu tivesse mais 
../bin/configtxgen -profile OneOrgChannel -outputAnchorPeersUpdate ./config/Org1MSPanchors.tx -channelID $CHANNEL_NAME -asOrg Org1MSP
if [ "$?" -ne 0 ]; then
  echo "Failed to generate anchor peer update for Org1MSP..."
  exit 1
fi
# se eu tivesse mais eu colocaria desse jeito
#../bin/configtxgen -profile $ {CHANNEL_ONE_PROFILE} -outputAnchorPeersUpdate ./channel-artifacts/Org2MSPanchors_${CHANNEL_ONE_NAME}.tx -channelID $ CHANNEL_ONE_NAME -asOrg Org2MSP