<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
// use App\Http\Controllers\UserController;
// use App\Http\Controllers\TaskController;
// use App\Http\Controllers\ProjectController;
use App\Http\Controllers\InvoiceController;
use App\Http\Controllers\SackController;
use App\Http\Controllers\TeaLeafPowderController;
use App\Http\Controllers\PacketController;


Route::post('register', [AuthController::class, 'register']);
Route::post('login', [AuthController::class, 'login']);

Route::group(['middleware' => 'api', 'auth:api'], function () {

    Route::get('/user', [AuthController::class, 'user']);
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::apiResource('invoices', InvoiceController::class);
    Route::apiResource('sacks', SackController::class);
    Route::apiResource('powders', TeaLeafPowderController::class);
    Route::apiResource('packets', PacketController::class);

    Route::get('packets/search/{search_term}', [PacketController::class, 'search']);




    // Route::get('tasks/upcoming-deadlines', [TaskController::class, 'upcomingDeadlines']);
    // Route::get('tasks/filter', [TaskController::class, 'filterTasks']);

    // // User-specific routes for task management
    // Route::get('tasks', [TaskController::class, 'index']);
    // Route::get('tasks/{id}', [TaskController::class, 'show']);
    // Route::post('tasks', [TaskController::class, 'store']);
    // Route::put('tasks/{task}', [TaskController::class, 'update']);
    // Route::patch('tasks/{task}/complete', [TaskController::class, 'markAsCompleted']);
    // Route::delete('tasks/{task}', [TaskController::class, 'destroy']);
    
    // // Route for dashboard analytics
    // Route::get('dashboard/analytics', [TaskController::class, 'dashboardAnalytics']);

    // Route::get('projects', [ProjectController::class, 'index']);
    // Route::post('projects', [ProjectController::class, 'store']);
    // Route::get('projects/{project}', [ProjectController::class, 'show']);
    // Route::put('projects/{project}', [ProjectController::class, 'update']);
    // Route::delete('projects/{project}', [ProjectController::class, 'destroy']);

    // Route::group(['middleware' => 'admin'], function () {
    //     // Admin routes for managing users
    //     Route::get('admin/users', [UserController::class, 'index']);
    //     Route::get('admin/users/{id}', [UserController::class, 'show']);
    //     Route::post('admin/users', [UserController::class, 'store']);
    //     Route::put('admin/users/{id}', [UserController::class, 'update']);
    //     Route::delete('admin/users/{id}', [UserController::class, 'destroy']);

    //     // Admin routes for viewing all tasks and analytics
    //     Route::get('admin/tasks', [TaskController::class, 'allTasks']);
    //     Route::get('admin/analytics', [TaskController::class, 'taskAnalytics']);
    // });
});