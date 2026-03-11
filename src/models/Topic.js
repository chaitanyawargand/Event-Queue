
class Topic{
    constructor(id,name){
        this.id=id;
        this.name=name;
        this.subscribers=new set();
        this.producers=new set();
    }
    addSubsciber(subscribeId){
        this.subscribers.add(subscribeId);
    }
    removeSubscriber(subscribeId){
        this.subscribers.remove(subscribeId);
    }
    addProducer(producerId){
        this.producers.add(producerId);
    }
    getProducer(){
        [...this.producers];
    }
    getSubscriber(){
        [...this.subscribers];
    }
}
module.exports=Topic;