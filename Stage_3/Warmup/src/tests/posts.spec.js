const { test, expect } = require("@playwright/test");
const { PostService } = require("../services/PostService");
const { PostRequest } = require("../models/PostRequest");

test.describe("Posts API @smoke", () => {

  test("debe obtener un post por ID", async ({ request }) => {
    const postService = new PostService(request);
    await test.step("Llamar al endpoint GET /posts/1", async () => {
      const post = await postService.getPost(1);
      expect(post.id).toBe(1);
      expect(post.hasTitle()).toBeTruthy();
    });
  });

  test("debe crear un post correctamente", async ({ request }) => {
    const postService = new PostService(request);
    const newPost = new PostRequest("Ninja QA", "Aprendiendo arquitectura", 1);
    const { status, body } = await postService.createPost(newPost);
    expect(status).toBe(201);
    expect(body.title).toBe("Ninja QA");
  });

  test("debe actualizar un post con PUT @regression", async ({ request }) => {
    const postService = new PostService(request);
    const updateData = new PostRequest("Update Title", "Update Body", 1);
    const { status } = await postService.updatePost(1, updateData);
    expect(status).toBe(200);
  });

  test.skip("debe eliminar un post", async ({ request }) => {
    const response = await request.delete("/posts/1");
    expect(response.status()).toBe(200);
  });
});