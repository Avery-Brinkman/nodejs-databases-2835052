/* eslint-disable no-useless-constructor */
/* eslint-disable class-methods-use-this */
/* eslint-disable no-empty-function */
const mysql = require('mysql2/promise');
const CoinAPI = require('../CoinAPI');

class MySQLBackend {
    constructor() {
        this.coinAPI = new CoinAPI();
        this.connection = null;
    }

    async connect() {
        this.connection = await mysql.createConnection({
            host: 'localhost',
            port: 3406,
            user: 'root',
            password: '',
            database: 'maxcoin',
        });
        return this.connection;
    }

    async disconnect() {
        return this.connection.end();
    }

    async insert() {
        const data = await this.coinAPI.fetch();
        const sql = 'INSERT INTO coinvalues (valuedate, coinvalue) VALUES ?';
        const values = [];
        Object.entries(data.bpi).forEach((entry) => {
            values.push([entry[0], entry[1]]);
        });
        return this.connection.query(sql, [values]);
    }

    async getMax() {
        return this.connection.query(
            'SELECT * FROM coinvalues ORDER by coinvalue DESC LIMIT 0,1'
        );
    }

    async max() {
        console.info('Connecting to MySQL...');
        console.time('mySQL-connect');
        const connection = this.connect();
        if (connection) {
            console.info('Successfully connected to MySQL');
        } else {
            throw new Error('Connecting to MySQL failed');
        }
        console.timeEnd('mySQL-connect');
        console.info();

        console.info('Inserting into MySQL...');
        console.time('mySQL-insert');
        const insertResult = await this.insert();
        console.timeEnd('mySQL-insert');
        console.info();

        console.info(
            `Inserted ${insertResult[0].affectedRows} documents into MySQL`
        );
        console.info();

        console.info('Querying MySQL...');
        console.time('mySQL-find');
        const result = await this.getMax();
        const row = result[0][0];
        console.timeEnd('mySQL-find');
        console.info();

        console.info('Disconnecting from MySQL...');
        console.time('mySQL-disconnect');
        await this.disconnect();
        console.timeEnd('mySQL-disconnect');
        console.info();

        return row;
    }
}

module.exports = MySQLBackend;
