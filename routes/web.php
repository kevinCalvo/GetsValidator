<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\TusdatosController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\AdminController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {

    return Redirect::route('login');
});

Route::middleware('auth')->group(function () {

    Route::post('/antecedentes', [TusdatosController::class, 'antecedentes'])->name('antecedentes');
    Route::get('/report', [ReportController::class, 'index'])->name('report.index');
    Route::get('/historico', [ReportController::class, 'consult'])->name('consult.index');
    Route::get('/report/{doc}', [ReportController::class, 'showReport'])->name('report.show');

    Route::get('/scanner', [ReportController::class, 'scanner'])->name('scanner.index');

});
Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware(['auth','verified','role:admin'])->group(function () {
    Route::get('/admin-dashboard',[TusdatosController::class,'showPlans'] )->name('dashboard.admin');
    Route::get('/admin-user',[AdminController::class,'indexUser'] )->name('indexUser.admin');
    Route::get('/admin-user/create',[AdminController::class,'CreateUser'] )->name('CreateUser.admin');
    Route::post('/admin-user/create',[AdminController::class,'storeUser'] )->name('StoreUser.admin');
    Route::delete('/admin-user/{id}',[AdminController::class,'DeleteUser'] )->name('DeleteUser.admin');

});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
