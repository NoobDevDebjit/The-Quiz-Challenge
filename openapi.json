{
  "openapi": "3.0.0",
  "info": {
    "title": "The Trivia API",
    "version": "1.0.0",
    "description": "# Introduction #\n\nThe Trivia API is a REST API used to request multiple choice trivia questions. No API key is required to request questions, but an API key can be used to gain access to further functionality, such as searching, quizzes, and sessions.\n\nAn API key is also required if you would like to use data from the API commercially.\n        "
  },
  "servers": [
    {
      "url": "https://the-trivia-api.com/v2"
    }
  ],
  "tags": [
    {
      "name": "The Question Model",
      "description": "<SchemaDefinition schemaRef=\"#/components/schemas/V2Question\" />"
    }
  ],
  "paths": {
    "/quizzes": {
      "get": {
        "operationId": "getMyQuizzes",
        "summary": "Get all quizzes for a given user",
        "description": "(Requires subscription)\n\nWill return all quizzes that were created using the API key send with this request.",
        "tags": [
          "Quizzes"
        ],
        "responses": {
          "200": {
            "description": "OK",
            "content": {
              "application/json": {
                "schema": {
                  "type": "array",
                  "items": {
                    "$ref": "#/components/schemas/Quiz"
                  }
                }
              }
            }
          },
          "401": {
            "description": "Unauthorized"
          }
        },
        "security": [
          {
            "ApiKeyAuth": []
          }
        ]
      }
    },
    "/tags": {
      "get": {
        "operationId": "getTags",
        "summary": "Get all tags",
        "description": "Returns an array of all tags set on questions",
        "tags": [
          "Meta"
        ],
        "responses": {
          "200": {
            "description": "OK",
            "content": {
              "application/json": {
                "schema": {
                  "type": "array",
                  "items": {
                    "type": "string"
                  },
                  "example": [
                    "world_war_2",
                    "france",
                    "physics",
                    "architecture"
                  ]
                }
              }
            }
          }
        }
      }
    },
    "/totals-per-tag": {
      "get": {
        "operationId": "getTotalsPerTag",
        "summary": "Get the total number of questions per tag",
        "description": "Takes the same input parameters as the `/questions` endpoint and returns a dictionary where each key is a tag and each value is the number of questions that have that tag for the given query parameters.",
        "tags": [
          "Meta"
        ],
        "parameters": [
          {
            "$ref": "#/components/parameters/categoriesQueryParam"
          },
          {
            "$ref": "#/components/parameters/difficultiesQueryParam"
          },
          {
            "$ref": "#/components/parameters/regionQueryParam"
          },
          {
            "$ref": "#/components/parameters/tagsQueryParam"
          },
          {
            "$ref": "#/components/parameters/typesQueryParam"
          }
        ],
        "responses": {
          "200": {
            "description": "OK",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "additionalProperties": {
                    "type": "integer"
                  },
                  "example": {
                    "world_war_2": 10,
                    "france": 5,
                    "physics": 3,
                    "architecture": 2
                  }
                }
              }
            }
          }
        }
      }
    },
    "/metadata": {
      "get": {
        "operationId": "getMetadata",
        "summary": "Get metadata on the questions that match a given query",
        "description": "Will return metadata on the questions that match the given query parameters.\nIncluding breakdowns by category, difficulty, status (approved/rejected/pending), and timestamps marking when the last questions matching the search were submitted and reviewed.",
        "tags": [
          "Meta"
        ],
        "parameters": [
          {
            "$ref": "#/components/parameters/categoriesQueryParam"
          },
          {
            "$ref": "#/components/parameters/difficultiesQueryParam"
          },
          {
            "$ref": "#/components/parameters/regionQueryParam"
          },
          {
            "$ref": "#/components/parameters/tagsQueryParam"
          },
          {
            "$ref": "#/components/parameters/typesQueryParam"
          }
        ],
        "responses": {
          "200": {
            "description": "OK",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "byCategory": {
                      "type": "object",
                      "additionalProperties": {
                        "type": "integer"
                      },
                      "example": {
                        "history": 10,
                        "geography": 5,
                        "science": 3,
                        "food_and_drink": 2
                      }
                    },
                    "byDifficulty": {
                      "type": "object",
                      "additionalProperties": {
                        "type": "integer"
                      },
                      "example": {
                        "easy": 10,
                        "medium": 5,
                        "hard": 3
                      }
                    },
                    "byState": {
                      "type": "object",
                      "additionalProperties": {
                        "type": "integer"
                      },
                      "example": {
                        "approved": 10,
                        "rejected": 5,
                        "pending": 3
                      }
                    },
                    "byType": {
                      "type": "object",
                      "additionalProperties": {
                        "type": "integer"
                      },
                      "example": {
                        "text_choice": 10,
                        "image_choice": 5
                      }
                    },
                    "lastCreated": {
                      "type": "string",
                      "format": "date-time",
                      "example": "2020-01-01T00:00:00.000Z"
                    },
                    "lastReviewed": {
                      "type": "string",
                      "format": "date-time",
                      "example": "2020-01-01T00:00:00.000Z"
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/languages": {
      "get": {
        "operationId": "getAllLanguages",
        "summary": "Get all languages that are supported by the API",
        "description": "Returns an array of all languages that are supported by the API",
        "tags": [
          "Meta"
        ],
        "responses": {
          "200": {
            "description": "OK",
            "content": {
              "application/json": {
                "schema": {
                  "type": "array",
                  "items": {
                    "type": "string"
                  }
                }
              }
            }
          }
        }
      }
    },
    "/question/{id}": {
      "get": {
        "operationId": "getQuestionById",
        "summary": "Get a question by id",
        "description": "Get a question by its id",
        "tags": [
          "Questions"
        ],
        "parameters": [
          {
            "in": "path",
            "name": "id",
            "schema": {
              "type": "string"
            },
            "description": "The id of the question to return",
            "example": "5f9f1b9b0e1b9c0017a5f1a5"
          },
          {
            "$ref": "#/components/parameters/languageQueryParam"
          }
        ],
        "responses": {
          "200": {
            "description": "A question",
            "content": {
              "application/json": {
                "schema": {
                  "anyOf": [
                    {
                      "$ref": "#/components/schemas/TextChoiceQuestion"
                    },
                    {
                      "$ref": "#/components/schemas/ImageChoiceQuestion"
                    }
                  ]
                }
              }
            }
          },
          "404": {
            "description": "No question found with the given id"
          }
        }
      }
    },
    "/question/{id}/report": {
      "post": {
        "operationId": "reportQuestion",
        "summary": "Report a question",
        "description": "Report a question as being incorrect or inappropriate",
        "tags": [
          "Questions"
        ],
        "parameters": [
          {
            "in": "path",
            "name": "id",
            "schema": {
              "type": "string"
            },
            "description": "The id of the question to report",
            "example": "5f9f1b9b0e1b9c0017a5f1a5"
          }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/ReportQuestionBody"
              }
            }
          }
        }
      }
    },
    "/questions": {
      "get": {
        "operationId": "getRandomQuestions",
        "summary": "Get a random set of questions",
        "description": "Get a random set of questions. Any combination of query parameters can be used, or you can omit all of them.\n\nPass an API Key in order to gain access to features that are behind a subscription, e.g.\n- More than 50 questions per request\n- High resolution images\n- Bypass the rate limiter",
        "security": [
          {
            "ApiKeyAuth": []
          },
          {}
        ],
        "tags": [
          "Questions"
        ],
        "parameters": [
          {
            "$ref": "#/components/parameters/limitQueryParam"
          },
          {
            "$ref": "#/components/parameters/categoriesQueryParam"
          },
          {
            "$ref": "#/components/parameters/difficultiesQueryParam"
          },
          {
            "$ref": "#/components/parameters/regionQueryParam"
          },
          {
            "$ref": "#/components/parameters/tagsQueryParam"
          },
          {
            "$ref": "#/components/parameters/typesQueryParam"
          },
          {
            "$ref": "#/components/parameters/sessionQueryParam"
          },
          {
            "$ref": "#/components/parameters/previewQueryParam"
          },
          {
            "$ref": "#/components/parameters/languageQueryParam"
          }
        ],
        "responses": {
          "200": {
            "description": "A list of questions",
            "content": {
              "application/json": {
                "schema": {
                  "type": "array",
                  "items": {
                    "anyOf": [
                      {
                        "$ref": "#/components/schemas/TextChoiceQuestion"
                      },
                      {
                        "$ref": "#/components/schemas/ImageChoiceQuestion"
                      }
                    ]
                  }
                }
              }
            }
          }
        }
      }
    },
    "/questions/search": {
      "post": {
        "operationId": "searchQuestions",
        "summary": "Search for questions",
        "description": "(Requires subscription)",
        "security": [
          {
            "ApiKeyAuth": []
          }
        ],
        "tags": [
          "Questions"
        ],
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/SearchQuestionsBody"
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Search results, including a set of questions and information used to get more results",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/SearchQuestionsResponse"
                }
              }
            }
          }
        }
      }
    },
    "/quiz/{id}": {
      "get": {
        "summary": "Get a quiz by ID.",
        "description": "Get a quiz by ID.",
        "tags": [
          "Quizzes"
        ],
        "parameters": [
          {
            "in": "path",
            "name": "id",
            "description": "The ID of the quiz to get.",
            "required": true,
            "schema": {
              "type": "string"
            }
          },
          {
            "in": "query",
            "name": "language",
            "description": "The language to return questions in, defaults to English.",
            "required": false,
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "The quiz.",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Quiz"
                }
              }
            }
          }
        }
      },
      "delete": {
        "summary": "Delete a quiz.",
        "description": "(Requires subscription)",
        "tags": [
          "Quizzes"
        ],
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "description": "The ID of the quiz to delete.",
            "required": true,
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "204": {
            "description": "The quiz was deleted."
          }
        }
      }
    },
    "/quiz": {
      "post": {
        "operationId": "createQuiz",
        "summary": "Create a quiz.",
        "description": "(Requires subscription)",
        "tags": [
          "Quizzes"
        ],
        "requestBody": {
          "description": "The quiz to create.",
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "title": {
                    "type": "string",
                    "required": true,
                    "description": "User-friendly title for the quiz.",
                    "example": "Will's Dinosaur Quiz"
                  },
                  "questionIds": {
                    "type": "array",
                    "required": true,
                    "items": {
                      "type": "string",
                      "description": "The IDs of the questions to include on this quiz."
                    }
                  }
                },
                "required": [
                  "title",
                  "questionIds"
                ]
              }
            }
          }
        },
        "responses": {
          "201": {
            "description": "Information on the created quiz.",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "id": {
                      "type": "string",
                      "description": "Unique ID for this quiz."
                    }
                  },
                  "required": [
                    "id"
                  ]
                }
              }
            }
          }
        }
      }
    },
    "/session": {
      "post": {
        "summary": "Create a new session",
        "description": "(Requires Regular subscription)",
        "tags": [
          "Sessions"
        ],
        "security": [
          {
            "ApiKeyAuth": []
          }
        ],
        "responses": {
          "200": {
            "description": "The session id",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Session"
                }
              }
            }
          },
          "400": {
            "description": "Invalid request"
          }
        }
      }
    },
    "/session/{id}": {
      "get": {
        "operationId": "getSession",
        "summary": "Get a session by id",
        "description": "(Requires Regular subscription)",
        "tags": [
          "Sessions"
        ],
        "security": [
          {
            "ApiKeyAuth": []
          }
        ],
        "parameters": [
          {
            "in": "path",
            "name": "id",
            "schema": {
              "type": "string",
              "description": "The id of the session to return",
              "example": "1234567890"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "A session",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Session"
                }
              }
            }
          },
          "400": {
            "description": "Invalid request"
          },
          "404": {
            "description": "No session found with the given id"
          }
        }
      }
    },
    "/session/{id}/preview-questions": {
      "get": {
        "operationId": "previewSessionQuestions",
        "summary": "Get a session by id",
        "description": "Preview a session's questions. This is used to get a set of new questions for a session without marking them as 'used'. Questions generated in this way could be generated again on the same session unless they are manually marked as 'used'.",
        "tags": [
          "Sessions"
        ],
        "security": [
          {
            "ApiKeyAuth": []
          }
        ],
        "parameters": [
          {
            "$ref": "#/components/parameters/limitQueryParam"
          },
          {
            "$ref": "#/components/parameters/categoriesQueryParam"
          },
          {
            "$ref": "#/components/parameters/difficultiesQueryParam"
          },
          {
            "$ref": "#/components/parameters/regionQueryParam"
          },
          {
            "$ref": "#/components/parameters/tagsQueryParam"
          },
          {
            "$ref": "#/components/parameters/typesQueryParam"
          },
          {
            "$ref": "#/components/parameters/sessionQueryParam"
          }
        ],
        "responses": {
          "200": {
            "description": "A list of questions",
            "content": {
              "application/json": {
                "schema": {
                  "type": "array",
                  "items": {
                    "anyOf": [
                      {
                        "$ref": "#/components/schemas/TextChoiceQuestion"
                      },
                      {
                        "$ref": "#/components/schemas/ImageChoiceQuestion"
                      }
                    ]
                  }
                }
              }
            }
          }
        }
      }
    },
    "/session/{id}/questions": {
      "post": {
        "operationId": "markQuestionsAsUsed",
        "summary": "Add used questions to a session",
        "description": "Is used to manually add questions to a session's array of 'used' questions, so that they won't be asked for this session.\n\nOrdinarily, questions are automatically added to this array, but sometimes (e.g.) when previewing questions, you may want to manually add questions.",
        "tags": [
          "Sessions"
        ],
        "security": [
          {
            "ApiKeyAuth": []
          }
        ],
        "parameters": [
          {
            "in": "path",
            "name": "id",
            "schema": {
              "type": "string"
            },
            "description": "The id of the session to add questions to",
            "example": "1234567890"
          }
        ],
        "requestBody": {
          "description": "A list of questions to add to the session",
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "questionIds": {
                    "type": "array",
                    "items": {
                      "type": "string"
                    },
                    "description": "The ids of the questions to add to the session",
                    "example": [
                      "1234567890",
                      "0987654321"
                    ]
                  }
                }
              }
            }
          }
        },
        "responses": {
          "204": {
            "description": "Questions added to session"
          }
        }
      }
    }
  },
  "components": {
    "securitySchemes": {
      "ApiKeyAuth": {
        "type": "apiKey",
        "in": "header",
        "name": "X-API-Key"
      }
    },
    "schemas": {
      "SearchQuestionsBody": {
        "type": "object",
        "properties": {
          "categories": {
            "description": "The categories to search for",
            "type": "array",
            "items": {
              "$ref": "#/components/schemas/Category"
            }
          },
          "order": {
            "description": "The order to sort the questions by, new questions are those that have been submitted most recently.",
            "type": "string",
            "enum": [
              "new",
              "old"
            ]
          },
          "pageNumber": {
            "description": "The page number to return",
            "type": "number"
          },
          "perPage": {
            "description": "The number of questions to return per page",
            "type": "number"
          },
          "freetext": {
            "description": "Freetext value to search for withing question text",
            "type": "string"
          },
          "ids": {
            "description": "The ids of the questions to search for",
            "type": "array",
            "items": {
              "type": "string"
            }
          },
          "tags": {
            "description": "The tags to search for",
            "type": "array",
            "items": {
              "type": "string"
            }
          },
          "difficulties": {
            "description": "The difficulty to search for",
            "type": "array",
            "items": {
              "type": "string",
              "enum": [
                "easy",
                "medium",
                "hard"
              ]
            }
          },
          "types": {
            "description": "The types to search for",
            "type": "array",
            "items": {
              "type": "string"
            }
          },
          "region": {
            "description": "The region to search for",
            "type": "string"
          }
        }
      },
      "SearchQuestionsResponse": {
        "type": "object",
        "properties": {
          "questions": {
            "type": "array",
            "description": "The questions that match the search criteria",
            "items": {
              "$ref": "#/components/schemas/V2Question"
            }
          },
          "totalHits": {
            "type": "number",
            "description": "The total number of questions that match the search criteria"
          },
          "perPage": {
            "type": "number",
            "description": "The number of questions returned per page"
          },
          "pageNumber": {
            "type": "number",
            "description": "The page number returned"
          },
          "totalPages": {
            "type": "number",
            "description": "The total number of pages when the current search criteria is applied. Sending a request with a page number greater than this will return an empty array of questions."
          }
        },
        "required": [
          "questions",
          "totalHits",
          "perPage",
          "pageNumber",
          "totalPages"
        ]
      },
      "BaseQuestion": {
        "type": "object",
        "properties": {
          "category": {
            "type": "string",
            "$ref": "#/components/schemas/Category"
          },
          "id": {
            "type": "string",
            "description": "Unique identifier for the question",
            "example": "5f9f1b9b0e1b9c0017a5f1a5"
          },
          "tags": {
            "type": "array",
            "description": "Secondary categories for the question. More freeform than category (can take any value), and can have multiple tags per question.",
            "items": {
              "type": "string"
            },
            "example": [
              "france",
              "geography",
              "capital_cities",
              "cities"
            ]
          },
          "difficulty": {
            "type": "string",
            "enum": [
              "easy",
              "medium",
              "hard"
            ],
            "description": "How difficult the question is perceived to be by the moderators of the API."
          },
          "regions": {
            "type": "array",
            "items": {
              "type": "string"
            },
            "description": "If the question is regional (i.e. only reasonable to ask people from a particular set of countries), then the ISO 3166-1 alpha-2 country codes for those countries are specified here.\n\nFor most questions, this will be an empty array, meaning that the question is suitable to ask to people from anywhere in the world."
          },
          "isNiche": {
            "type": "boolean",
            "description": "Will be true if the question is a niche question, i.e. if it is considered too difficult to return unless the tag is specifically requested."
          }
        },
        "required": [
          "category",
          "id",
          "tags",
          "isNiche",
          "difficulty"
        ]
      },
      "Category": {
        "type": "string",
        "enum": [
          "music",
          "sport_and_leisure",
          "film_and_tv",
          "arts_and_literature",
          "history",
          "society_and_culture",
          "science",
          "geography",
          "food_and_drink",
          "general_knowledge"
        ]
      },
      "ImageChoiceQuestion": {
        "allOf": [
          {
            "$ref": "#/components/schemas/BaseQuestion"
          },
          {
            "type": "object",
            "properties": {
              "question": {
                "type": "object",
                "properties": {
                  "text": {
                    "type": "string",
                    "description": "String formulation of the questions",
                    "example": "Which of these photos shows The Eiffel Tower?"
                  }
                },
                "required": [
                  "text"
                ]
              },
              "correctAnswer": {
                "type": "array",
                "items": {
                  "$ref": "#/components/schemas/ImageOption"
                }
              },
              "incorrectAnswers": {
                "type": "array",
                "items": {
                  "type": "array",
                  "items": {
                    "$ref": "#/components/schemas/ImageOption"
                  }
                }
              },
              "type": {
                "type": "string",
                "enum": [
                  "image_choice"
                ],
                "example": "image_choice"
              }
            },
            "required": [
              "question",
              "correctAnswer",
              "incorrectAnswers",
              "type"
            ]
          }
        ]
      },
      "ImageOption": {
        "type": "object",
        "properties": {
          "url": {
            "type": "string",
            "description": "Full URL of the image",
            "example": "https://example.com/images/12345/an-interesting-image.jpg"
          },
          "height": {
            "type": "number",
            "description": "Height of the image in pixels",
            "example": 400
          },
          "width": {
            "type": "number",
            "description": "Width of the image in pixels",
            "example": 300
          },
          "size": {
            "type": "number",
            "description": "Size of the image in bytes",
            "example": 256612
          },
          "author": {
            "type": "object",
            "properties": {
              "name": {
                "type": "string",
                "description": "The author's name",
                "example": "John Smith"
              },
              "url": {
                "type": [
                  "string",
                  "null"
                ],
                "description": "URL to the author's website or social media profile",
                "example": "https://john-smith.example.com"
              }
            }
          },
          "source": {
            "type": "object",
            "properties": {
              "url": {
                "type": [
                  "string",
                  "null"
                ],
                "description": "Where the image is originally credited",
                "example": "https://example.com/some-source-gallery"
              }
            }
          },
          "description": {
            "type": "string",
            "description": "Description of what the image is showing, can be used as alt text.",
            "example": "A picture of a cat"
          },
          "license": {
            "type": "object",
            "properties": {
              "url": {
                "type": [
                  "string",
                  "null"
                ],
                "description": "URL to the license of the image",
                "example": "https://creativecommons.org/licenses/by/4.0/"
              },
              "name": {
                "type": "string",
                "description": "Name of the license",
                "example": "Creative Commons Attribution 4.0 International"
              }
            }
          }
        },
        "required": [
          "url",
          "height",
          "width",
          "size",
          "author",
          "source",
          "description",
          "license"
        ]
      },
      "V2Question": {
        "oneOf": [
          {
            "$ref": "#/components/schemas/TextChoiceQuestion"
          },
          {
            "$ref": "#/components/schemas/ImageChoiceQuestion"
          }
        ]
      },
      "TextChoiceQuestion": {
        "allOf": [
          {
            "$ref": "#/components/schemas/BaseQuestion"
          },
          {
            "type": "object",
            "properties": {
              "question": {
                "type": "object",
                "properties": {
                  "text": {
                    "type": "string",
                    "description": "String formulation of the questions",
                    "example": "What is the capital of France?"
                  }
                },
                "required": [
                  "text"
                ]
              },
              "correctAnswer": {
                "type": "string",
                "description": "The correct answer",
                "example": "Paris"
              },
              "incorrectAnswers": {
                "type": "array",
                "description": "Array of incorrect answers",
                "example": [
                  "London",
                  "Berlin",
                  "Brussels"
                ],
                "items": {
                  "type": "string",
                  "description": "An incorrect answer"
                }
              },
              "type": {
                "type": "string",
                "enum": [
                  "text_choice"
                ],
                "example": "text_choice"
              }
            },
            "required": [
              "question",
              "correctAnswer",
              "incorrectAnswers",
              "type"
            ]
          }
        ]
      },
      "Quiz": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string",
            "description": "Unique ID for this quiz."
          },
          "title": {
            "type": "string",
            "description": "User-friendly title for the quiz.",
            "example": "Will's Dinosaur Quiz"
          },
          "questions": {
            "type": "array",
            "items": {
              "$ref": "#/components/schemas/V2Question",
              "description": "The questions on this quiz."
            }
          }
        },
        "required": [
          "id",
          "title",
          "questions"
        ]
      },
      "Session": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string",
            "description": "Unique identifier for the session"
          },
          "totalQuestions": {
            "type": "number",
            "description": "Total questions available to the session"
          },
          "remainingQuestions": {
            "type": "number",
            "description": "Remaining questions left in the session"
          },
          "createdAt": {
            "type": "string",
            "format": "date-time",
            "description": "Timestamp that the session was created"
          },
          "updatedAt": {
            "type": "string",
            "format": "date-time",
            "description": "Timestamp that the session was last updated"
          }
        },
        "required": [
          "id",
          "totalQuestions",
          "remainingQuestions",
          "createdAt",
          "updatedAt"
        ]
      },
      "ReportQuestionBody": {
        "type": "object",
        "properties": {
          "reason": {
            "description": "The reason that this question is bad",
            "type": "string",
            "example": "The correct answer is listed as 'France' but it should be 'Spain'"
          }
        }
      }
    },
    "parameters": {
      "limitQueryParam": {
        "in": "query",
        "name": "limit",
        "description": "The number of questions to return",
        "schema": {
          "type": "number",
          "default": 10
        },
        "example": 5
      },
      "categoriesQueryParam": {
        "in": "query",
        "name": "categories",
        "description": "Comma separated list of categories to return questions from. If not provided, all categories will be used.",
        "schema": {
          "type": "string"
        },
        "example": "science,film_and_tv"
      },
      "difficultiesQueryParam": {
        "in": "query",
        "name": "difficulties",
        "description": "Comma separated list of difficulties of questions to return. If not provided, all difficulties will be used.",
        "schema": {
          "type": "string",
          "default": "easy,medium,hard"
        },
        "example": "medium,hard"
      },
      "regionQueryParam": {
        "in": "query",
        "name": "region",
        "schema": {
          "type": "string"
        },
        "description": "Some questions are regional, i.e. only reasonable to ask people from a particular set of countries.\n\nIf not provided, all questions will be suitable to ask to people from anywhere in the world. If provided, you could also receive questions that are only suitable to ask to ask to people from the specified region, but not to people from all regions.\n\nThe region should be provided as an ISO 3166-1 alpha-2 country code.",
        "example": "GB"
      },
      "typesQueryParam": {
        "in": "query",
        "name": "types",
        "schema": {
          "type": "string",
          "default": "text_choice"
        },
        "description": "Comma separated list of the types of questions to return. If not provided, only text choice questions will be used.\nA Complete subscription is required to receive image questions.",
        "example": "text_choice,image_choice"
      },
      "tagsQueryParam": {
        "in": "query",
        "name": "tags",
        "schema": {
          "type": "string"
        },
        "description": "Comma separated list of tags to return questions from. If not provided, all tags will be used.",
        "example": "science,film_and_tv"
      },
      "sessionQueryParam": {
        "in": "query",
        "name": "session",
        "schema": {
          "type": "string"
        },
        "description": "The session id to return questions from. If not provided, questions will not come from a session, so could be duplicates of questions received on previous requests.",
        "example": "1234567890"
      },
      "previewQueryParam": {
        "in": "query",
        "name": "preview",
        "schema": {
          "type": "string",
          "enum": [
            "true",
            "false"
          ]
        },
        "description": "When used with a session, this will not mark the generated questions as \"used\", so the same questions could be returned again in a future request. Questions generated in this way need to be manually marked as \"used\".",
        "example": true
      },
      "languageQueryParam": {
        "in": "query",
        "name": "language",
        "schema": {
          "type": "string"
        },
        "description": "(Requires a Complete subscription) ISO 639-1 code of the language to return questions in. If not provided, questions will be returned in English.",
        "example": "es"
      }
    }
  }
}