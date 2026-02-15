const personController = require("../../app/controllers/personController");
const Person = require("../../app/models/person");

jest.mock("../../app/models/person");

describe("Person Controller", () => {

  let req;
  let res;

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

  // =========================
  // getPersons
  // =========================

  test("getPersons - restituisce lista persone", async () => {
    Person.find.mockResolvedValue([{ name: "Mario" }]);

    await personController.getPersons(req, res);

    expect(Person.find).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith([{ name: "Mario" }]);
  });

  test("getPersons - errore database", async () => {
    Person.find.mockRejectedValue(new Error("DB error"));

    await personController.getPersons(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalled();
  });

  // =========================
  // createPerson
  // =========================

  test("createPerson - creazione riuscita", async () => {
    req.body = { name: "Luca" };

    Person.mockImplementation(() => ({
      save: jest.fn().mockResolvedValue({ name: "Luca" })
    }));

    await personController.createPerson(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalled();
  });

  test("createPerson - errore validazione", async () => {
    req.body = { name: "" };

    Person.mockImplementation(() => ({
      save: jest.fn().mockRejectedValue(new Error("Validation error"))
    }));

    await personController.createPerson(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  // =========================
  // getPersonById
  // =========================

  test("getPersonById - persona trovata", async () => {
    req.params.id = "123";
    Person.findById.mockResolvedValue({ name: "Anna" });

    await personController.getPersonById(req, res);

    expect(res.json).toHaveBeenCalledWith({ name: "Anna" });
  });

  test("getPersonById - persona non trovata", async () => {
    req.params.id = "123";
    Person.findById.mockResolvedValue(null);

    await personController.getPersonById(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  // =========================
  // updatePerson
  // =========================

  test("updatePerson - aggiornamento riuscito", async () => {
    req.params.id = "123";
    req.body = { name: "Marco" };

    Person.findByIdAndUpdate.mockResolvedValue({ name: "Marco" });

    await personController.updatePerson(req, res);

    expect(res.json).toHaveBeenCalledWith({ name: "Marco" });
  });

  test("updatePerson - persona non trovata", async () => {
    req.params.id = "123";

    Person.findByIdAndUpdate.mockResolvedValue(null);

    await personController.updatePerson(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  // =========================
  // deletePerson
  // =========================

  test("deletePerson - eliminazione riuscita", async () => {
    req.params.id = "123";

    Person.findByIdAndDelete.mockResolvedValue({});

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
