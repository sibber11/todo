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

          <!-- Filter Submenu -->
          <div class="bg-slate-50 rounded-lg p-2 space-y-1">
            <button
              @click="todoFilter = 'all'"
              :class="[
                'w-full flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium transition',
                todoFilter === 'all'
                  ? 'bg-white text-indigo-700 shadow-sm'
                  : 'text-slate-600 hover:bg-white/50',
              ]"
            >
              <span>All</span>
              <span
                :class="[
                  'px-2 py-0.5 rounded-full text-xs font-bold',
                  todoFilter === 'all'
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'bg-slate-200 text-slate-600',
                ]"
              >
                {{ allTodosCount }}
              </span>
            </button>
            <button
              @click="todoFilter = 'todo'"
              :class="[
                'w-full flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium transition',
                todoFilter === 'todo'
                  ? 'bg-white text-indigo-700 shadow-sm'
                  : 'text-slate-600 hover:bg-white/50',
              ]"
            >
              <span>Todo</span>
              <span
                :class="[
                  'px-2 py-0.5 rounded-full text-xs font-bold',
                  todoFilter === 'todo'
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'bg-slate-200 text-slate-600',
                ]"
              >
                {{ todoCount }}
              </span>
            </button>
            <button
              @click="todoFilter = 'done'"
              :class="[
                'w-full flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium transition',
                todoFilter === 'done'
                  ? 'bg-white text-indigo-700 shadow-sm'
                  : 'text-slate-600 hover:bg-white/50',
              ]"
            >
              <span>Done</span>
              <span
                :class="[
                  'px-2 py-0.5 rounded-full text-xs font-bold',
                  todoFilter === 'done'
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'bg-slate-200 text-slate-600',
                ]"
              >
                {{ doneCount }}
              </span>
            </button>
          </div>

          <div class="space-y-1">
            <div
              v-for="project in todoStore.projects"
              :key="project.id"
              :class="[
                'w-full flex items-center px-4 py-2.5 rounded-lg text-sm font-medium transition group',
                todoStore.currentProjectId === project.id
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-slate-600 hover:bg-slate-50',
              ]"
            >
              <Folder class="w-4 h-4 mr-3 opacity-70 shrink-0" />
              <span
                @click="selectProject(project.id)"
                class="flex-1 cursor-pointer"
              >
                {{ project.name }}
              </span>
              <button
                @click="startEditProject(project)"
                class="opacity-0 group-hover:opacity-100 ml-2 text-slate-400 hover:text-indigo-600 transition"
              >
                <Edit class="w-3.5 h-3.5" />
              </button>
            </div>
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
      </header>

      <!-- Todo List -->
      <div class="flex-1 overflow-y-auto p-8 pb-64 space-y-4">
        <div
          v-if="!todoStore.currentProjectId"
          class="h-full flex flex-col items-center justify-center text-slate-400"
        >
          <Folder class="w-16 h-16 mb-4 opacity-20" />
          <p class="text-lg">Create a project to get started</p>
        </div>

        <div
          v-else-if="filteredTodos.length === 0"
          class="h-full flex flex-col items-center justify-center text-slate-400"
        >
          <CheckSquare class="w-16 h-16 mb-4 opacity-20" />
          <p class="text-lg">No todos yet. Add one!</p>
        </div>

        <div
          v-for="todo in filteredTodos"
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
                <div class="flex-1">
                  <input
                    v-if="editingTodoId === todo.id"
                    v-model="editingTodoTitle"
                    class="w-full font-semibold text-lg border-b border-indigo-300 outline-none mb-2"
                    @blur="saveTodoEdit"
                    @keyup.enter="saveTodoEdit"
                    @keyup.esc="cancelTodoEdit"
                    @click.stop
                  />
                  <h3
                    v-else
                    :class="[
                      'font-semibold text-lg transition',
                      todo.completed
                        ? 'text-slate-400 line-through'
                        : 'text-slate-800',
                    ]"
                  >
                    {{ todo.title }}
                  </h3>
                </div>
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
                    v-if="editingTodoId !== todo.id"
                    @click="startEditTodo(todo)"
                    class="text-slate-300 hover:text-indigo-500 transition"
                  >
                    <Edit class="w-4 h-4" />
                  </button>
                  <button
                    @click="todoStore.deleteTodo(todo.id)"
                    class="text-slate-300 hover:text-red-500 transition"
                  >
                    <Trash2 class="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div v-if="editingTodoId === todo.id" class="mt-2 space-y-2">
                <textarea
                  v-model="editingTodoDesc"
                  placeholder="Description (optional)"
                  class="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none h-20 resize-none text-sm"
                ></textarea>
                <div class="flex items-center justify-between">
                  <div class="flex space-x-2">
                    <button
                      v-for="p in ['low', 'medium', 'high']"
                      :key="p"
                      @click="editingTodoPriority = p"
                      :class="[
                        'w-7 h-7 rounded-full transition-all',
                        editingTodoPriority === p
                          ? priorityButtonClass(p, true)
                          : priorityButtonClass(p, false),
                      ]"
                      :title="`${p} Priority`"
                    ></button>
                  </div>
                  <div class="flex space-x-2">
                    <button
                      @click="cancelTodoEdit"
                      class="px-4 py-1.5 text-sm text-slate-600 hover:bg-slate-100 rounded-lg transition"
                    >
                      Cancel
                    </button>
                    <button
                      @click="saveTodoEdit"
                      class="px-4 py-1.5 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
              <p v-else-if="todo.description" class="text-slate-500 mt-1">
                {{ todo.description }}
              </p>
              <div
                class="mt-4 flex items-center space-x-4 text-xs text-slate-400 font-medium"
              >
                <div class="flex items-center">
                  <Clock class="w-3.5 h-3.5 mr-1.5" />
                  {{ formatDateTime(todo.created_at) }}
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

      <!-- Add Todo Form (Fixed at Bottom) -->
      <div
        v-if="todoStore.currentProjectId"
        class="absolute bottom-0 left-72 right-0 bg-white border-t-2 border-indigo-200"
      >
        <div class="p-6">
          <h3 class="text-lg font-bold text-slate-800 mb-4 flex items-center">
            <Plus class="w-5 h-5 mr-2 text-indigo-600" />
            Add New Todo
          </h3>
          <div class="space-y-4">
            <div class="flex items-center space-x-3">
              <div class="relative flex-1">
                <input
                  v-model="newTodoTitle"
                  type="text"
                  placeholder="What needs to be done?"
                  class="w-full px-4 py-3 pr-32 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none"
                  @keyup.enter="addTodo"
                />
                <div
                  class="absolute right-3 top-1/2 -translate-y-1/2 flex items-center space-x-2"
                >
                  <button
                    @click="newTodoPriority = 'low'"
                    :class="[
                      'w-7 h-7 rounded-full transition-all',
                      newTodoPriority === 'low'
                        ? 'bg-sky-500 ring-2 ring-sky-200'
                        : 'bg-sky-300 hover:bg-sky-400',
                    ]"
                    title="Low Priority"
                  ></button>
                  <button
                    @click="newTodoPriority = 'medium'"
                    :class="[
                      'w-7 h-7 rounded-full transition-all',
                      newTodoPriority === 'medium'
                        ? 'bg-amber-500 ring-2 ring-amber-200'
                        : 'bg-amber-300 hover:bg-amber-400',
                    ]"
                    title="Medium Priority"
                  ></button>
                  <button
                    @click="newTodoPriority = 'high'"
                    :class="[
                      'w-7 h-7 rounded-full transition-all',
                      newTodoPriority === 'high'
                        ? 'bg-red-500 ring-2 ring-red-200'
                        : 'bg-red-300 hover:bg-red-400',
                    ]"
                    title="High Priority"
                  ></button>
                </div>
              </div>
              <button
                @click="addTodo"
                :disabled="!newTodoTitle"
                class="px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                <Plus class="w-4 h-4 mr-2" />
                Add
              </button>
            </div>
            <textarea
              v-model="newTodoDesc"
              placeholder="Description (optional)"
              class="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none h-20 resize-none"
            ></textarea>
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

    <!-- Edit Project Dialog -->
    <div
      v-if="editingProjectId"
      class="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl">
        <h3 class="text-xl font-bold mb-6">Edit Project</h3>
        <input
          v-model="editingProjectName"
          type="text"
          placeholder="Project Name"
          class="w-full px-4 py-3 rounded-lg border border-slate-300 mb-6 focus:ring-2 focus:ring-indigo-500 outline-none"
          @keyup.enter="saveProjectEdit"
        />
        <div class="flex justify-end space-x-4">
          <button
            @click="cancelProjectEdit"
            class="px-4 py-2 text-slate-600 font-medium"
          >
            Cancel
          </button>
          <button
            @click="saveProjectEdit"
            class="px-6 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700"
          >
            Save
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
  Edit,
  Clock,
} from "lucide-vue-next";

const authStore = useAuthStore();
const todoStore = useTodoStore();
const router = useRouter();

const showAddProject = ref(false);
const newProjectName = ref("");
const newTodoTitle = ref("");
const newTodoDesc = ref("");
const newTodoPriority = ref("medium");
const todoFilter = ref("all");

// Project editing
const editingProjectId = ref(null);
const editingProjectName = ref("");

// Todo editing
const editingTodoId = ref(null);
const editingTodoTitle = ref("");
const editingTodoDesc = ref("");
const editingTodoPriority = ref("medium");

onMounted(async () => {
  await todoStore.fetchProjects();
  if (todoStore.currentProjectId) {
    await todoStore.fetchTodos();
  }
});

const currentProject = computed(() => {
  return todoStore.projects.find((p) => p.id === todoStore.currentProjectId);
});

const filteredTodos = computed(() => {
  if (todoFilter.value === "all") {
    return todoStore.todos;
  } else if (todoFilter.value === "todo") {
    return todoStore.todos.filter((t) => !t.completed);
  } else if (todoFilter.value === "done") {
    return todoStore.todos.filter((t) => t.completed);
  }
  return todoStore.todos;
});

const allTodosCount = computed(() => todoStore.todos.length);
const todoCount = computed(
  () => todoStore.todos.filter((t) => !t.completed).length
);
const doneCount = computed(
  () => todoStore.todos.filter((t) => t.completed).length
);

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
  // Assume UTC if string lacks timezone info
  const dateString =
    typeof date === "string" && !date.endsWith("Z") ? date + "Z" : date;
  return new Date(dateString).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const formatDateTime = (date) => {
  if (!date) return "";
  // Assume UTC if string lacks timezone info
  const dateString =
    typeof date === "string" && !date.endsWith("Z") ? date + "Z" : date;
  const d = new Date(dateString);
  return (
    d.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    }) +
    " at " +
    d.toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
    })
  );
};

const priorityButtonClass = (priority, selected) => {
  const colors = {
    low: selected
      ? "bg-sky-500 ring-2 ring-sky-200"
      : "bg-sky-300 hover:bg-sky-400",
    medium: selected
      ? "bg-amber-500 ring-2 ring-amber-200"
      : "bg-amber-300 hover:bg-amber-400",
    high: selected
      ? "bg-red-500 ring-2 ring-red-200"
      : "bg-red-300 hover:bg-red-400",
  };
  return colors[priority] || "";
};

// Project editing functions
const startEditProject = (project) => {
  editingProjectId.value = project.id;
  editingProjectName.value = project.name;
};

const saveProjectEdit = async () => {
  if (!editingProjectName.value || !editingProjectId.value) {
    cancelProjectEdit();
    return;
  }
  const projectId = editingProjectId.value;
  const projectName = editingProjectName.value;
  await todoStore.updateProject(projectId, projectName);
  cancelProjectEdit();
};

const cancelProjectEdit = () => {
  editingProjectId.value = null;
  editingProjectName.value = "";
};

// Todo editing functions
const startEditTodo = (todo) => {
  editingTodoId.value = todo.id;
  editingTodoTitle.value = todo.title;
  editingTodoDesc.value = todo.description || "";
  editingTodoPriority.value = todo.priority;
};

const saveTodoEdit = async () => {
  if (!editingTodoTitle.value || !editingTodoId.value) {
    cancelTodoEdit();
    return;
  }
  await todoStore.updateTodo(editingTodoId.value, {
    title: editingTodoTitle.value,
    description: editingTodoDesc.value,
    priority: editingTodoPriority.value,
  });
  cancelTodoEdit();
};

const cancelTodoEdit = () => {
  editingTodoId.value = null;
  editingTodoTitle.value = "";
  editingTodoDesc.value = "";
  editingTodoPriority.value = "medium";
};
</script>
