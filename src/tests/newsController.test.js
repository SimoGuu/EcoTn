jest.mock("../app/models/news");
const request = require('supertest');
const app = require('../app/app');

const News = require("../app/models/news");
const newsController = require("../app/controllers/newsController");

describe("News Controller", () => {
  let req;
  let res;

  beforeEach(() => {
    jest.clearAllMocks();

    req = {
      body: { titolo: "Test News", testo: "Esempio testo" },
      params: { id: "123" }
    };

    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    };
  });

  describe("getNews", () => {
    it("should return all news successfully", async () => {
      const mockNews = [{ titolo: "News1" }, { titolo: "News2" }];

      News.find.mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockNews)
      });

      await newsController.getNews(req, res);

      expect(News.find).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(mockNews);
    });

    it("should return 500 if error occurs", async () => {
      News.find.mockReturnValue({
        populate: jest.fn().mockRejectedValue(new Error("DB error"))
      });

      await newsController.getNews(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "DB error" });
    });
  });

  describe("createNews", () => {
    it("should create news successfully", async () => {
      const mockNewsInstance = {
        save: jest.fn().mockResolvedValue()
      };
      News.mockImplementation(() => mockNewsInstance);

      await newsController.createNews(req, res);

      expect(mockNewsInstance.save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
    });

    it("should return 400 if validation fails", async () => {
      const saveMock = jest.fn().mockRejectedValue(new Error("Validation error"));
      News.mockImplementation(() => ({
        save: saveMock
      }));

      await newsController.createNews(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: "Validation error" });
    });
  });

  describe("getNewsById", () => {
    it("should return news by id", async () => {
      const mockNews = { _id: "123", titolo: "News1" };

      News.findById.mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockNews)
      });

      await newsController.getNewsById(req, res);

      expect(News.findById).toHaveBeenCalledWith("123");
      expect(res.json).toHaveBeenCalledWith(mockNews);
    });

    it("should return 404 if news not found", async () => {
      News.findById.mockReturnValue({
        populate: jest.fn().mockResolvedValue(null)
      });

      await newsController.getNewsById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: "News not found" });
    });
  });
});