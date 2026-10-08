import { test, expect } from '@playwright/test';
import { AuthorService } from '../../src/service/AuthorService';
import { Logger } from '../../src/helpers/logger';

test.describe('Authors API tests', () => {
  let authorService: AuthorService;

  test.beforeEach(async ({ request }) => {
    authorService = new AuthorService(request);
  });

  test('debe crear un autor correctamente @smoke', async () => {
    const newAuthor = {
      id: 0,
      idBook: 0,
      firstName: 'Juan',
      lastName: 'Pérez',
    };

    let response: any;

    await Logger.step('Crear un nuevo autor', async () => {
      response = await authorService.createAuthor(newAuthor);
    });

    await Logger.step('Validar la respuesta de creación', async () => {
      expect(response.status).toBe(200);
      expect(response.body.firstName).toBe(newAuthor.firstName);
    });
  });

  test('debe obtener la lista de autores @smoke', async () => {
    let response: any;

    await Logger.step('Solicitar lista de autores', async () => {
      response = await authorService.getAuthors();
    });

    await Logger.step('Validar que se recibe una lista', async () => {
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  test('debe actualizar un autor correctamente @smoke', async () => {
    const updatedAuthor = {
      id: 3,
      idBook: 0,
      firstName: 'Carlos',
      lastName: 'García',
    };

    let response: any;

    await Logger.step('Actualizar el autor con ID 3', async () => {
      response = await authorService.updateAuthor(3, updatedAuthor);
    });

    await Logger.step('Validar la respuesta de actualización', async () => {
      expect(response.status).toBe(200);
      expect(response.body.firstName).toBe(updatedAuthor.firstName);
    });
  });
});
