
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
        var client = this.client();
        var trans = ConstructTransaction(client, {
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
        
        client.TransactionFlow(trans, function (GetSRes) {
            console.log(GetSRes.smart_contract_result);
            result(GetSRes.smart_contract_result.v_string);
            //result('OK');
        });
    }

    deploySmartContract(smartContractCode) {
        if(smartContractCode == '')
            smartContractCode = "import java.util.ArrayList; " + 
                "public class Contract extends SmartContract { " +
                "private final ArrayList<String> list; " +
             
                "public Contract() { " +
                "    list = new ArrayList<>(); " +
                "} " +
            
                "public String hello() { " +
                "    return \"hello\"; " +
                "} " +
            
                "public void addRange(){ " +
                "    for(int i = 0; i < 10000; i++) { " +
                "        list.add(i + \"00000\"); " +
                "    } " +
                "} " +
            
                "public int count(){ " +
                "    return list.size(); " +
                "} " +
            "}";
        
        var client = this.client();
        
        let Trans = ConstructTransaction(client, {
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
        client.TransactionFlow(Trans, function (r) {
            console.log(r);
        });
    }
}

