<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class DataController extends Controller
{
    public function index()
    {
        $data = ['message' => 'Hello from Laravel'];
        return response()->json($data);
    }
}
