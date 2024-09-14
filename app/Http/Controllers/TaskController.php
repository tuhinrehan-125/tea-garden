<?php

namespace App\Http\Controllers;

use App\Models\Task;
use Illuminate\Http\Request;
use Carbon\Carbon;

class TaskController extends Controller
{
    // Method to get all tasks for the authenticated user
    public function index(Request $request)
    {
        $tasks = $request->user()->tasks()->get();
        return response()->json($tasks);
    }

    // Method to get dashboard analytics for the authenticated user
    public function dashboardAnalytics(Request $request)
    {
        $user = $request->user();

        // Total number of tasks
        $totalTasks = $user->tasks()->count();

        // Number of completed tasks
        $completedTasks = $user->tasks()->where('status', 'completed')->count();

        // Number of pending tasks
        $pendingTasks = $user->tasks()->where('status', 'pending')->count();

        // Tasks with upcoming deadlines
        $upcomingTasks = $user->tasks()
                              ->where('status', '!=', 'completed')
                              ->whereDate('deadline', '>=', Carbon::now())
                              ->count();

        return response()->json([
            'total_tasks' => $totalTasks,
            'completed_tasks' => $completedTasks,
            'pending_tasks' => $pendingTasks,
            'upcoming_tasks' => $upcomingTasks,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'priority' => 'required|in:low,medium,high',
            'status' => 'required|in:pending,completed',
            'deadline' => 'nullable|date',
            'project_id' => 'nullable|exists:projects,id',
            'due_date' => 'nullable|date',
        ]);

        $task = $request->user()->tasks()->create($request->all());

        return response()->json($task, 201);
    }

    public function update(Request $request, Task $task)
    {
        $this->authorize('update', $task);

        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'priority' => 'required|in:low,medium,high',
            'status' => 'required|in:pending,completed',
            'deadline' => 'nullable|date',
            'project_id' => 'nullable|exists:projects,id',
            'due_date' => 'nullable|date',
        ]);

        $task->update($request->all());

        return response()->json($task);
    }

    // Method to mark a task as completed
    public function markAsCompleted(Task $task)
    {
        $this->authorize('update', $task);

        $task->status = 'completed';
        $task->save();

        return response()->json($task);
    }

    public function destroy(Task $task)
    {
        $this->authorize('delete', $task);

        $task->delete();

        return response()->json(null, 204);
    }

    public function allTasks()
    {
        $tasks = Task::all();
        return response()->json($tasks);
    }

    public function taskAnalytics()
    {
        $totalTasks = Task::count();
        $completedTasks = Task::where('status', 'completed')->count();
        $pendingTasks = Task::where('status', 'pending')->count();

        return response()->json([
            'total_tasks' => $totalTasks,
            'completed_tasks' => $completedTasks,
            'pending_tasks' => $pendingTasks,
        ]);
    }

    public function upcomingDeadlines(Request $request)
    {
        $user = $request->user();

        $upcomingTasks = $user->tasks()
                            ->where('status', '!=', 'completed')
                            ->whereDate('deadline', '>=', now())
                            ->orderBy('deadline', 'asc')
                            ->get();

        return response()->json($upcomingTasks);
    }

    public function filterTasks(Request $request)
    {
        // return $request->all();
        $user = $request->user();

        $tasks = $user->tasks()
                    ->when($request->input('category'), function ($query, $category) {
                        return $query->where('category', $category);
                    })
                    ->when($request->input('priority'), function ($query, $priority) {
                        return $query->where('priority', $priority);
                    })
                    ->when($request->input('status'), function ($query, $status) {
                        return $query->where('status', $status);
                    })
                    ->get();

        return response()->json($tasks);
    }

}

