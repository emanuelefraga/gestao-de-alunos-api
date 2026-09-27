import { api } from '../helpers/api.js'
import { expect } from 'chai';
import { comTokenDeAdmin, comTokenDeAluno } from '../helpers/auth.js';
import { novoAluno } from '../factories/alunosFactory.js';
import { novaDisciplina } from '../factories/disciplinasFactory.js';
import trabalhosDaDisciplina from '../fixtures/trabalhos.json' with { type: 'json' };

describe("Entrega de Trabalho da Disciplina por um Aluno", () => {

    //Antes de rodar esse IT, tenha o email admin@escola.com e a senha admin123 cadastrados no banco.
    //Não ter no banco de dados uma aluna com o email ana.souza.1004@example.com e a matrícula 2024094.
    //Não ter uma disciplina com o código PC104

    it("Validar que um aluno entregou um trabalho da disciplina", async () => {
        
        //Cadastrar o Aluno
        const dadosAluno = novoAluno();

        const cadastroAlunoResposta = await api()
            .post("/api/admin/alunos")
            .set("Content-Type", "application/json")
            .set("Authorization", await comTokenDeAdmin())
            .send(dadosAluno);

        const alunoId = cadastroAlunoResposta.body.id;

        //Cadastrar a Disciplina
        const cadastroDisciplinaResposta = await api()
            .post("/api/admin/disciplinas")
            .set("Content-Type", "application/json")
            .set("Authorization", await comTokenDeAdmin())
            .send(novaDisciplina());

        const disciplinaId = cadastroDisciplinaResposta.body.id;

        //Matricular o aluno
        const cadastroMatriculaResposta = await api()
            .post(`/api/admin/disciplinas/${disciplinaId}/matriculas`)
            .set("Content-Type", "application/json")
            .set("Authorization", await comTokenDeAdmin())
            .send({
                alunoId: alunoId
            });

        //Validações de Cadastro e Matrícula de Aluno
        expect(cadastroMatriculaResposta.status).to.equal(201);
        expect(cadastroMatriculaResposta.body.alunoId).to.equal(alunoId);
        expect(cadastroMatriculaResposta.body.disciplinaId).to.equal(disciplinaId);

        //Logar com o aluno
        const tokenAluno = await comTokenDeAluno(
            dadosAluno.email,
            dadosAluno.senha
            );

        //Cadastrar Trabalho como Aluno
        const trabalho = trabalhosDaDisciplina[0];

        const cadastroTrabalhoResposta = await api()
            .post(`/api/alunos/${alunoId}/trabalhos`)
            .set("Content-Type", "application/json")
            .set("Authorization", tokenAluno)
            .send({
                disciplinaId: disciplinaId,
                titulo: trabalho.titulo,
                descricao: trabalho.descricao
            });

        //Validações da entrega do trabalho
        expect(cadastroTrabalhoResposta.status).to.equal(201);
        expect(cadastroTrabalhoResposta.body.alunoId).to.equal(alunoId);
        expect(cadastroTrabalhoResposta.body.disciplinaId).to.equal(disciplinaId);
        expect(cadastroTrabalhoResposta.body.titulo).to.equal(trabalho.titulo);
        expect(cadastroTrabalhoResposta.body.descricao).to.equal(trabalho.descricao);
        expect(cadastroTrabalhoResposta.body.status).to.equal(trabalho.statusDeEntrega.toLowerCase());
  });

});
