const { Kafka, CompressionTypes, Partitioners } = require('kafkajs');
const express = require('express');
const { v4: uuid } = require('uuid');
const app = express();
app.use(express.json())

const kafka = new Kafka({
    clientId: 'node-kafka',
    brokers: ['localhost:9092'],
    connectionTimeout: 3000,
    retry: {
      initialRetryTime: 300,
      retries: 3
    }
 });

const producer = kafka.producer({ createPartitioner: Partitioners.JavaCompatiblePartitioner });


app.post('/producer', async (req, res) => {
    const { body } = req;
    await producer.connect();
    const producerResult = await producer.send({
        topic: 'order',
        compression: CompressionTypes.GZIP,
        messages: [
          { 
            headers: { 'correlation-id': uuid() },
            value : JSON.stringify(body) 
          },
        ],
    })


    if (producerResult) {
        res.json({ status : 'Completed'});
    } else {
        res.json({ status : 'Not complete'});
    }

 });

 const consumer = async () => {
    const consumer = kafka.consumer({ groupId: 'node-kafka-group' });
    await consumer.connect();
    await consumer.subscribe({ topic: 'order', fromBeginning: true })
    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        console.log({
          topic,  
          partition,
          offset: message.offset,
          value: message.value.toString(),
        })
      },
    });
}

consumer();
  
app.listen(3000, () => {
    console.log('Start server at port 3000.')
});