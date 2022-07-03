const Database = require("../../database");
const database = new Database();
const { checkOut } = require("./medicalAppointment");


async function show(response, dialogFunction) {
    const { session } = dialogFunction;

    const data = await database.show(session);

    //Se não encontrar no banco response generico
    if ( !data.name )
        return response.send({
            fulfillmentText: 
            'Olá, eu sou a Doutora Sara, '+
            'a assistente virtual da Clínica Vitória!'+
            '\nPara marcar uma consulta diga CONSULTA',
            outputContexts: [
                {
                  name: `projects/botaula-lfkkan/agent/sessions/${session}/contexts/doutora_sara`,
                  lifespanCount: 99,
                  parameters: data
                }
              ]
        });

    else{
    // Respondendo com dados do banco
        return response.send({
            fulfillmentText: 
            `Olá, ${data.name}! Aqui é a Doutora Sara!`+
            '\nPara marcar uma consulta diga CONSULTA',
            outputContexts: [
                {
                name: `projects/botaula-lfkkan/agent/sessions/${session}/contexts/doutora_sara`,
                lifespanCount: 99,
                parameters: data
                }
            ]
        });
        
    }
}

async function register(response, dialogFunction) {
    const { parameters, session, data } = dialogFunction;
    const { name } = parameters;

    data.name = name;

    const result = await database.createClient(data);

    if (result.error_when_register)
        return response.send({
            followupEventInput: {
                name: "error"
            }
        });
    

    return await checkOut(response, session, data);
}   

module.exports = { show, register };
