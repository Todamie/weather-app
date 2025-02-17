<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ApiController;

// Route::get('/', function () {
//     return view('welcome');
// });


Route::get('/', function () {
    return view('index');
});

// Добавьте этот маршрут для тестирования
Route::get('/api/weather', [ApiController::class, 'getWeather']);
