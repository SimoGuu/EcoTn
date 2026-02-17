const Person = require('../models/Person');

const LocalLoginController = {
    searchLocalUserBySpidCode: async (spidCode) => {
        return new Promise(async (resolve, reject) => {
            try {
                const localUser = await Person.findOne({
                    identificatore: spidCode
                });

                resolve(localUser);
            } catch (error) {
                resolve(null);
            }
        });
    },
    registerNewLocalUserWithSpidData: async (spidData) => {
        return new Promise(async (resolve, reject) => {
            try {
                await Person.create({
                    nome: spidData["name"],
                    cognome: spidData["familyName"],
                    identificatore: spidData["spidCode"],
                    codiceFiscale: spidData["fiscalNumber"].split("-")[1],
                    isDipendente: false
                });

                resolve(await LocalLoginController.searchLocalUserBySpidCode(spidData["spidCode"]));
            } catch (error) {
                resolve(null);
            }
        })
    }
};

module.exports = LocalLoginController;