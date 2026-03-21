/*
TOPIC EXCHANGE FLOW

PRODUCER -> EXCHANGE (DIRECT) -- (ROUTINGKEY with pattern) -> QUEUE (mail_queue) -> CONSUMER
                            \                               
                             \
                              -- (ROUTINGKEY with pattern) -> QUEUE (subscribed_users_mail_queue) -> SUBSCRIBER CONSUMER

*/
const amqp = require("amqplib");

async function sendMail(routingKey , message){
    try{
        const connection = await amqp.connect("amqp://localhost");
        const channel = await connection.createChannel();
        const exchange = "notification_exchange";
        const exchangeType = "topic";

        //making the exchange of type topic 
        //durable false means that the exchange will not survive a broker restart
        await channel.assertExchange(exchange, exchangeType, { durable: false });

        //TOPIC ME QUEUE MAKING AND BINDING CONSUMER KRTA H

        channel.publish(exchange , routingKey , Buffer.from(JSON.stringify(message)) , {persistent: true});
        console.log(`Message sent to the exchange with routing key ${routingKey}:`, message);

        setTimeout(() => {
            connection.close();
        }, 500);
    }
    catch(err){
        console.log("Error" , err);
    }
}

sendMail("order.placed" , {orderId: 12345 , status: "placed"});
sendMail("payment.processed" , {orderId: 67890 , status: "processed"});