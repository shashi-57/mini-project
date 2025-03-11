<?php

namespace App\Http\Controllers;

use App\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Tymon\JWTAuth\Facades\JWTAuth;

/**
 * @group Auth
 */
class AuthController extends Controller
{
    public function __construct()
    {

    }

    /**
     * Get token
     *
     * @bodyParam email string required User email. Example: example@email.com
     * @bodyParam password string required User password. Example: 123456
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function login(Request $request)
    {
        // Log the incoming request data for debugging
        \Log::info('Login attempt', $request->only('email', 'password'));
    
        // Log the TTL (time-to-live) value to check if it's correct
        \Log::info('TTL:', [Auth::factory()->getTTL()]);
    
        $credentials = $request->only('email', 'password');
    
        if (Auth::attempt(['email' => $credentials['email'], 'password' => $credentials['password']])) {
            // User is authenticated, get the token
            $user = Auth::user();
            $token = JWTAuth::fromUser($user);
    
            return $this->respondWithToken($token);
        }
    
        return response()->json(['data' => 'wrong_credential'], 422);
    }
    



    /**
     * Get authenticated user
     *
     * @authenticated
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function self()
    {
        $self = User::with('currency')->find(Auth::id());
        return response()->json($self);
    }

    /**
     * Logout user
     *
     * @authenticated
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function logout()
    {
        Auth::logout();

        return response()->json(['data' => 'logout_successful']);
    }

    /**
     * Refresh token
     *
     * @authenticated
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function refresh()
    {
        try {
            $newToken = Auth::refresh();
            return $this->respondWithToken($newToken);
        } catch (\Exception $e) {
            return response()->json(['data' => 'invalid_or_expired_token'], 401);
        }
    }

    /**
     * Get the token array structure
     *
     * @param $token
     * @return \Illuminate\Http\JsonResponse
     */
    protected function respondWithToken($token)
    {
        return response()->json([
            'user' => JWTAuth::setToken($token)->toUser()->load('currency'),
            'access_token' => $token,
            'token_type' => 'bearer',
            'token_created' => time(),
            'expires_in' => (int)Auth::factory()->getTTL() * 60 // Converting response to seconds
        ], 200);
    }


}