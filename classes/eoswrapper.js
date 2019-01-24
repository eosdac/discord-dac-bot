const config = require("../config.json");
const { Api, JsonRpc, Serialize } = require('eosjs');
const { TextDecoder, TextEncoder } = require('text-encoding');
const fetch = require('node-fetch');
const chainid = config.chain.chainId;
const rpc = new JsonRpc(config.chain.httpEndpoint, { fetch });
const Eos = new Api({rpc, chainid, textDecoder: new TextDecoder(), textEncoder: new TextEncoder(), Serialize} );
const axios = require('axios');

class EosWrapper {

    constructor(){
        this.eos = Eos;
    }

    async getActions(accountname){
        let requestAddress = `${config.chain.historyEndpoint}/v1/history/get_actions/${accountname}?skip=0&limit=100`;
        let actions = await axios.get(requestAddress)
        .then(data => {
            return data.data.actions;
        }).catch(err => {console.log(err); return []; } );
        return actions;
    }

    async getAccount(accountname){
        return this.eos.rpc.get_account(accountname).then(x => x).catch(e => false);
    }

    async getBalance(contract, accountname, symbol){
        return this.eos.rpc.get_currency_balance( contract, accountname, symbol ).catch(e=> false) ;
    }

    async isMember(accountname){
        let res =  await this.eos.rpc.get_table_rows({
            json: true,
            code: config.dac.token.contract,
            scope: config.dac.token.contract,
            lower_bound: accountname,
            table: 'members',
            limit: 1
        }).catch(e=> false);

        if(res && res.rows[0].sender === accountname){
            return res.rows[0];
        }
        else{
            return false;
        }
    }

    async getTokenStats(){
        let res =  await this.eos.rpc.get_table_rows({
            json: true,
            code: config.dac.token.contract,
            scope: config.dac.token.symbol,
            table: 'stat',
            limit: 1
        }).catch(e=> false );

        if(res.rows){
            return res.rows[0];
        }
        else{
            return false;
        }
    }

    async getVotes(accountname){
        let res =  await this.eos.rpc.get_table_rows({
            json: true,
            code: config.dac.custodian.contract,
            scope: config.dac.custodian.contract,
            lower_bound: accountname,
            table: 'votes',
            limit: 1
        }).catch(e=> false );

        if(res && res.rows[0].voter === accountname){
            return res.rows[0].candidates;
        }
        else{
            return false;
        }
    }

    async getCustodians(){
        let res =  await this.eos.rpc.get_table_rows({
            json: true,
            code: config.dac.custodian.contract,
            scope: config.dac.custodian.contract,
            table: 'custodians',
            limit: 12
        }).catch(e=> false);

        if(res && res.rows[0]){
            return res.rows;
        }
        else{
            return false;
        }
    }

    async isCustodian(accountname){
        let custodians = (await this.getCustodians() ).map(c => c.cust_name);
        return custodians.includes(accountname);
    }

    async getCandidates(){
        let res =  await this.eos.rpc.get_table_rows({
            json: true,
            code: config.dac.custodian.contract,
            scope: config.dac.custodian.contract,
            table: 'candidates',
            limit: -1
        }).catch(e=> false);

        if(res && res.rows[0]){
            return res.rows;
        }
        else{
            return false;
        }
    }
}

module.exports = EosWrapper;