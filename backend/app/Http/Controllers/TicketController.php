<?php

namespace App\Http\Controllers;

use App\Models\Ticket;
use Illuminate\Http\Request;

class TicketController extends Controller
{
    public function index()
    {
        return auth()->user()->tickets()->with(['product', 'order'])->get();
    }

    public function show(Ticket $ticket)
    {
        $this->authorize('view', $ticket);
        return $ticket->load(['product', 'order']);
    }
}
