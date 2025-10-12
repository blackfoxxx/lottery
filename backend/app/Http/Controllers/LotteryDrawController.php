<?php

namespace App\Http\Controllers;

use App\Models\LotteryDraw;
use Illuminate\Http\Request;
use Carbon\Carbon;

class LotteryDrawController extends Controller
{
    public function index()
    {
        return LotteryDraw::with('prize')->get();
    }

    public function show(LotteryDraw $draw)
    {
        return $draw->load('prize');
    }

    public function countdown(LotteryDraw $draw)
    {
        $now = Carbon::now();
        $drawTime = Carbon::parse($draw->draw_date);

        if ($drawTime->isPast()) {
            return response()->json(['message' => 'Draw has already occurred'], 400);
        }

        $remaining = $now->diffInSeconds($drawTime, false);

        return response()->json([
            'remaining_seconds' => $remaining,
            'draw_date' => $draw->draw_date,
        ]);
    }
}
