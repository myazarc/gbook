import { Client } from "@elastic/elasticsearch";
import { BookmarkElasticListDto } from "../dto/book/bookmark.elastic.list.dto";

export class ElasticSearchService {
  private client: Client;

  constructor() {
    this.connect();
  }

  private connect() {
    this.client = new Client({
      node: `http://${process.env.ELASTICSEARCH_HOST}:${process.env.ELASTICSEARCH_PORT}`,
    });
  }

  async isExist() {
    const result = await this.client.indices.exists({
      index: "bookmarks",
    });
    if (!result) {
      await this.createMapping();
    }
  }

  private async createMapping() {
    await this.client.indices.putMapping({
      index: "bookmarks",
      body: {
        properties: {
          title: {
            type: "text",
          },
          description: {
            type: "text",
          },
          author: {
            type: "text",
          },
          publisher: {
            type: "text",
          },
          isbn: {
            type: "text",
          },
          userId: {
            type: "integer",
          },
        },
      },
    });
  }

  async addBookmark(id: number, data: any): Promise<any> {
    const doc = {
      title: data.title,
      description: data.description,
      userId: data.userId,
      author: data.author,
      publisher: data.publisher,
      isbn: data.isbn,
    };
    this.client.index({
      id: id.toString(),
      index: "bookmarks",
      body: doc,
    });
  }

  async search(userId: any, bookmarkSearch: BookmarkElasticListDto): Promise<any> {
    const must: any = [];
    must.push({
      match: {
        userId: userId,
      },
    });

    if (bookmarkSearch.title) {
      must.push({
        match: {
          title: bookmarkSearch.title,
        },
      });
    }

    if (bookmarkSearch.author) {
      must.push({
        match: {
          author: bookmarkSearch.author,
        },
      });
    }
    if (bookmarkSearch.keywords) {
      must.push({
        multi_match: {
          query: bookmarkSearch.keywords,
          fields: ["title^3", "description^1", "author^2.5", "publisher^1.5", "isbn^2"],
        },
      });
    }

    const response: any = await this.client.search({
      index: "bookmarks",
      body: {
        query: {
          bool: {
            must,
          },
        },
      },
    });

    return response.body.hits.hits.map((hit: any) => hit._source);
  }

  async deleteBookmark(id: number): Promise<any> {
    return this.client.delete({
      id: id.toString(),
      index: "bookmarks",
    });
  }
}

let elasticSearchService: ElasticSearchService;
export function getElasticSearchService() {
  if (!elasticSearchService) {
    elasticSearchService = new ElasticSearchService();
    elasticSearchService.isExist();
  }
  return elasticSearchService;
}
