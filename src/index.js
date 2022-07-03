const dialogFunctions = require("./controllers/dialogFunctions");
const intentMap = require('./intentMap');


const bot = (request, response) => {
  const { intent, session, parameters, data } = dialogFunctions(request);

  const intentMapped = intentMap.get(intent);
  return intentMapped(response, { session, parameters, data });

};

module.exports = bot;
