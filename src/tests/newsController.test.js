jest.mock("../app/models/news");

const News = require("../app/models/news");
const newsController = require("../app/controllers/newsController");

describe("News Controller", () => {

  let req;
  let res;

  beforeEach(() => {
    jest.resetAllMocks();

    req = {
      body: { title: "Test News" }
    };

    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    };
  });

  describe("getNews", () => {

    it("should return news successfully", async () => {
      const mockNews = [{ title: "News1" }];

      News.find.mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockNews)
      });

      await newsController.getNews(req, res);

      expect(News.find).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(mockNews);
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

  describe("createNews", () => {

    it("should create news successfully", async () => {
      const saveMock = jest.fn().mockResolvedValue();
      News.mockImplementation(() => ({
        save: saveMock
      }));

      await newsController.createNews(req, res);

      expect(saveMock).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
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

});
