import { defineStore } from "pinia";
import { api } from "./auth";

export const useTodoStore = defineStore("todo", {
  state: () => ({
    projects: [],
    todos: [],
    currentProjectId: null,
  }),
  actions: {
    async fetchProjects() {
      const res = await api.get("/projects");
      this.projects = res.data;
      if (this.projects.length > 0 && !this.currentProjectId) {
        this.currentProjectId = this.projects[0].id;
      }
    },
    async createProject(name) {
      const res = await api.post("/projects", { name });
      this.projects.push(res.data);
      this.currentProjectId = res.data.id;
    },
    async deleteProject(id) {
      await api.delete(`/projects/${id}`);
      this.projects = this.projects.filter((p) => p.id !== id);
      if (this.currentProjectId === id) {
        this.currentProjectId = this.projects[0]?.id || null;
      }
    },
    async fetchTodos() {
      if (!this.currentProjectId) {
        this.todos = [];
        return;
      }
      const res = await api.get(`/todos?project_id=${this.currentProjectId}`);
      this.todos = res.data;
    },
    async createTodo(title, priority = "medium", description = "") {
      const res = await api.post("/todos", {
        title,
        priority,
        description,
        project_id: this.currentProjectId,
      });
      this.todos.unshift(res.data);
      await this.fetchTodos(); // Refresh for sorting
    },
    async toggleTodo(id, completed) {
      await api.put(`/todos/${id}`, { completed });
      await this.fetchTodos(); // Refresh for sorting
    },
    async deleteTodo(id) {
      await api.delete(`/todos/${id}`);
      this.todos = this.todos.filter((t) => t.id !== id);
    },
  },
});
