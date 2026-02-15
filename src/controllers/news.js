const NewsController = {
    dummyNews: [
        {
            id: 1,
            title: "News #1",
            text: "Hello, World!",
            publicationDate: "2026-02-15 10:42"
        },
        {
            id: 2,
            title: "News #2",
            text: "Hello, World!",
            publicationDate: "2026-02-15 10:46"
        }
    ],
    getNewsById: (newsId) => {
        return NewsController.dummyNews.find((news) => {
            return (news.id === newsId);
        });
    },
    getAllNews: () => {
        return NewsController.dummyNews;
    }
};

module.exports = NewsController;
