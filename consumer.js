const amqp = require('amqplib');

async function receiveMail() {
    try {
        const connection = await amqp.connect('amqp://localhost');
        const channel = await connection.createChannel();

        //asserting the queue to receive messages
        await channel.assertQueue('mail_queue', { durable: false });

        //consuming messages from the queue
        channel.consume('mail_queue', (msg) => {
            if (msg !== null) {
                console.log('Received message from the queue:', JSON.parse(msg.content)); //parse the msg becoz msg stred as string in queue
                channel.ack(msg); //acknowledging the message after processing
            }
        });
    }
    catch (err) {
        console.log(err);
    }   
}

receiveMail();