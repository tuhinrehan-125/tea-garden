<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use Illuminate\Support\Facades\Auth;
use App\Http\Requests\UserLoginRequest;
use App\Http\Requests\UserRegisterRequest;

class AuthController extends Controller
{
    /**
     * Create a new AuthController instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('auth:api', ['except' => ['login', 'register']]);
    }

    public function register(UserRegisterRequest $request){
        $user = User::create([
            'email' => $request->email,
            'name' => $request->name,
            'password' => bcrypt($request->password),
        ]);

        if(!$token = auth()->attempt($request->only(['email', 'password']))){
            return abort(401);
        }

        return (new UserResource($request->user()))->additional([
            'meta' => [
                'token' => $token,
            ],
        ]);
    }

    public function login(UserLoginRequest $request){
        if(!$token = auth()->attempt($request->only(['email', 'password']))){
            return response()->json([
                'errors' => [
                    'message' => ['Sorry we cant find you with those details.'],
                ],
            ], 422);
        }

        return (new UserResource($request->user()))->additional([
            'meta' => [
                'token' => $token,
            ],
        ]);
    }

    // Get the authenticated User
    public function user(Request $request){
        return new UserResource($request->user());
    }

    // Get the authenticated User
    public function me()
    {
        return response()->json(auth()->user());
    }

    public function logout()
    {
        auth()->logout();

        return response()->json(['message' => 'Successfully logged out']);
    }

    // Refresh a token.
    public function refresh()
    {
        return $this->respondWithToken(auth()->refresh());
    }

    // Get the token array structure.
    protected function respondWithToken($token)
    {
        return response()->json([
            'access_token' => $token,
            'token_type' => 'bearer',
            'expires_in' => auth()->factory()->getTTL() * 60
        ]);
    }
}