import { test, expect } from '@playwright/test';
import { ActivityService } from '../../src/service/ActivityService';
import { Logger } from '../../src/helpers/logger';

test('debe crear una actividad correctamente @smoke', async ({ request }) => {
  const activityService = new ActivityService(request);

  const newActivity = {
    id: 0,
    title: 'Aprender Playwright',
    dueDate: new Date().toISOString(),
    completed: true,
  };

  let response: any;

  await Logger.step('Crear una nueva actividad', async () => {
    response = await activityService.createActivity(newActivity);
  });

  await Logger.step('Validar la respuesta', async () => {
    expect(response.status).toBe(200);
    expect(response.body.title).toBe(newActivity.title);
  });
});