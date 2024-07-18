<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Consult;

class ReportController extends Controller
{
    public function index()
    {
        $data = session('data');

        if (!$data) {
            return redirect()->back()->with('errorMessage', 'No data found for the report.');
        }
        return Inertia::render('Reporte', ['data' => $data]);
    }
    public function consult()
    {
        $historicos = Consult::all();
        return Inertia::render('Consult',['historicos' => $historicos]);
    }

    public function scanner()
    {

        return Inertia::render('PageScanner');
    }
    public function showReport($doc)
    {
        $consult = Consult::where('doc', $doc)->firstOrFail();
        $json = $consult->report;
        return Inertia::render('Reporte', ['data' => $json]);
    }

}
