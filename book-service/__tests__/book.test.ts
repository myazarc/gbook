import request from "supertest";
import { server } from "../src/index";
const app = server.expressApp.app;

const mockdata = {
  search: {
    errorNull: {},
    searchKeywords: {
      keywords: "Clean Architecture",
    },
    searchTitle: {
      title: "Clean Architecture",
    },
  },
};

describe("Book Service", () => {
  describe("Search", () => {
    it("should return error if keywords is null", async () => {
      const response = await request(app).get("/search").query(mockdata.search.errorNull);
      expect(response.status).toBe(400);
    });

    it("should return success if keywords search", async () => {
      const response = await request(app).get("/search").query(mockdata.search.searchKeywords);
      expect(response.status).toBe(200);
    });

    it("should return success if title search", async () => {
      const response = await request(app).get("/search").query(mockdata.search.searchTitle);
      expect(response.status).toBe(200);
    });
  });
});
