
class CreditsUtils {

    constructor(publicKey, privateKey, url) {
        this.publicKey = publicKey;
        this.privateKey = privateKey;
        this.url = url;

        this.publicKeyByte = Base58.decode(this.publicKey);
        this.privateKeyByte = Base58.decode(this.privateKey);
    }

    client() {
        var transport = new Thrift.Transport(this.url);
        var protocol = new Thrift.Protocol(transport);
        return new APIClient(protocol);
    }

    walletGetBalance() {
        return this.client().WalletBalanceGet(this.publicKeyByte).balance;
    }
 
    executeSmartContractMethod(smartContract, method, result) {
        var trans = ConstructTransaction(this.client(), {
            amount: 0.0,
            fee: 1.0,
            source: this.publicKeyByte,
            Priv: this.privateKeyByte,
            target: smartContract,
            smart: {
                method: method,
                params: [],
                forgetNewState: false
            }
        });
        
        this.client().TransactionFlow(trans, function (GetSRes) {
            result(GetSRes.smart_contract_result.v_string);
        });
    }

    deploySmartContract(smartContractCode) {
        if(smartContractCode == '')
            smartContractCode = "public class Contract extends SmartContract { public Contract() {} public String getString() { return \"Hello!!!\"; }}";
            
        let Trans = ConstructTransaction(this.client(), {
            amount: "0,0",
            currency: 1,
            fee: "1.0",
            source:this.publicKeyByte,
            Priv: this.privateKeyByte,
            smart: {
                method: "",
                params: [],
                forgetNewState: false,
                code: smartContractCode
            }
        });
    
        if (Trans === null) {
            alert("Transaction failure");
            return;
        }
    
        var publicKey = Base58.encode(Trans.target);
        console.log(publicKey);
        this.client().TransactionFlow(Trans, function (r) {
            console.log(r);
        });
    }
}

