/**
 * Exemplo de como criar serviços que usam a API configurada com autenticação
 */

import api from './api';

// Exemplo de serviço para operações com frotas
export const frotoService = {
  // GET /frotas
  listar: async () => {
    const response = await api.get('/frotas/');
    return response.data;
  },

  // GET /frotas/:id
  obter: async (id: number) => {
    const response = await api.get(`/frotas/${id}/`);
    return response.data;
  },

  // POST /frotas
  criar: async (dados: any) => {
    const response = await api.post('/frotas/', dados);
    return response.data;
  },

  // PUT /frotas/:id
  atualizar: async (id: number, dados: any) => {
    const response = await api.put(`/frotas/${id}/`, dados);
    return response.data;
  },

  // DELETE /frotas/:id
  deletar: async (id: number) => {
    const response = await api.delete(`/frotas/${id}/`);
    return response.data;
  },
};

// Exemplo de serviço para operações com reservas
export const reservasService = {
  // GET /reservas
  listar: async () => {
    const response = await api.get('/reservas/');
    return response.data;
  },

  // GET /reservas/:id
  obter: async (id: number) => {
    const response = await api.get(`/reservas/${id}/`);
    return response.data;
  },

  // POST /reservas
  criar: async (dados: any) => {
    const response = await api.post('/reservas/', dados);
    return response.data;
  },

  // PUT /reservas/:id
  atualizar: async (id: number, dados: any) => {
    const response = await api.put(`/reservas/${id}/`, dados);
    return response.data;
  },

  // DELETE /reservas/:id
  cancelar: async (id: number) => {
    const response = await api.delete(`/reservas/${id}/`);
    return response.data;
  },
};

// Exemplo de serviço para operações com clientes
export const clientesService = {
  // GET /clientes
  listar: async () => {
    const response = await api.get('/clientes/');
    return response.data;
  },

  // GET /clientes/:id
  obter: async (id: number) => {
    const response = await api.get(`/clientes/${id}/`);
    return response.data;
  },

  // POST /clientes
  criar: async (dados: any) => {
    const response = await api.post('/clientes/', dados);
    return response.data;
  },

  // PUT /clientes/:id
  atualizar: async (id: number, dados: any) => {
    const response = await api.put(`/clientes/${id}/`, dados);
    return response.data;
  },
};

export default {
  froto: frotoService,
  reservas: reservasService,
  clientes: clientesService,
};
