require('dotenv').config()
const amqp = require('amqplib')
const MailSender = require('./MailSender')
const Listener = require('./Listener')
const Whatsapp = require('./whatsapp')

const init = async () => {
    const mailSender = new MailSender()
    const listener = new Listener(mailSender)

    const connection = await amqp.connect(process.env.RABBITMQ_SERVER)
    const channel = await connection.createChannel()

    await channel.assertQueue('sendEmail:notif', {
        durable: true,
    })
    
    channel.consume('sendEmail:notif', listener.listen, { noAck: true });

    await channel.assertQueue('sendMail:DWHU', {
        durable: true,
    })

    channel.consume('sendMail:DWHU', listener.listenDWHU, { noAck: true });

    Whatsapp.whatsappInit()

}

init()
