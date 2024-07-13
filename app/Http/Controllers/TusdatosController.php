<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;
use App\Models\Consult;

class TusdatosController extends Controller
{
    public function antecedentes(Request $request)
    {
        $fecha = date('d/m/Y', strtotime($request->date));

        $data = [
            'doc' => $request->documento,
            'typedoc' => $request->tipodoc,
            'fechaE' => $request->date,
        ];

        /*  dd($data); */
        $correo = env('CORREO_TUSDATOS');
        $pass = env('PASS_TUSDATOS');
        $endpoint = env('ENDPOINT_TUSDATOS');

        try {
            // Lanzar la solicitud
            $launch = Http::withBasicAuth($correo, $pass)->post("{$endpoint}/launch/", $data);

            if ($launch->failed()) {
                Log::error('Error al lanzar la solicitud', ['response' => $launch->body()]);
                return response()->json(['error' => 'Failed to launch request'], 500);
            }

            $launchData = $launch->json();

            if (!isset($launchData['jobid']) && !isset($launchData['id'])) {
                Log::error('Job ID no encontrado', ['response' => $launchData]);
                return response()->json(['error' => 'Job ID not found'], 500);
            }

            $jobId = $launchData['jobid'] ?? $launchData['id'];

            // Obtener el reporte en formato JSON
            $results = Http::withBasicAuth($correo, $pass)->get("{$endpoint}/report_json/{$jobId}");

            if ($results->failed()) {
                Log::error('Error al obtener el reporte', ['response' => $results->body()]);
                return response()->json(['error' => 'Failed to get report'], 500);
            }

            $json = $results->json();

            $nombre = $json['nombre'] ?? null;
            $fechaR = $json['defunciones_registraduria']['date'] ?? null;


            $consult = Consult::create([
                'doc' => $request->documento,
                'typedoc' => $request->tipodoc,
                'fechaE' => $request->date,
                'typeofentry' => $request->value,
                'name' => $nombre,
                'fechaR' => $fechaR,
            ]);
            return redirect()
                ->route('report.index')
                ->with(['data' => $json]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $exception) {
            $errorMessage = 'Error: Usuario con cédula incorrecta.';
            Log::error($errorMessage, ['exception' => $exception]);
            return redirect()->route('report.index')->with('errorMessage', $errorMessage);
        } catch (\Illuminate\Http\Client\RequestException $exception) {
            $errorMessage = $exception->getMessage();
            Log::error($errorMessage, ['exception' => $exception]);
            return redirect()->back()->with('errorMessage', $errorMessage);
        }
    }
}
