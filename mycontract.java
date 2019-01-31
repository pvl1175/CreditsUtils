import java.util.ArrayList;

public class Contract extends SmartContract {
    private final ArrayList<String> list;

    public Contract() {
        list = new ArrayList<>();
    }

    public String hello() {
        return "hello";
    }

    public void addRange(){
        for(int i = 0; i < 10000; i++) {
            list.add(i + "00000");
        }
    }

    public int count(){
        return list.size();
    }
}
