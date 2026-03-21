const amqp = require("amqplib");

async function receiveMail(){
    try{
        const connection = await amqp.connect("amqp://localhost");
        const channel = await connection.createChannel();
        const exchange = "notification_exchange";
        const queueName = "order_queue";

        await channel.assertExchange(exchange, "topic", { durable: false });
        
        //making queue and binding
        await channel.assertQueue(queueName, { durable: false }); 
        await channel.bindQueue(queueName , exchange , "order.*");  //routingkey pattern - oreder.*

        console.log("Waiting for messages in the queue...");
        channel.consume(queueName , (msg) => {
            if(msg !== null){
                console.log(`routing key : ${msg.fields.routingKey} , message : ${(msg.content.toString())}`);
                channel.ack(msg);
            }
        },
        { noAck: false} 
    );
    }
    catch(err){
        console.log("Error" , err);
    }   
}

receiveMail();