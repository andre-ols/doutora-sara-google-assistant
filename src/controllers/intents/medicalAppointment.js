const Database = require("../../database");
const database = new Database();

async function specialties(response ,dialogFunctions) {

    // Recuperando os parametros
    const { parameters, session } = dialogFunctions;
    const { specialty:  specialtyName  } = parameters;

    const { id } = await database.specialty(specialtyName);

    return response.json({
        fulfillmentText:
        'Me diga seu plano'+
        '\nCaso seja uma consulta particular, basta dizer particular',
        outputContexts: [
            {
              name: `projects/botaula-lfkkan/agent/sessions/${session}/contexts/doutora_sara`,
              lifespanCount: 99,
              parameters: {
                  specialty_id: id,
                  specialty: specialtyName
              }
            }
          ]
      });
}

async function plan(response, dialogFunctions) {

    // Recuperando os parametros
    const { parameters, session, data } = dialogFunctions;
    const { plan } = parameters;

    const { id } = await database.plan(plan);

    const doctors = await database.doctors(id, data.specialty_id);

    let stringDoctors = '';

    if ( !doctors.length )
        return response.json({
            followupEventInput: {
                name: "plan"
            }
        });

    doctors.map( doctor => {
        stringDoctors = stringDoctors + `${doctor.name}\n`
    });

    return response.json({
        fulfillmentText:
        `${ data.specialty } que atendem ${ plan } são:`+
        `\n${stringDoctors}`+
        '\n\nPor qual médico deseja ser atendido?',
        outputContexts: [
            {
              name: `projects/botaula-lfkkan/agent/sessions/${session}/contexts/doutora_sara`,
              lifespanCount: 99,
              parameters: { plan, plan_id: id, doctors_plan: doctors }
            }
          ]
      });
}

async function doctor(response, dialogFunctions) {

    // Recuperando os parametros
    const { parameters, session, data } = dialogFunctions;
    const { doctor:  nameDoctor } = parameters;

    const validateDoctors = data.doctors_plan.find( doctor => doctor.name === nameDoctor);

    if ( !validateDoctors )
        return response.send({
            followupEventInput: {
                name: "doctor"
            },
        });

    const calendars = await database.calendars(validateDoctors.id);

    if(calendars.error) {
        console.log("Erro na função doctor");
        console.log("calnedars.error");
        console.log(calendars.error);
        return response.send({ 
            fulfillmentText: 'Desculpe, tive um erro ao marcar a consulta\n'+
            'Mas você pode marcar sua consulta enviando uma mensagem para o nosso whatsapp' 
        })
    }

    let stringCalendars = '';

    calendars.map( calendar => {
        let date = new Date(calendar.date);

        let day  = date.getDate().toString();
        day = (day.length == 1) ? '0' + day : day;

        let month  = (date.getMonth()+1).toString(); 
        month = (month.length == 1) ? '0' + month : month

        stringCalendars = stringCalendars + `${calendar.day}, dia ${day}/${month}\n`
    })

    return response.json({
        fulfillmentText:
        `${ validateDoctors.name } atende nos seguintes dias:`+
        `\n${stringCalendars}`+
        '\n\nQual dia você prefere?',
        outputContexts: [
            {
              name: `projects/botaula-lfkkan/agent/sessions/${session}/contexts/doutora_sara`,
              lifespanCount: 99,
              parameters: { calendars, doctor: validateDoctors.name, doctor_id: validateDoctors.id}
            }
          ]
      });
}

async function calendarDay(response, dialogFunctions) {

    // Recuperando os parametros
    const { parameters, session, data } = dialogFunctions;
    const { day: stringDay } = parameters;

    const validateCalendars = data.calendars.filter( calendar => calendar.day == stringDay );

    if ( !validateCalendars )
        return { event: 'calendar_day' };

    const { day, shift, date } = validateCalendars[0];

    if ( validateCalendars.length > 1 )
        return response.json({
            fulfillmentText:
            `Na ${day}, os turnos da manhã e da tarde estão disponíveis `+
            '\nEm qual turno deseja ser atendido?',
            outputContexts: [
                {
                name: `projects/botaula-lfkkan/agent/sessions/${session}/contexts/doutora_sara`,
                lifespanCount: 99,
                parameters: { day, date }
                }
            ]
        });
    
    return response.json({
        fulfillmentText:
        `Na ${day}, o único turno disponivel é pela ${shift}`+
        `\nPara confirmar no turno da ${shift} diga a palavra ${shift}`+
        '\nCaso queira mudar a data, basta dizer voltar',
        outputContexts: [
            {
            name: `projects/botaula-lfkkan/agent/sessions/${session}/contexts/doutora_sara`,
            lifespanCount: 99,
            parameters: { day, date }
            }
        ]
    });

    
}

async function calendarShift(response, dialogFunctions) {

    // Recuperando os parametros
    const { parameters, session, data } = dialogFunctions;
    const { shift: stringShift } = parameters;

    const validateCalendars = data.calendars.find( calendar => { 
        if ( calendar.day == data.day && calendar.shift == stringShift )
            return calendar;
    });

    if ( !validateCalendars )
        return { event: 'calendar_shift' };

    const { shift } = validateCalendars;

    data.shift = shift;

    if(data.name)
        return await checkOut(response, session, data);

    return response.json({
        followupEventInput: {
            name: "register"
        },
        outputContexts: [
            {
            name: `projects/botaula-lfkkan/agent/sessions/${session}/contexts/doutora_sara`,
            lifespanCount: 99,
            parameters: { shift }
            }
        ]
    });
}

async function checkOut(response, session, data) {

    const { plan, day, shift, date, doctor, specialty, name } = data;

    if( !( day && shift && plan && date && doctor && name && specialty ) ){
        return response.json({
            followupEventInput:{
                name: 'error'
            }
        });
    }

    const dateResponse = new Date(data.date);
    let dayDATE  = dateResponse.getDate().toString();
    dayDATE = (dayDATE.length == 1) ? '0' + dayDATE : dayDATE;

    let monthDATE  = (dateResponse.getMonth()+1).toString(); 
    monthDATE = (monthDATE.length == 1) ? '0' + monthDATE : monthDATE

    return response.send({
        fulfillmentText: 
        `Deseja confirmar a consulta no ${specialty}, `+
        `com o Médico ${doctor}, `+
        `\nna ${day}, dia ${dayDATE}/${monthDATE}, `+
        `\npelo turno da ${shift}? `+
        '\n\nSe sim, diga confirmar, caso contrário diga refazer',
        outputContexts: [
            {
            name: `projects/botaula-lfkkan/agent/sessions/${session}/contexts/doutora_sara`,
            lifespanCount: 99,
            parameters: data
            }
        ]
        
    });
}

async function finish(response, dialogFunctions) {
    const { session, data } = dialogFunctions;

    const { plan, day, shift, date, doctor, specialty, name } = data;

    if( !( day && shift && plan && date && doctor && name && specialty ) ){
        return response.json({
            followupEventInput: {
                name: 'error'
            }
            
        });
    }


    try {

        await database.sendAPI(data);

        return response.json({
            fulfillmentText: `Solicitação enviada com sucesso, ${data.name}! ✅`
        });
    }
    catch(e){
        console.log(e)
        return { 
            response: 'Tive um erro ao finalizar 😵.\n'+
            'Mas já te passei para o atendente humano 😉' 
        }
    }
}


module.exports = { 
    specialties, 
    plan, doctor, 
    calendarDay,
    calendarShift, 
    checkOut, 
    finish }; 
