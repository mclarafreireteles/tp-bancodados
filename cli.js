// cli.js
import inquirer from 'inquirer';
import * as services from './services.js';

const mainMenu = async () => {
    const { action } = await inquirer.prompt({
        type: 'list',
        name: 'action',
        message: 'O que você quer fazer?',
        choices: [
            // Operações de Inserção
            '1. Criar Usuário',
            '2. Criar Evento',
            // Operações de Leitura
            '3. Listar Todos os Usuários',
            '4. Ver Eventos Pendentes',
            '5. Ver Apostas de um Evento',
            // Operações de Atualização
            '6. Atualizar Resultado de um Evento',
            '7. Atualizar Saldo de um Apostador',
            // Operações de Remoção
            '8. Remover Aposta',
            '9. Remover Evento',
            new inquirer.Separator(),
            'Sair'
        ]
    });

    switch (action) {
        case '1. Criar Usuário':
            const userAnswers = await inquirer.prompt([
                { name: 'first_name', message: 'Primeiro Nome:' },
                { name: 'last_name', message: 'Sobrenome:' },
                { name: 'email', message: 'Email:' },
                { name: 'password', message: 'Senha:', type: 'password' },
            ]);
            try {
                const newUser = await services.createUser(userAnswers); // CORRIGIDO
                console.log('Usuário criado com sucesso:', newUser.id);
            } catch (error) {
                console.error('Erro ao criar usuário:', error.message);
            }
            break;
        
        case '2. Criar Evento':
            const eventAnswers = await inquirer.prompt([
                { name: 'sport', message: 'Esporte:' },
                { name: 'description', message: 'Descrição:' },
                { name: 'expected_result', message: 'Resultado esperado:' },
                { name: 'admin_id', message: 'ID do Admin:' },
            ]);
            try {
                const newEvent = await services.createEvent(eventAnswers); // CORRIGIDO
                console.log('Evento criado com sucesso:', newEvent.id);
            } catch (error) {
                console.error('Erro ao criar evento:', error.message);
            }
            break;

        case '3. Listar Todos os Usuários':
            const allUsers = await services.getAllUsers(); // CORRIGIDO
            console.log('--- Usuários Cadastrados ---');
            console.table(allUsers);
            break;

        case '4. Ver Eventos Pendentes':
            const pendingEvents = await services.getPendingEvents(); // CORRIGIDO
            console.log('--- Eventos Pendentes ---');
            console.table(pendingEvents);
            break;

        case '5. Ver Apostas de um Evento':
            const { eventId } = await inquirer.prompt({ name: 'eventId', message: 'ID do Evento:' });
            const bets = await services.getBetsByEvent(eventId); // CORRIGIDO
            console.log(`--- Apostas do Evento ${eventId} ---`);
            console.table(bets);
            break;

        case '6. Atualizar Resultado de um Evento':
            const updateAnswers = await inquirer.prompt([
                { name: 'eventId', message: 'ID do Evento:' },
                { name: 'result', message: 'Resultado Final:' },
                { name: 'status', message: 'Status (completed ou cancelled):' },
            ]);
            try {
                const updatedEvent = await services.updateEventResult(updateAnswers.eventId, updateAnswers.result, updateAnswers.status); // CORRIGIDO
                console.log('Evento atualizado com sucesso:', updatedEvent);
            } catch (error) {
                console.error('Erro ao atualizar evento:', error.message);
            }
            break;

        case '7. Atualizar Saldo de um Apostador':
            const balanceAnswers = await inquirer.prompt([
                { name: 'gamblerId', message: 'ID do Apostador:' },
                { name: 'value', message: 'Valor a adicionar/subtrair:' },
            ]);
            try {
                const updatedGambler = await services.updateGamblerBalance(balanceAnswers.gamblerId, parseFloat(balanceAnswers.value)); // CORRIGIDO
                console.log('Saldo atualizado com sucesso:', updatedGambler);
            } catch (error) {
                console.error('Erro ao atualizar saldo:', error.message);
            }
            break;

        case '8. Remover Aposta':
            const { betId } = await inquirer.prompt({ name: 'betId', message: 'ID da Aposta a ser removida:' });
            try {
                const deletedBet = await services.deleteBet(betId); // CORRIGIDO
                console.log('Aposta removida com sucesso:', deletedBet.id);
            } catch (error) {
                console.error('Erro ao remover aposta:', error.message);
            }
            break;

        case '9. Remover Evento':
            const { eventIdToDelete } = await inquirer.prompt({ name: 'eventIdToDelete', message: 'ID do Evento a ser removido:' });
            try {
                const deletedEvent = await services.deleteEvent(eventIdToDelete); // CORRIGIDO
                console.log('Evento removido com sucesso:', deletedEvent.id);
            } catch (error) {
                console.error('Erro ao remover evento:', error.message);
            }
            break;

        case 'Sair':
            console.log('Saindo da aplicação...');
            process.exit();
    }

    mainMenu();
};

mainMenu();