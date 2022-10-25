require('dotenv').config()
const amqp = require('amqplib')
const MailSender = require('./MailSender')
const Listener = require('./Listener')

const init = async () => {
    const mailSender = new MailSender()
    const listener = new Listener(mailSender)

    const connection = await amqp.connect(process.env.RABBITMQ_SERVER)
    const channel = await connection.createChannel()

    await channel.assertQueue('sendEmail:notif', {
        durable: true,
    })

    channel.consume('sendEmail:notif', listener.listen, { noAck: true });
}

init()
