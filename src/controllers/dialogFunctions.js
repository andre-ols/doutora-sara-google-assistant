module.exports = function dialogFunction(request) {
    const agent = request.body.queryResult;
    const intent = agent.intent.displayName;
    const fullSession = request.body.session;
    const session = fullSession.replace("projects/botaula-lfkkan/agent/sessions/", "");
    let data = {};
    if(agent.outputContexts){
      data = agent.outputContexts.filter( context => context.name ==  `${fullSession}/contexts/doutora_sara`);
      data = data[0].parameters;
    }

    return {
      parameters: agent.parameters,
      session,
      intent,
      data
    }
  };
  