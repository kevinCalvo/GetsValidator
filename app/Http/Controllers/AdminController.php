<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;


class AdminController extends Controller
{
    public function indexUser(): Response
    {
        $users = User::whereDoesntHave('roles', function ($query) {
            $query->where('name', 'admin');
        })->get();

        return Inertia::render('Admin/IndexUserAdmin', [
            'users' => $users
        ]);
    }

    public function CreateUser(): Response
    {

        return Inertia::render('Admin/CreateUserAdmin');
    }
    public function storeUser(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:'.User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ])->assignRole('user');

        event(new Registered($user));

      /*   Auth::login($user); */

        return redirect(route('indexUser.admin', absolute: false));
    }
    public function DeleteUser(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $user->delete();
        return redirect()->back()->with('success', 'el usuario se elimino correctamente.');
    }
}
