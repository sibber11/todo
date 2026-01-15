<template>
  <div class="flex h-screen bg-slate-50 overflow-hidden">
    <!-- Sidebar -->
    <aside
      class="w-72 bg-white border-r border-slate-200 flex flex-col transition-all duration-300"
    >
      <div class="p-6">
        <div class="flex items-center space-x-3 mb-8">
          <div
            class="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white"
          >
            <CheckSquare class="w-6 h-6" />
          </div>
          <h1 class="text-xl font-bold text-slate-800">Todo App</h1>
        </div>

        <div class="space-y-4">
          <div
            class="flex items-center justify-between text-xs font-semibold text-slate-400 uppercase tracking-wider"
          >
            <span>Projects</span>
            <button
              @click="showAddProject = true"
              class="hover:text-indigo-600 transition"
            >
              <Plus class="w-4 h-4" />
            </button>
          </div>

          <div class="space-y-1">
            <button
              v-for="project in todoStore.projects"
              :key="project.id"
              @click="selectProject(project.id)"
              :class="[
                'w-full flex items-center px-4 py-2.5 rounded-lg text-sm font-medium transition',
                todoStore.currentProjectId === project.id
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-slate-600 hover:bg-slate-50',
              ]"
            >
              <Folder class="w-4 h-4 mr-3 opacity-70" />
              {{ project.name }}
            </button>
          </div>
        </div>
      </div>

      <div class="mt-auto p-6 border-t border-slate-100">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center space-x-3">
            <div
              class="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center text-slate-600 text-xs font-bold"
            >
              {{ authStore.user?.username[0].toUpperCase() }}
            </div>
            <span class="text-sm font-medium text-slate-700">{{
              authStore.user?.username
            }}</span>
          </div>
          <button
            @click="logout"
            class="text-slate-400 hover:text-red-500 transition"
          >
            <LogOut class="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 flex flex-col overflow-hidden">
      <!-- Header -->
      <header
        class="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0"
      >
        <h2 class="text-2xl font-bold text-slate-800">
          {{ currentProject?.name || "Select a Project" }}
        </h2>
        <button
          @click="showAddTodo = true"
          v-if="todoStore.currentProjectId"
          class="bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition flex items-center"
        >
          <Plus class="w-4 h-4 mr-2" />
          New Todo
        </button>
      </header>

      <!-- Todo List -->
      <div class="flex-1 overflow-y-auto p-8 space-y-4">
        <div
          v-if="!todoStore.currentProjectId"
          class="h-full flex flex-col items-center justify-center text-slate-400"
        >
          <Folder class="w-16 h-16 mb-4 opacity-20" />
          <p class="text-lg">Create a project to get started</p>
        </div>

        <div
          v-else-if="todoStore.todos.length === 0"
          class="h-full flex flex-col items-center justify-center text-slate-400"
        >
          <CheckSquare class="w-16 h-16 mb-4 opacity-20" />
          <p class="text-lg">No todos yet. Add one!</p>
        </div>

        <div
          v-for="todo in todoStore.todos"
          :key="todo.id"
          class="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition group"
        >
          <div class="flex items-start">
            <button
              @click="todoStore.toggleTodo(todo.id, !todo.completed)"
              :class="[
                'mt-1 w-6 h-6 rounded-full border-2 flex items-center justify-center transition',
                todo.completed
                  ? 'bg-green-500 border-green-500'
                  : 'border-slate-300 group-hover:border-indigo-500',
              ]"
            >
              <Check v-if="todo.completed" class="w-4 h-4 text-white" />
            </button>
            <div class="ml-4 flex-1">
              <div class="flex items-center justify-between">
                <h3
                  :class="[
                    'font-semibold text-lg transition',
                    todo.completed
                      ? 'text-slate-400 line-through'
                      : 'text-slate-800',
                  ]"
                >
                  {{ todo.title }}
                </h3>
                <div class="flex items-center space-x-3">
                  <span
                    :class="[
                      'px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider',
                      priorityClass(todo.priority),
                    ]"
                  >
                    {{ todo.priority }}
                  </span>
                  <button
                    @click="todoStore.deleteTodo(todo.id)"
                    class="text-slate-300 hover:text-red-500 transition"
                  >
                    <Trash2 class="w-4 h-4" />
                  </button>
                </div>
              </div>
              <p v-if="todo.description" class="text-slate-500 mt-1">
                {{ todo.description }}
              </p>
              <div
                class="mt-4 flex items-center space-x-4 text-xs text-slate-400 font-medium"
              >
                <div class="flex items-center">
                  <Calendar class="w-3.5 h-3.5 mr-1.5" />
                  Created: {{ formatDate(todo.created_at) }}
                </div>
                <div
                  v-if="todo.completed_at"
                  class="flex items-center text-green-600"
                >
                  <CheckCircle class="w-3.5 h-3.5 mr-1.5" />
                  Done: {{ formatDate(todo.completed_at) }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Modals -->
    <div
      v-if="showAddProject"
      class="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl">
        <h3 class="text-xl font-bold mb-6">New Project</h3>
        <input
          v-model="newProjectName"
          type="text"
          placeholder="Project Name"
          class="w-full px-4 py-3 rounded-lg border border-slate-300 mb-6 focus:ring-2 focus:ring-indigo-500 outline-none"
          @keyup.enter="addProject"
        />
        <div class="flex justify-end space-x-4">
          <button
            @click="showAddProject = false"
            class="px-4 py-2 text-slate-600 font-medium"
          >
            Cancel
          </button>
          <button
            @click="addProject"
            class="px-6 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700"
          >
            Create
          </button>
        </div>
      </div>
    </div>

    <div
      v-if="showAddTodo"
      class="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl">
        <h3 class="text-xl font-bold mb-6">New Todo</h3>
        <div class="space-y-4">
          <input
            v-model="newTodoTitle"
            type="text"
            placeholder="What needs to be done?"
            class="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none"
          />
          <textarea
            v-model="newTodoDesc"
            placeholder="Description (optional)"
            class="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none h-32"
          ></textarea>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-2"
              >Priority</label
            >
            <div class="flex space-x-2">
              <button
                v-for="p in ['low', 'medium', 'high']"
                :key="p"
                @click="newTodoPriority = p"
                :class="[
                  'flex-1 py-2 rounded-lg text-sm font-semibold capitalize border-2 transition',
                  newTodoPriority === p
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                    : 'border-slate-100 bg-slate-50 text-slate-500 hover:border-slate-200',
                ]"
              >
                {{ p }}
              </button>
            </div>
          </div>
        </div>
        <div class="flex justify-end space-x-4 mt-8">
          <button
            @click="showAddTodo = false"
            class="px-4 py-2 text-slate-600 font-medium"
          >
            Cancel
          </button>
          <button
            @click="addTodo"
            class="px-6 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700"
          >
            Create Todo
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from "vue";
import { useAuthStore } from "../stores/auth";
import { useTodoStore } from "../stores/todo";
import { useRouter } from "vue-router";
import {
  CheckSquare,
  Plus,
  Folder,
  LogOut,
  Trash2,
  Check,
  Calendar,
  CheckCircle,
} from "lucide-vue-next";

const authStore = useAuthStore();
const todoStore = useTodoStore();
const router = useRouter();

const showAddProject = ref(false);
const showAddTodo = ref(false);
const newProjectName = ref("");
const newTodoTitle = ref("");
const newTodoDesc = ref("");
const newTodoPriority = ref("medium");

onMounted(async () => {
  await todoStore.fetchProjects();
  if (todoStore.currentProjectId) {
    await todoStore.fetchTodos();
  }
});

const currentProject = computed(() => {
  return todoStore.projects.find((p) => p.id === todoStore.currentProjectId);
});

const selectProject = async (id) => {
  todoStore.currentProjectId = id;
};

watch(
  () => todoStore.currentProjectId,
  async (newVal) => {
    if (newVal) {
      await todoStore.fetchTodos();
    }
  }
);

const addProject = async () => {
  if (!newProjectName.value) return;
  await todoStore.createProject(newProjectName.value);
  newProjectName.value = "";
  showAddProject.value = false;
};

const addTodo = async () => {
  if (!newTodoTitle.value) return;
  await todoStore.createTodo(
    newTodoTitle.value,
    newTodoPriority.value,
    newTodoDesc.value
  );
  newTodoTitle.value = "";
  newTodoDesc.value = "";
  newTodoPriority.value = "medium";
  showAddTodo.value = false;
};

const logout = () => {
  authStore.logout();
  router.push("/login");
};

const priorityClass = (p) => {
  switch (p) {
    case "high":
      return "bg-red-100 text-red-700";
    case "medium":
      return "bg-amber-100 text-amber-700";
    case "low":
      return "bg-sky-100 text-sky-700";
    default:
      return "bg-slate-100 text-slate-700";
  }
};

const formatDate = (date) => {
  if (!date) return "";
  return new Date(date).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};
</script>
