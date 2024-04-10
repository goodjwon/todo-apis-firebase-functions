import request from 'supertest';
import { api } from 'http://127.0.0.1:5001/todo-list-group/us-central1/api'; 
import admin from 'firebase-admin'; // This will auto-mock

// Mock data
const mockTodo = {
  userUID: '7iBlbRxnYLWtCqUhgO8CEZIMKZn1',
  name: '이효복',
  familyId: 'family123',
  title: 'Test Todo',
  description: 'Test Description',
  isCompleted: false,
  startDate: '2024-03-01',
  endDate: '2024-03-01'
};
describe('Todos API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('POST /todos/:userUID/:familyId - creates a new todo', async () => {
    const response = await request(api).post('/todos/7iBlbRxnYLWtCqUhgO8CEZIMKZn1/family123').send(mockTodo);
    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('id');
  });

  it('PUT /todos/:userUID/:familyId/:id - updates a todo', async () => {
    const updatedTodo = { ...mockTodo, title: 'Updated Title' };
    const response = await request(api).put('/todos/7iBlbRxnYLWtCqUhgO8CEZIMKZn1/family123/docId').send(updatedTodo);
    expect(response.statusCode).toBe(200);
    expect(response.body.title).toEqual('Updated Title');
  });

  it('GET /todos/:userUID/:familyId - retrieves todos for a user in a family', async () => {
    const response = await request(api).get('/todos/7iBlbRxnYLWtCqUhgO8CEZIMKZn1/family123');
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(expect.any(Array));
  });

  it('GET /todos/:userUID/:familyId/:id - retrieves a single todo by id', async () => {
    const response = await request(api).get('/todos/7iBlbRxnYLWtCqUhgO8CEZIMKZn1/family123/docId');
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('id', 'docId');
  });

  it('DELETE /todos/:userUID/:familyId/:id - deletes a todo', async () => {
    const response = await request(api).delete('/todos/7iBlbRxnYLWtCqUhgO8CEZIMKZn1/family123/docId');
    expect(response.statusCode).toBe(200);
  });
});
