// tests/issues.spec.js

const { test, expect } = require('@playwright/test');
const { IssueService } = require('../src/services/IssueService');
const { IssueRequest } = require('../src/models/IssueRequest');
const { RepoService } = require('../src/services/RepoService');
const { RepoRequest } = require('../src/models/RepoRequest');

test.describe('HU3 — Issues API: listar y crear', () => {
  // Serial: todos los tests usan el repo que crea el primer test
  test.describe.configure({ mode: 'serial' });

  const owner = process.env.GITHUB_USERNAME;
  const repoName = `reservas-turnos-peluqueria-${Date.now()}`;
  const newIssue = new IssueRequest(
    'El calendario no muestra los turnos del sábado',
    'Al abrir la vista semanal, los turnos reservados para el sábado no aparecen, '
      + 'aunque sí figuran en el listado de reservas del día.',
  );
  let issueNumber;

  test('debe crear un issue con estructura y tipos válidos @smoke', async ({ request }) => {
    const repoService = new RepoService(request);
    const issueService = new IssueService(request);

    await test.step('Precondición: crear el repositorio donde se cargan los issues', async () => {
      const { status } = await repoService.createRepo(
        new RepoRequest(repoName, 'Sistema de reservas de turnos para una peluquería'),
      );

      expect(status).toBe(201);
    });

    await test.step('POST /repos/{owner}/{repo}/issues - Crear el issue', async () => {
      const { status, body } = await issueService.createIssue(owner, repoName, newIssue);

      await test.step('Validar status 201', async () => {
        expect(status).toBe(201);
      });

      await test.step('Validar id y number mayores a 0', async () => {
        expect(body.hasValidNumber()).toBeTruthy();
      });

      await test.step('Validar title, body y state', async () => {
        expect(body.hasValidTitle()).toBeTruthy();
        expect(body.title).toBe(newIssue.title);
        expect(body.body).toBe(newIssue.body);
        expect(body.state).toBe('open');
      });

      await test.step('Validar user, labels y created_at', async () => {
        expect(body.userLogin.toLowerCase()).toBe(owner.toLowerCase());
        expect(body.hasLabelsArray()).toBeTruthy();
        expect(body.hasValidCreatedAt()).toBeTruthy();
      });

      issueNumber = body.number;
    });
  });

  test('debe listar los issues del repositorio e incluir el creado @smoke', async ({ request }) => {
    const issueService = new IssueService(request);

    await test.step('GET /repos/{owner}/{repo}/issues', async () => {
      // El issue recién creado tarda unos segundos en aparecer en el listado
      // (consistencia eventual, ver "Observaciones" en el README), así que se reintenta.
      await expect.poll(async () => {
        const { body } = await issueService.listIssues(owner, repoName);
        return body.length;
      }, { timeout: 15000 }).toBeGreaterThan(0);

      const { status, body } = await issueService.listIssues(owner, repoName);

      expect(status).toBe(200);
      expect(Array.isArray(body)).toBeTruthy();
      expect(body.length).toBeGreaterThan(0);

      for (const issue of body) {
        expect(issue.hasValidNumber()).toBeTruthy();
        expect(issue.hasValidTitle()).toBeTruthy();
        expect(typeof issue.state).toBe('string');
      }

      const createdIssue = body.find((issue) => issue.number === issueNumber);
      expect(createdIssue).toBeDefined();
      expect(createdIssue.title).toBe(newIssue.title);
    });
  });

  test('debe devolver 422 al crear un issue sin título @regression', async ({ request }) => {
    const issueService = new IssueService(request);

    await test.step('POST /repos/{owner}/{repo}/issues sin el campo title', async () => {
      const { status } = await issueService.createIssue(
        owner,
        repoName,
        new IssueRequest(undefined, 'Falta el título del issue'),
      );

      expect(status).toBe(422);
    });
  });

  test('debe devolver 404 al listar issues de un repositorio inexistente @regression', async ({ request }) => {
    const issueService = new IssueService(request);

    await test.step('GET /repos/{owner}/{repo}/issues con un repo que no existe', async () => {
      const { status, body } = await issueService.listIssues(owner, 'repo-que-no-existe-999');

      expect(status).toBe(404);
      expect(body.message).toBe('Not Found');
    });
  });

});
