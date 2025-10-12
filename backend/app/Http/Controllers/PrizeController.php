<?php

namespace App\Http\Controllers;

use App\Models\Prize;
use Illuminate\Http\Request;

class PrizeController extends Controller
{
    public function index()
    {
        return Prize::all();
    }

    public function show(Prize $prize)
    {
        return $prize;
    }
}
