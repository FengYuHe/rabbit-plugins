const PromiseA = require('bluebird');
const errs = require('errs');
const debug = require('debug')('rabbit:service:rpc:hash*');
var amqp = require('amqplib/callback_api');

class Connect {
    constructor(url) {
        this.url = url;
        this.$promise = new PromiseA((resolve, reject) => {
            this._$promise = {resolve, reject}
        });
    }

    async _connect() {
        let conn = await PromiseA.fromCallback(cb => amqp.connect(this.url, cb)).catch(e => {
            debug(e);
            return null;
        });
        if (!conn) {
            throw errs.create({
                type: 'CONNECT_FAILURE',
                code: 400,
                status: 400,
                message: 'Connect to rpc server bus failure'
            });
        }

        this.conn = conn;
    }

    start() {
        this._connect().then(() => {
            this._$promise && this._$promise.resolve();
            this._$promise = null;
            this._start && this._start()
        })
    }
}

module.exports = Connect;
