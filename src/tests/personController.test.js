const personController = require("../app/controllers/personController");
const Person = require("../app/models/person");

jest.mock("../app/models/person");

describe("Person Controller", () => {

  let req;
  let res;

  const validPersonData = {
    nome: "Mario",
    cognome: "Rossi",
    identificatore: "ID123",
    codiceFiscale: "RSSMRA80A01H501Z",
    isDipendente: true
  };

  beforeEach(() => {
    req = {
      params: {},
      body: {}
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    jest.clearAllMocks();
  });

  test("getPersons - restituisce lista persone", async () => {
    Person.find.mockResolvedValue([validPersonData]);

    await personController.getPersons(req, res);

    expect(Person.find).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith([validPersonData]);
  });

  test("getPersons - errore database", async () => {
    Person.find.mockRejectedValue(new Error("DB error"));

    await personController.getPersons(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalled();
  });

  test("createPerson - creazione riuscita", async () => {
    req.body = validPersonData;

    const mockPersonInstance = {
      ...validPersonData,
      save: jest.fn().mockResolvedValue(validPersonData)
    };

    Person.mockImplementation(() => mockPersonInstance);

    await personController.createPerson(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(mockPersonInstance);
  });


  test("createPerson - errore validazione", async () => {
    req.body = {};

    Person.mockImplementation(() => ({
      save: jest.fn().mockRejectedValue(new Error("Validation error"))
    }));

    await personController.createPerson(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  test("getPersonById - persona trovata", async () => {
    req.params.id = "123";
    Person.findById.mockResolvedValue(validPersonData);

    await personController.getPersonById(req, res);

    expect(res.json).toHaveBeenCalledWith(validPersonData);
  });

  test("getPersonById - persona non trovata", async () => {
    req.params.id = "123";
    Person.findById.mockResolvedValue(null);

    await personController.getPersonById(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  test("updatePerson - aggiornamento riuscito", async () => {
    req.params.id = "123";
    req.body = { isDipendente: false };

    Person.findByIdAndUpdate.mockResolvedValue({
      ...validPersonData,
      isDipendente: false
    });

    await personController.updatePerson(req, res);

    expect(res.json).toHaveBeenCalled();
  });

  test("updatePerson - persona non trovata", async () => {
    req.params.id = "123";

    Person.findByIdAndUpdate.mockResolvedValue(null);

    await personController.updatePerson(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  test("deletePerson - eliminazione riuscita", async () => {
    req.params.id = "123";

    Person.findByIdAndDelete.mockResolvedValue(validPersonData);

    await personController.deletePerson(req, res);

    expect(res.json).toHaveBeenCalledWith({ message: "Person deleted" });
  });

  test("deletePerson - persona non trovata", async () => {
    req.params.id = "123";

    Person.findByIdAndDelete.mockResolvedValue(null);

    await personController.deletePerson(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });

});