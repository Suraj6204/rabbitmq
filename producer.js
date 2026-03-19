const amqp = require("amqplib");

async function sendMail(){
    try{
        const connection = await amqp.connect("amqp://localhost");
        const channel = await connection.createChannel();

        const exchange = "mail_exchange";

        const routingKeyForUsers = "send_mail_to_users";
        const routingKeyForSubscribedUsers = "send_mail_to_subscribed_users";
        
        const msg = {
            to: "user2@example.com",
            from: "sender@example.com",
            subject: "Test Email",
            text: "This is a test email."
        };

        const msgForSubscribedUsers = {
            to: "subscribed_user1@example.com",
            from: "sender@example.com",
            subject: "Test Email for Subscribed Users",
            text: "This is a test email for subscribed users."
        };

        await channel.assertExchange(exchange,"direct", {durable : false});

        await channel.assertQueue("mail_queue" , {durable:false});
        await channel.assertQueue("subscribed_users_mail_queue" , {durable:false});

        //binding the queue to the exchange with a routing key
        //make two queue 
        await channel.bindQueue("mail_queue", exchange , routingKeyForUsers);
        await channel.bindQueue("subscribed_users_mail_queue", exchange , routingKeyForSubscribedUsers);

        //sending data from exhange to the queue 
        channel.publish(exchange, routingKeyForUsers, Buffer.from(JSON.stringify(msg)));
        channel.publish(exchange, routingKeyForSubscribedUsers, Buffer.from(JSON.stringify(msgForSubscribedUsers)));

        console.log("Message sent to the queue" , msg);
        console.log("Message sent to the subscribed users queue" , msgForSubscribedUsers);

        setTimeout(() => {
            connection.close();
        }, 500);
    }
    catch(err){
        console.log(err);
    }
}

sendMail();