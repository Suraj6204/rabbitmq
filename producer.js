const amqp = require("amqplib");

async function sendMail(){
    try{
        const connection = await amqp.connect("amqp://localhost");
        const channel = await connection.createChannel();

        const exchange = "mail_exchange";
        const routingKey = "send_mail";
        const msg = {
            to: "user2@example.com",
            from: "sender@example.com",
            subject: "Test Email",
            text: "This is a test email."
        };

        await channel.assertExchange(exchange,"direct", {durable : false});
        await channel.assertQueue("mail_queue" , {durable:false});

        //binding the queue to the exchange with a routing key
        await channel.bindQueue("mail_queue", exchange , routingKey);
         
        //sending data from exhange to the queue 
        channel.publish(exchange, routingKey, Buffer.from(JSON.stringify(msg)));
        console.log("Message sent to the queue" , msg);

        setTimeout(() => {
            connection.close();
        }, 500);
    }
    catch(err){
        console.log(err);
    }
}

sendMail();