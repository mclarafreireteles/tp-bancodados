import inquirer from 'inquirer';
import * as services from './services.js';

const mainMenu = async () => {
    const { action } = await inquirer.prompt({
        type: 'list',
        name: 'action',
        message: 'O que você quer fazer?',
        choices: [
            // Operações de Inserção
            '1. Criar Apostador',
            '2. Criar Administrador',
            '3. Criar Evento',
            '4. Fazer Aposta',
            new inquirer.Separator(),
            // Operações de Leitura
            '5. Listar Todos os Usuários',
            '6. Ver Eventos Pendentes',
            '7. Ver Apostas de um Evento',
            new inquirer.Separator(),
            // Operações de Atualização
            '8. Atualizar Resultado de um Evento',
            '9. Atualizar Saldo de um Apostador',
            new inquirer.Separator(),
            // Operações de Remoção
            '10. Remover Aposta',
            '11. Remover Evento',
            new inquirer.Separator(),
            'Sair'
        ]
    });

    switch (action) {
        case '1. Criar Apostador':
            const userAnswers = await inquirer.prompt([
                { name: 'first_name', message: 'Primeiro Nome:' },
                { name: 'last_name', message: 'Sobrenome:' },
                { name: 'email', message: 'Email:' },
                { name: 'password', message: 'Senha:', type: 'password' },
            ]);
            try {
                const newGambler = await services.createGamblerWithUser(userAnswers);
                console.log('Apostador criado com sucesso:', newGambler.id);
            } catch (error) {
                console.error('Erro ao criar apostador:', error.message);
            }
            break;
        
        case '2. Criar Administrador':
            const { userId: adminId } = await inquirer.prompt({
                name: 'userId',
                message: 'ID do Usuário a ser transformado em administrador:',
                validate: (value) => {
                    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);
                    return isUUID || 'Por favor, insira um UUID válido.';
                }
            });
            try {
                const newAdmin = await services.createAdmin(adminId);
                console.log('Administrador criado com sucesso:', newAdmin.id);
            } catch (error) {
                console.error('Erro ao criar administrador:', error.message);
            }
            break;
        
        case '3. Criar Evento':
            const eventAnswers = await inquirer.prompt([
                { name: 'sport', message: 'Esporte:' },
                { name: 'description', message: 'Descrição:' },
                { name: 'expected_result', message: 'Resultado esperado:' },
                { 
                    name: 'admin_id', 
                    message: 'ID do Admin:',
                    validate: (value) => {
                        const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);
                        return isUUID || 'Por favor, insira um UUID de Admin válido.';
                    }
                },
            ]);
            try {
                const newEvent = await services.createEvent(eventAnswers);
                console.log('Evento criado com sucesso:', newEvent.id);
            } catch (error) {
                console.error('Erro ao criar evento:', error.message);
            }
            break;

        case '4. Fazer Aposta':
            const betAnswers = await inquirer.prompt([
                { 
                    name: 'gambler_id', 
                    message: 'ID do Apostador:',
                    validate: (value) => {
                        const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);
                        return isUUID || 'Por favor, insira um UUID de Apostador válido.';
                    }
                },
                { 
                    name: 'event_id', 
                    message: 'ID do Evento:',
                    validate: (value) => {
                        const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);
                        return isUUID || 'Por favor, insira um UUID de Evento válido.';
                    }
                },
                { name: 'expected_result', message: 'Resultado esperado:' },
                { 
                    name: 'value', 
                    message: 'Valor da aposta:',
                    validate: (value) => !isNaN(parseFloat(value)) || 'Insira um valor numérico.'
                },
            ]);

            try {
                const newBet = await services.createBet(betAnswers);
                console.log('Aposta registrada com sucesso:', newBet.id);
            } catch (error) {
                console.error('Erro ao registrar aposta:', error.message);
            }
            break;

        case '5. Listar Todos os Usuários':
            const allUsers = await services.getAllUsers();
            console.log('--- Usuários Cadastrados ---');
            console.table(allUsers);
            break;

        case '6. Ver Eventos Pendentes':
            const pendingEvents = await services.getPendingEvents();
            console.log('--- Eventos Pendentes ---');
            console.table(pendingEvents);
            break;

        case '7. Ver Apostas de um Evento':
            const { eventId } = await inquirer.prompt({ 
                name: 'eventId', 
                message: 'ID do Evento:',
                validate: (value) => {
                    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);
                    return isUUID || 'Por favor, insira um UUID válido (ex: f81d4fae-7dec-11d0-a765-00a0c91e6bf6)';
                }
            });
            const bets = await services.getBetsByEvent(eventId);
            console.log(`--- Apostas do Evento ${eventId} ---`);
            console.table(bets);
            break;

        case '8. Atualizar Resultado de um Evento':
            const updateAnswers = await inquirer.prompt([
                { name: 'eventId', message: 'ID do Evento:' },
                { name: 'result', message: 'Resultado Final:' },
                { name: 'status', message: 'Status (completed ou cancelled):' },
            ]);
            try {
                const updatedEvent = await services.updateEventResult(updateAnswers.eventId, updateAnswers.result, updateAnswers.status);
                console.log('Evento atualizado com sucesso:', updatedEvent);
            } catch (error) {
                console.error('Erro ao atualizar evento:', error.message);
            }
            break;

        case '9. Atualizar Saldo de um Apostador':
            const balanceAnswers = await inquirer.prompt([
                { name: 'gamblerId', message: 'ID do Apostador:' },
                { name: 'value', message: 'Valor a adicionar/subtrair:' },
            ]);
            try {
                const updatedGambler = await services.updateGamblerBalance(balanceAnswers.gamblerId, parseFloat(balanceAnswers.value));
                console.log('Saldo atualizado com sucesso:', updatedGambler);
            } catch (error) {
                console.error('Erro ao atualizar saldo:', error.message);
            }
            break;

        case '10. Remover Aposta':
            const { betId } = await inquirer.prompt({ name: 'betId', message: 'ID da Aposta a ser removida:' });
            try {
                const deletedBet = await services.deleteBet(betId);
                console.log('Aposta removida com sucesso:', deletedBet.id);
            } catch (error) {
                console.error('Erro ao remover aposta:', error.message);
            }
            break;

        case '11. Remover Evento':
            const { eventIdToDelete } = await inquirer.prompt({ name: 'eventIdToDelete', message: 'ID do Evento a ser removido:' });
            try {
                const deletedEvent = await services.deleteEvent(eventIdToDelete);
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