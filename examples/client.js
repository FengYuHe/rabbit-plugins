const Client = require('../').RPCClient;

let client = new Client({url: 'amqp://nevem:nevem@localhost/order', namespace: 'test'});

let i = 0;
let timeInertal = null;
client.on('connected', () => {
    timeInertal = setInterval(async function () {
        i++;
        client.call('add', 1, 2, i).catch(e => {
            return e;
        }).then(result => {
            console.log(JSON.stringify(result) + ':' + i);
        })
    }, 1);
});


client.on('close', function () {
    console.log('client closed')
});

client.on('error', function () {
    console.log('client error')
});

setInterval(async function () {

}, 100000);

