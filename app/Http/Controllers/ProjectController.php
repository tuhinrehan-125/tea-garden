<?php

namespace App\Http\Controllers;

use App\Models\Project;
use Illuminate\Http\Request;

class ProjectController extends Controller
{
    // Get all projects for the authenticated user
    public function index(Request $request)
    {
        $projects = $request->user()->projects()->with('tasks')->get();
        return response()->json($projects);
    }

    // Store a new project
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $project = $request->user()->projects()->create($request->all());

        return response()->json($project, 201);
    }

    // Show a specific project
    public function show(Project $project)
    {
        $this->authorize('view', $project);

        return response()->json($project->load('tasks'));
    }

    // Update an existing project
    public function update(Request $request, Project $project)
    {
        $this->authorize('update', $project);

        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $project->update($request->all());

        return response()->json($project);
    }

    // Delete a project
    public function destroy(Project $project)
    {
        $this->authorize('delete', $project);

        $project->delete();

        return response()->json(null, 204);
    }
}
