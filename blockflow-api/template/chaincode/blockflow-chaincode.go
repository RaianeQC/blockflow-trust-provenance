package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"strings"

	"github.com/hyperledger/fabric/core/chaincode/shim"
	sc "github.com/hyperledger/fabric/protos/peer"

)

// Define the Smart Contract structure
type SmartContractBlockflow struct{

}

type program struct{
	ObjectType string   `json:"docType"`	
	IdProgram string  `json:"idProgram"`
	NameProgram  string  `json:"nameProgram"`
	Created  string  `json:"created"` 
	HasOutPort string `json:"hasOutPort"`
	HasInPort  string `json:"hasInPort"`
}

type port struct{
	ObjectType string   `json:"docType"`
	IdPort  string `json:"idPort"`
	PortType  string `json:"portType"`
	PortValue string `json:"portValue"`
	
}

type hasOutPort struct{
	ObjectType string   `json:"docType"`
	HasOutPortId  string `json:"hasOutPortId"`
	PortId  string `json:"portId"`
	ProgramID  string `json:"programID"`
	ProgramName  string `json:"programName"`
	InputPortValue  string `json:"inputPortValue"`	
}

type hasInPort struct{	
	ObjectType string   `json:"docType"`
	HasInPortId  string `json:"hasInPortId"`
	PortId  string `json:"portId"`
	ProgramID  string `json:"programID"`
	ProgramName  string `json:"programName"`
	InputPortValue  string `json:"inputPortValue"`	
}

type association struct {
	ObjectType string   `json:"docType"`
	IdAssociation string  `json:"idAssociation"`
	HadPlanName string  `json:"hadPlanName"`
	HadPlanId  string  `json:"hadPlanId"`
	UserAgent  string  `json:"userAgent"`
	UserAgentId   string  `json:"userAgentId"`
}

type entity struct{
	ObjectType string   `json:"docType"`
	IdEntity string `json:"idEntity"` 
	TypeEntity string  `json:"typeEntity"`
	ValueEntity string  `json:"valueEntity"`
}



type programexecution struct{
	ObjectType string   `json:"docType"`
	IdProgramExecution string `json:"idProgramExecution"`
	StartTime  string `json:"startTime"`
	EndTime  string `json:"endTime"`
	ProgramName  string `json:"programName"`
}

type qualifiedassociation struct{
	ObjectType string   `json:"docType"`
	IdProgramExecution string `json:"idProgramExecution"`
	ProgramExecutionName  string `json:"programExecutionName"`
	IdAssociation string `json:"idAssociation"`
	Agent  string `json:"agent"`
	HadPlan  string `json:"hadPlan"`
}

type qualifiedGeneration struct{
	    ObjectType string   `json:"docType"`	
		IdQualifiedGeneration string `json:"idQualifiedGeneration"`
		ProgramExecution  string `json:"programExecution"`
		ProgramExecutionId  string `json:"programExecutionId"`
		GenerationId  string `json:"generationId"`
		EntityValue  string `json:"entityValue"`

}


type wasassociatedwith struct{
	ObjectType string   `json:"docType"`
	Agent string `json:"agent"`
	IdAgent string `json:"idAgent"`
	ProgramExecution  string `json:"programExecution"`
	IdProgramExecution  string `json:"idProgramExecution"`
	IdWasAssociatedWith  string `json:"idWasAssociatedWith"`
	
}




type usage struct{ 
	ObjectType string   `json:"docType"`
	HadInputPort  string `json:"hadInputPort"`
	HadEntity  string `json:"hadEntity"`
	IdUsage  string `json:"idUsage"`
	
}

type qualifiedUsage struct{ 
	ObjectType string   `json:"docType"`
	ProgramExecution  string `json:"programExecution"`
	IdProgramExecution  string `json:"idProgramExecution"`
	UsageId  string `json:"usageId"`
	IdQualifiedUsage  string `json:"idQualifiedUsage"`
	EntityValue  string `json:"entityValue"`
}

type generation struct{ 
	ObjectType string   `json:"docType"`
	IdGeneration  string `json:"idGeneration"`
	HadOutputPort  string `json:"hadOutputPort"`
	HadEntity  string `json:"hadEntity"`	
}


type workflow struct{
	ObjectType string   `json:"docType"`
	NameSWFMS string  `json:"nameSWFMS"`
	WorkflowValue string `json:"workflowValue"`
	WorkflowName  string `json:"workflowName"`
	ExecutionStopTime  string `json:"executionStopTime"`
	ExecutionStartTime  string `json:"executionStartTime"`
}

type used struct{
	ObjectType string  `json:"docType"`
	IdUsed string  `json:"idUsed"`
	ProgramExecutionId  string  `json:"programExecutionId"`
	ProgramExecutionName string  `json:"programExecutionName"`
	IdEntity string  `json:"idEntity"`
	EntityValue string  `json:"entityValue"`
}

type wasGeneratedBy struct{
	ObjectType string  `json:"docType"`
	IdWasGeneratedBy string `json:"idWasGeneratedBy"`
	ProgramExecutionId  string  `json:"programExecutionId"`
	ProgramExecutionName string  `json:"programExecutionName"`
	IdEntity string  `json:"idEntity"`
	EntityValue string  `json:"entityValue"`
}


/*
 * The Init method *
 called when the Smart Contract "tuna-chaincode" is instantiated by the network
 * Best practice is to have any Ledger initialization in separate function 
 -- see initLedger()
 */
 func (s *SmartContractBlockflow) Init(APIstub shim.ChaincodeStubInterface) sc.Response {
	return shim.Success(nil)
}


/*
 * The Invoke method *
 called when an application requests to run the Smart Contract "tuna-chaincode"
 The app also specifies the specific smart contract function to call with args
 */
 func (s *SmartContractBlockflow) Invoke(APIstub shim.ChaincodeStubInterface) sc.Response {

	// Retrieve the requested Smart Contract function and arguments
	function, args := APIstub.GetFunctionAndParameters()
	// Route to the appropriate handler function to interact with the ledger
	
	if function == "recordProgram" {
		return s.recordProgram(APIstub, args)
	}else if function == "recordEntity" {
		return s.recordEntity(APIstub, args)
	}else if function == "recordAssociation" {
		return s.recordAssociation(APIstub, args)
	}else if function == "recordProgramexcution" {
		return s.recordProgramexcution(APIstub, args)
	}else if function == "recordQualifiedAssociation" {
		return s.recordQualifiedAssociation(APIstub, args)
	}else if function == "recordwasAssociatedWith" {
		return s.recordwasAssociatedWith(APIstub, args)
	}else if function == "recordPort" {
		return s.recordPort(APIstub, args)
	}else if function == "recordHasOutPort" {
		return s.recordHasOutPort(APIstub, args)
	}else if function == "recordHasInPort" {
		return s.recordHasInPort(APIstub, args)
	}else if function == "queryBlockflow" {
		return s.queryBlockflow(APIstub, args)
	}else if function == "recordQualifiedGeneration" {
		return s.recordQualifiedGeneration(APIstub, args)
	}else if function == "recordQualifiedUsage" {
		return s.recordQualifiedUsage(APIstub, args)
	}else if function == "recordGeneration" {
		return s.recordGeneration(APIstub, args)
	}else if function == "recordUsed" {
		return s.recordUsed(APIstub, args)
	}else if function == "recordWasGeneratedBy" {
		return s.recordWasGeneratedBy(APIstub, args)
	}
	
	
		
	return shim.Error("Invalid Smart Contract function name.")
}

func (s *SmartContractBlockflow) recordProgram(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {


	if len(args) != 5 {
		return shim.Error("Incorrect number of arguments. Expecting 4 recordProgram")
	}

	
    docType := "program"
	idProgram := args[0]
	nameProgram := strings.ToLower(args[1])
	dataCreated := args[2]
	hasOutPort := args[3]
	hasInPort := args[4]
	

	
	
	program := &program{docType, idProgram, nameProgram, dataCreated, hasOutPort, hasInPort}

	programAsBytes, _ := json.Marshal(program)
	err := APIstub.PutState(args[0], programAsBytes)
	if err != nil {
		return shim.Error(fmt.Sprintf("Failed to record program catch: %s", args[0]))
	}

	return shim.Success(nil)
}

func (s *SmartContractBlockflow) recordAssociation(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {

	if len(args) != 5 {
		return shim.Error("Incorrect number of arguments. Expecting 4 recordAssociation")
	}

	docType := "association"
    idAssociation := args[0]
	hadPlanName := strings.ToLower(args[1])
	hadPlanId  := args[2]
	userAgent  := strings.ToLower(args[3])
	userAgentId  := args[4]

	association := &association{docType, idAssociation,hadPlanName, hadPlanId, userAgent, userAgentId}

	associationAsBytes, _ := json.Marshal(association)
	err := APIstub.PutState(args[0], associationAsBytes)
	if err != nil {
		return shim.Error(fmt.Sprintf("Failed to record Association catch: %s", args[0]))
	}

	return shim.Success(nil)
}

func (s *SmartContractBlockflow) recordProgramexcution(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {

	if len(args) != 4 {
		return shim.Error("Incorrect number of arguments. Expecting 4 recordProgramexcution")
	}
	
	docType := "programExecution"
	idProgramExecution := args[0]
	startTime  := args[1]
	endTime  := args[2]
	programName  := strings.ToLower(args[3])
	

	programexecution := &programexecution{docType,idProgramExecution, startTime, endTime, programName}

	programexecutionAsBytes, _ := json.Marshal(programexecution)
	err := APIstub.PutState(args[0], programexecutionAsBytes)
	if err != nil {
		return shim.Error(fmt.Sprintf("Failed to record program execution catch: %s", args[0]))
	}

	return shim.Success(nil)
}

func (s *SmartContractBlockflow) recordQualifiedAssociation(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {

	if len(args) != 5 {
		return shim.Error("Incorrect number of arguments. Expecting 5 recordQualifiedAssociation")
	}
	
    docType := "qualifiedAssociation"
	idProgramExecution := args[0]
	programExecutionName  := args[1]
	idAssociation  := args[2]
	agent  := args[3]
	hadPlan  := args[4]

	
	qualifiedassociation := &qualifiedassociation{docType, idProgramExecution,programExecutionName,idAssociation,agent,hadPlan}

	qualifiedassociationAsBytes, _ := json.Marshal(qualifiedassociation)
	err := APIstub.PutState(args[0], qualifiedassociationAsBytes)
	if err != nil {
		return shim.Error(fmt.Sprintf("Failed to record qualified association catch: %s", args[0]))
	}

	return shim.Success(nil)
}

func (s *SmartContractBlockflow) recordwasAssociatedWith(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {

	if len(args) != 5 {
		return shim.Error("Incorrect number of arguments. Expecting 4 recordProgram")
	}

	docType := "wasAssociatedWith"
	agent := args[0]
	idAgent := args[1]
	programExecution  := args[2]
	idProgramExecution  := args[3]	
	idWasAssociatedWith  := args[4]
	
	wasassociatedwith := &wasassociatedwith{docType, agent, idAgent, programExecution, idProgramExecution, idWasAssociatedWith  }

	wasassociatedwithAsBytes, _ := json.Marshal(wasassociatedwith)
	err := APIstub.PutState(args[4], wasassociatedwithAsBytes)
	if err != nil {
		return shim.Error(fmt.Sprintf("Failed to record wasAssociatedWith catch: %s", args[0]))
	}

	return shim.Success(nil)
}

func (s *SmartContractBlockflow) recordEntity(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {


	if len(args) != 3 {
		return shim.Error("Incorrect number of arguments. Expecting 4 recordEntity")
	}

   
    docType := "entity"
	idEntity := args[0]
	typeEntity := strings.ToLower(args[1])
	valueEntity := strings.ToLower(args[2])

	entity := &entity{docType, idEntity,typeEntity,valueEntity}

	entityAsBytes, _ := json.Marshal(entity)
	err := APIstub.PutState(args[0], entityAsBytes)
	if err != nil {
		return shim.Error(fmt.Sprintf("Failed to record entity catch: %s", args[0]))
	}

	return shim.Success(nil)
}


func (s *SmartContractBlockflow) recordPort(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {


	if len(args) != 3 {
		return shim.Error("Incorrect number of arguments. Expecting 4 recordProgram")
	}

	docType := "port"
	idPort := args[0]
	portType := strings.ToLower(args[1])	
	portValue := strings.ToLower(args[2])

	port := &port{docType, idPort, portType, portValue }

	portAsBytes, _ := json.Marshal(port)
	err := APIstub.PutState(args[0], portAsBytes)
	if err != nil {
		return shim.Error(fmt.Sprintf("Failed to record program catch: %s", args[0]))
	}

	return shim.Success(nil)
}


func (s *SmartContractBlockflow) recordHasOutPort(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {


	if len(args) != 5 {
		return shim.Error("Incorrect number of arguments. Expecting 5 recordHasOutPort")
	}

	
    docType := "hasOutPort"
	hasOutPortId := args[0]
	portId := args[1]
	programID := args[2]
	programName := args[3]
	inputPortValue := strings.ToLower(args[4])
	

	hasOutPort := &hasOutPort{docType, hasOutPortId, portId, programID, programName, inputPortValue }

	hasOutPortAsBytes, _ := json.Marshal(hasOutPort)
	err := APIstub.PutState(args[0], hasOutPortAsBytes)
	if err != nil {
		return shim.Error(fmt.Sprintf("Failed to record HasOutPort catch: %s", args[0]))
	}

	return shim.Success(nil)
}

func (s *SmartContractBlockflow) recordHasInPort(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {


	if len(args) != 5 {
		return shim.Error("Incorrect number of arguments. Expecting 4 recordHasInPort")
	}

	docType := "hasInPort"
	hasInPortId := args[0]
	portId := args[1]
	programID := args[2]
	programName := args[3]
	inputPortValue := strings.ToLower(args[4])
	
	hasInPort := &hasInPort{docType, hasInPortId, portId, programID, programName, inputPortValue  }

	hasInPortAsBytes, _ := json.Marshal(hasInPort)
	err := APIstub.PutState(args[0], hasInPortAsBytes)
	if err != nil {
		return shim.Error(fmt.Sprintf("Failed to record program catch: %s", args[0]))
	}

	return shim.Success(nil)
}

func (s *SmartContractBlockflow) recordUsage(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {


	if len(args) != 3 {
		return shim.Error("Incorrect number of arguments. Expecting 3 recordUsage")
	}

	docType := "usage"
	hadInputPort := args[0]
	hadEntity := args[1]
	idUsage := args[2]
	

	usage := &usage{docType, hadInputPort, hadEntity, idUsage}

	usageAsBytes, _ := json.Marshal(usage)
	err := APIstub.PutState(args[2], usageAsBytes)
	if err != nil {
		return shim.Error(fmt.Sprintf("Failed to record Usage catch: %s", args[0]))
	}

	return shim.Success(nil)
}

func (s *SmartContractBlockflow) recordQualifiedUsage(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {


	if len(args) != 5 {
		return shim.Error("Incorrect number of arguments. Expecting 4 recordProgram")
	}

	docType := "qualifiedUsage"
	programExecution := args[0]
	idProgramExecution := args[1]
	usageId := args[2]
	idQualifiedUsage := args[3]
	entityValue := args[4]
	

	qualifiedUsage := &qualifiedUsage{docType, programExecution, idProgramExecution, usageId, idQualifiedUsage, entityValue}

	qualifiedUsageAsBytes, _ := json.Marshal(qualifiedUsage)
	err := APIstub.PutState(args[3], qualifiedUsageAsBytes)
	if err != nil {
		return shim.Error(fmt.Sprintf("Failed to record program catch: %s", args[0]))
	}

	return shim.Success(nil)
}


func (s *SmartContractBlockflow) recordGeneration(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {


	if len(args) != 3 {
		return shim.Error("Incorrect number of arguments. Expecting 3 recordGeneration")
	}

	
	docType := "generation"
    idGeneration := args[0]
	hadOutputPort := args[1]
	hadEntity := args[2]
	

	generation := &generation{docType, idGeneration, hadOutputPort, hadEntity }

	generationAsBytes, _ := json.Marshal(generation)
	err := APIstub.PutState(args[0], generationAsBytes)
	if err != nil {
		return shim.Error(fmt.Sprintf("Failed to record Generation catch: %s", args[0]))
	}

	return shim.Success(nil)
}


func (s *SmartContractBlockflow) recordQualifiedGeneration(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {


	if len(args) != 5 {
		return shim.Error("Incorrect number of arguments. Expecting 4 recordProgram")
	}


		docType := "qualifiedGeneration"
		idQualifiedGeneration := args[0]
		programExecution := args[1]
		programExecutionId := args[2]
		generationId := args[3]
		entityValue := args[4]
	

	qualifiedGeneration := &qualifiedGeneration{docType, idQualifiedGeneration, programExecution, programExecutionId, generationId, entityValue    }

	qualifiedGenerationAsBytes, _ := json.Marshal(qualifiedGeneration)
	err := APIstub.PutState(args[0], qualifiedGenerationAsBytes)
	if err != nil {
		return shim.Error(fmt.Sprintf("Failed to record program catch: %s", args[0]))
	}

	return shim.Success(nil)
}


func (s *SmartContractBlockflow) recordUsed(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {


	if len(args) != 5 {
		return shim.Error("Incorrect number of arguments. Expecting 4 recordProgram")
	}

		docType := "used"
		idUsed := args[0]
		programExecutionId := args[1]
		programExecutionName := args[2]
		idEntity := args[3]
		entityValue := args[4]
	

	used := &used{docType, idUsed, programExecutionId, programExecutionName, idEntity, entityValue }

	usedAsBytes, _ := json.Marshal(used)
	err := APIstub.PutState(args[0], usedAsBytes)
	if err != nil {
		return shim.Error(fmt.Sprintf("Failed to record program catch: %s", args[0]))
	}

	return shim.Success(nil)
}

func (s *SmartContractBlockflow) recordWasGeneratedBy(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {


	if len(args) != 5 {
		return shim.Error("Incorrect number of arguments. Expecting 4 recordProgram")
	}

		docType := "wasGeneratedBy"
		idWasGeneratedBy := args[0]
		programExecutionId := args[1]
		programExecutionName := args[2]
		idEntity := args[3]
		entityValue := args[4]

	

     wasGeneratedBy := &wasGeneratedBy{docType, idWasGeneratedBy, programExecutionId, programExecutionName, idEntity, entityValue }

	 wasGeneratedByAsBytes, _ := json.Marshal(wasGeneratedBy)
	err := APIstub.PutState(args[0], wasGeneratedByAsBytes)
	if err != nil {
		return shim.Error(fmt.Sprintf("Failed to record program catch: %s", args[0]))
	}

	return shim.Success(nil)
}









/*
 * The queryAllWorkflow method *
allows for assessing all the records added to the ledger(all tuna catches)
This method does not take any arguments. Returns JSON string containing results. 
 */
 /*func (s *SmartContractBlockflow) queryAllWorkflow(APIstub shim.ChaincodeStubInterface) sc.Response {

	startKey := "0"
	endKey := "999"

	resultsIterator, err := APIstub.GetStateByRange(startKey, endKey)
	
	if err != nil {
		return shim.Error(err.Error())
	}
	defer resultsIterator.Close()

	// buffer is a JSON array containing QueryResults
	var buffer bytes.Buffer
	buffer.WriteString("[")

	bArrayMemberAlreadyWritten := false
	for resultsIterator.HasNext() {
		queryResponse, err := resultsIterator.Next()
		if err != nil {
			return shim.Error(err.Error())
		}
		// Add comma before array members,suppress it for the first array member
		if bArrayMemberAlreadyWritten == true {
			buffer.WriteString(",")
		}
		buffer.WriteString("{\"Key\":")
		buffer.WriteString("\"")
		buffer.WriteString(queryResponse.Key)
		buffer.WriteString("\"")

		buffer.WriteString(", \"Record\":")
		// Record is a JSON object, so we write as-is
		buffer.WriteString(string(queryResponse.Value))
		buffer.WriteString("}")
		bArrayMemberAlreadyWritten = true
	}
	buffer.WriteString("]")

	fmt.Printf("- queryAllWorkflow:\n%s\n", buffer.String())

	return shim.Success(buffer.Bytes())
}*/

func (s *SmartContractBlockflow) queryBlockflow(stub shim.ChaincodeStubInterface, args []string) sc.Response {

	//   0
	// "queryString"
	if len(args) < 1 {
		return shim.Error("Incorrect number of arguments. Expecting 1")
	}

	queryString := args[0]

	queryResults, err := getQueryResultForQueryString(stub, queryString)
	if err != nil {
		return shim.Error(err.Error())
	}
	return shim.Success(queryResults)
}



func getQueryResultForQueryString(stub shim.ChaincodeStubInterface, queryString string)([] byte, error) {
	fmt.Printf("- getQueryResultForQueryString queryString:\n%s\n", queryString)
	
	resultsIterator, err := stub.GetQueryResult(queryString)
	
    defer resultsIterator.Close()
    if err != nil {
        return nil, err
    }
    // buffer is a JSON array containing QueryRecords
    var buffer bytes.Buffer
    buffer.WriteString("[")
    bArrayMemberAlreadyWritten := false
    for resultsIterator.HasNext() {
        queryResponse,
        err := resultsIterator.Next()
        if err != nil {
            return nil, err
        }
        // Add a comma before array members, suppress it for the first array member
        if bArrayMemberAlreadyWritten == true {
            buffer.WriteString(",")
        }
        buffer.WriteString("{\"Key\":")
        buffer.WriteString("\"")
        buffer.WriteString(queryResponse.Key)
        buffer.WriteString("\"")
        buffer.WriteString(", \"Record\":")
        // Record is a JSON object, so we write as-is
        buffer.WriteString(string(queryResponse.Value))
        buffer.WriteString("}")
        bArrayMemberAlreadyWritten = true
    }
    buffer.WriteString("]")
    fmt.Printf("- getQueryResultForQueryString queryResult:\n%s\n", buffer.String())
	
	return buffer.Bytes(), nil
}

/*
 * main function *
calls the Start function 
The main function starts the chaincode in the container during instantiation.
 */
 func main() {

	// Create a new Smart Contract
	err := shim.Start(new(SmartContractBlockflow))
	if err != nil {
		fmt.Printf("Error creating new Smart Contract: %s", err)
	}
}