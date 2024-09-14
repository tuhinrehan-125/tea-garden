<?php

namespace App\Policies;

use App\Models\Project;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class ProjectPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        //
    }

    // Determine if the user can view the project
    public function view(User $user, Project $project)
    {
        return $user->id === $project->user_id;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        //
    }

    // Determine if the user can update the project
    public function update(User $user, Project $project)
    {
        return $user->id === $project->user_id;
    }

    // Determine if the user can delete the project
    public function delete(User $user, Project $project)
    {
        return $user->id === $project->user_id;
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Project $project): bool
    {
        //
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Project $project): bool
    {
        //
    }
}
