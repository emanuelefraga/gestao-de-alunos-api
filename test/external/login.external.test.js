//teste externo, chamamos localmente com a api ligada.
// substitui o app pelo link local.

import request from 'supertest';
import { expect } from 'chai';

describe ('Login', () => {

    before(() => {
        //POST /admin
        //POST / usuario
    })
    it('deve retornar 200 quando o usuário e senha forem corretos', async () => {
        const loginResposta = await request('http://localhost:3000')
            .post('/api/auth/login')
            .set('Content-Type', 'application/json')
            .send({ 'email': 'admin@escola.com','senha': 'admin123' });

        expect(loginResposta.status).to.equal(200);
        expect(loginResposta.body).to.have.property('token');

    
    })

    it('deve retornar 400 quando a senha não for informada', async () => {
        const loginResposta = await request('http://localhost:3000')
            .post('/api/auth/login')
            .set('Content-Type', 'application/json')
            .send({ 'email': 'admin@escola.com','senha': '' });

        expect(loginResposta.status).to.equal(400);
        expect(loginResposta.body.error).to.equal('Os campos "email" e "senha" são obrigatórios.');


    
    })

    it('deve retornar 401 quando a senha for incorreta', async () => {
        const loginResposta = await request('http://localhost:3000')
            .post('/api/auth/login')
            .set('Content-Type', 'application/json')
            .send({ 'email': 'admin@escola.com','senha': 'admin123456' });

        expect(loginResposta.status).to.equal(401);
        expect(loginResposta.body.error).to.equal('E-mail ou senha inválidos.');

    
    })
})