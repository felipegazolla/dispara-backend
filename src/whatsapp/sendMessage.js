import client from './client.js';
import { connection } from '../database/knex/knex.js';

export async function sendMessage(numero, mensagem, enviadoPor) {
  try {
    if (!numero || !mensagem || !enviadoPor) {
      throw new Error('Os campos "numero", "mensagem" e "enviadoPor" são obrigatórios.');
    }

    const numeroComCodigo = `${numero}@c.us`;

    if (!client || !client.info) {
      throw new Error('Cliente WhatsApp não inicializado ou autenticado.');
    }

    await client.sendMessage(numeroComCodigo, mensagem);
    console.log(`Mensagem enviada para ${numero}: "${mensagem}"`);

    await connection('messages').insert({
      destination_number: numero,
      message: mensagem,
      status: 'send',
      user_id: enviadoPor,
      sended_at: new Date(),
    });

    console.log('Mensagem registrada no banco de dados com sucesso.');
  } catch (error) {
    console.error('Erro ao enviar mensagem:', error);

    try {
      await connection('messages').insert({
        destination_number: numero,
        message: mensagem || 'Mensagem não fornecida',
        status: 'falha',
        user_id: enviadoPor || 'Usuário não especificado',
        sended_at: new Date(),
      });
      console.log('Falha registrada no banco de dados.');
    } catch (dbError) {
      console.error('Erro ao registrar falha no banco de dados:', dbError);
    }
  }
}
