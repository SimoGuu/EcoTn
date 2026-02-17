jest.mock("../app/models/news");

const News = require("../app/models/news");
const newsController = require("../app/controllers/newsController");

describe("News Controller", () => {

  let req;
  let res;

  beforeEach(() => {
    jest.clearAllMocks();

    req = {
      body: { title: "Test News" },
      params: { id: "123" }
    };

    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    };
  });

  // =========================
  // GET ALL
  // =========================
  describe("getNews", () => {

    it("should create news successfully", async () => {

      const mockNewsInstance = {
        _id: "1",
        title: "Test News",
        save: jest.fn().mockResolvedValue()
      };

      News.mockImplementation(() => mockNewsInstance);

      await newsController.createNews(req, res);

      expect(mockNewsInstance.save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockNewsInstance);

    });


    it("should return 500 if error occurs", async () => {
      News.find.mockImplementation(() => {
        throw new Error("DB error");
      });

      await newsController.getNews(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "DB error" });
    });

  });

  // =========================
  // CREATE
  // =========================
  describe("createNews", () => {

    it("should create news successfully", async () => {

      const mockNewsInstance = {
        _id: "1",
        title: "Test News",
        save: jest.fn().mockResolvedValue()
      };

      News.mockImplementation(() => mockNewsInstance);

      await newsController.createNews(req, res);

      expect(mockNewsInstance.save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockNewsInstance);

    });


    it("should return 400 if save fails", async () => {
      const saveMock = jest.fn().mockRejectedValue(new Error("Validation error"));

      News.mockImplementation(() => ({
        save: saveMock
      }));

      await newsController.createNews(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: "Validation error" });
    });

  });

  // =========================
  // GET BY ID
  // =========================
  describe("getNewsById", () => {

    it("should return news by id", async () => {
      const mockNews = { _id: "123", title: "News1" };

      const populateMock = jest.fn().mockResolvedValue(mockNews);

      News.findById.mockReturnValue({
        populate: populateMock
      });

      await newsController.getNewsById(req, res);

      expect(News.findById).toHaveBeenCalledWith("123");
      expect(populateMock).toHaveBeenCalledWith("chiavi");
      expect(res.json).toHaveBeenCalledWith(mockNews);
    });

    it("should return 404 if news not found", async () => {
      const populateMock = jest.fn().mockResolvedValue(null);

      News.findById.mockReturnValue({
        populate: populateMock
      });

      await newsController.getNewsById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: "News not found" });
    });

    it("should return 500 if error occurs", async () => {
      News.findById.mockImplementation(() => {
        throw new Error("DB error");
      });

      await newsController.getNewsById(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "DB error" });
    });

  });

});
