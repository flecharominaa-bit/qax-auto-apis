// tests/repos.spec.js

const { test, expect } = require('@playwright/test');
const { RepoService } = require('../src/services/RepoService');
const { RepoRequest } = require('../src/models/RepoRequest');

test.describe('HU2 — Repos API: crear, consultar y actualizar', () => {
  // Serial: el test de nombre duplicado reutiliza el repo creado en el flujo E2E
  test.describe.configure({ mode: 'serial' });

  const owner = process.env.GITHUB_USERNAME;
  const repoName = `inventario-tienda-${Date.now()}`;

  test('ciclo de vida de un repositorio: crear, consultar y actualizar la descripción @smoke', async ({ request }) => {
    const repoService = new RepoService(request);
    const newRepo = new RepoRequest(repoName, 'Sistema de control de stock para una tienda de barrio');
    const newDescription = 'Control de stock y alertas de reposición para una tienda de barrio';
    let repoId;

    await test.step('POST /user/repos - Crear el repositorio', async () => {
      const { status, body } = await repoService.createRepo(newRepo);

      expect(status).toBe(201);
      expect(body.hasValidId()).toBeTruthy();
      expect(body.name).toBe(repoName);
      expect(body.ownerLogin.toLowerCase()).toBe(owner.toLowerCase());
      expect(body.description).toBe(newRepo.description);

      repoId = body.id;
    });

    await test.step('GET /repos/{owner}/{repo} - Verificar la creación', async () => {
      const { status, body } = await repoService.getRepo(owner, repoName);

      expect(status).toBe(200);
      expect(body.id).toBe(repoId);
      expect(body.hasFullName(owner, repoName)).toBeTruthy();
      expect(body.hasValidHtmlUrl()).toBeTruthy();
      expect(typeof body.isPrivate).toBe('boolean');
    });

    await test.step('PATCH /repos/{owner}/{repo} - Actualizar solo la descripción', async () => {
      const { status, body } = await repoService.patchRepo(owner, repoName, { description: newDescription });

      expect(status).toBe(200);
      expect(body.id).toBe(repoId);
      expect(body.description).toBe(newDescription);
      expect(body.name).toBe(repoName);
    });

    await test.step('GET /repos/{owner}/{repo} - Verificar que la descripción cambió', async () => {
      const { status, body } = await repoService.getRepo(owner, repoName);

      expect(status).toBe(200);
      expect(body.id).toBe(repoId);
      expect(body.name).toBe(repoName);
      expect(body.description).toBe(newDescription);
      expect(body.description).not.toBe(newRepo.description);
    });
  });

  test('debe devolver 422 al crear un repositorio con un nombre ya existente @regression', async ({ request }) => {
    const repoService = new RepoService(request);

    await test.step('POST /user/repos con el nombre del repo creado antes', async () => {
      const { status } = await repoService.createRepo(new RepoRequest(repoName, 'Repositorio duplicado'));

      expect(status).toBe(422);
    });
  });

  test.describe('sin autenticación', () => {
    // Se pisan los headers del playwright.config.js para no enviar Authorization
    test.use({ extraHTTPHeaders: { 'Accept': 'application/vnd.github+json' } });

    test('debe devolver 401 al crear un repositorio sin token @regression', async ({ request }) => {
      const repoService = new RepoService(request);

      await test.step('POST /user/repos sin autenticación', async () => {
        const { status, body } = await repoService.createRepo(
          new RepoRequest(`catalogo-productos-${Date.now()}`, 'Catálogo de productos'),
        );

        expect(status).toBe(401);
        expect(body.message).toBe('Requires authentication');
      });
    });
  });

  test('debe devolver 404 al consultar un repositorio inexistente @regression', async ({ request }) => {
    const repoService = new RepoService(request);

    await test.step('GET /repos/{owner}/{repo} con un repo que no existe', async () => {
      const { status, body } = await repoService.getRepo(owner, 'repo-que-no-existe-999');

      expect(status).toBe(404);
      expect(body.message).toBe('Not Found');
    });
  });

});
