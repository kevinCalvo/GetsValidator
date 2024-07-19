<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;
use App\Models\Consult;

class TusdatosController extends Controller
{
    private $correo;
    private $pass;
    private $endpoint;

    public function __construct()
    {
        $this->correo = env('CORREO_TUSDATOS');
        $this->pass = env('PASS_TUSDATOS');
        $this->endpoint = env('ENDPOINT_TUSDATOS');
    }

    public function antecedentes(Request $request)
    {
        $request->validate([
            'documento' => 'required|digits_between:6,10',
            'tipodoc' => 'required',
            'value' => 'required'
        ], [
            'documento.required' => 'El número de cédula es obligatorio.',
            'documento.digits_between' => 'El número de cédula debe tener entre 6 y 10 dígitos.',
            'tipodoc.required' => 'El tipo de documento es obligatorio.',
            'value.required' => 'El campo de tipo es obligatorio.'
        ]);

        try {
            $consult = Consult::where('doc', $request->documento)->first();

            if ($consult) {
                $json = $consult->report;
            } else {
                $identifier = $this->launchRequest($request->documento, $request->tipodoc, $request->date);
                if ($this->isFinalizedId($identifier)) {
                    $json = $this->fetchFinalReport($identifier);
                } else {
                    $json = $this->fetchReportAsync($identifier);


                    if ($json) {

                        $nombre = $json['nombre'] ?? null;
                        $fechaR = $json['defunciones_registraduria']['date'] ?? null;

                        $consult = Consult::create([
                            'doc' => $request->documento,
                            'typedoc' => $request->tipodoc,
                            'fechaE' => $request->date,
                            'typeofentry' => $request->value,
                            'name' => $nombre,
                            'fechaR' => $fechaR,
                            'report' => $json,
                        ]);
                        return redirect()->route('report.index')->with(['data' => $json]);
                    }
                }

                $nombre = $json['nombre'] ?? null;
                $fechaR = $json['defunciones_registraduria']['date'] ?? null;

                $consult = Consult::create([
                    'doc' => $request->documento,
                    'typedoc' => $request->tipodoc,
                    'fechaE' => $request->date,
                    'typeofentry' => $request->value,
                    'name' => $nombre,
                    'fechaR' => $fechaR,
                    'report' => $json,
                ]);
            }

            return redirect()->route('report.index')->with(['data' => $json]);
        } catch (\Exception $exception) {
            return redirect()->back()->with('errorMessage', $exception->getMessage());
        }
    }

    private function launchRequest($documento, $tipodoc, $fechaE)
    {
        $data = [
            'doc' => $documento,
            'typedoc' => $tipodoc,
            'fechaE' => $fechaE,
        ];

        $launch = Http::withBasicAuth($this->correo, $this->pass)
            ->post("{$this->endpoint}/launch/", $data);

        if ($launch->failed()) {
            throw new \Exception('Error al lanzar la solicitud');
        }

        $launchData = $launch->json();

        if (!isset($launchData['jobid']) && !isset($launchData['id'])) {
            throw new \Exception('Job ID no encontrado');
        }

        return $launchData['jobid'] ?? $launchData['id'];
    }

    private function fetchFinalReport($id)
    {
        $response = Http::withBasicAuth($this->correo, $this->pass)
            ->timeout(120)
            ->get("{$this->endpoint}/report_json/{$id}");

        if ($response->successful()) {
            return $response->json();
        } else {
            throw new \Exception('Error al obtener el reporte');
        }
    }

    private function fetchReportAsync($jobId)
    {
        set_time_limit(120);

        $maxAttempts = 14;
        $attempt = 0;
        $delay = 20;

        while ($attempt < $maxAttempts) {
            $statusResponse = $this->getJobStatus($jobId);

            if (isset($statusResponse['estado'])) {
                if ($statusResponse['estado'] === 'finalizado') {

                    return $this->fetchFinalReport($statusResponse['id']);
                } elseif ($statusResponse['estado'] === 'procesando') {
                    Log::info("Intento {$attempt}: El reporte aún está en proceso.");
                } elseif (isset($statusResponse['error'])) {
                    throw new \Exception('Error en el job: ' . $statusResponse['error']);
                }
            } else {
                throw new \Exception('Estado desconocido del job');
            }


            sleep($delay);
            $attempt++;
        }

        throw new \Exception('El reporte no se completó después de múltiples intentos.');
    }

    private function getJobStatus($jobId)
    {
        $response = Http::withBasicAuth($this->correo, $this->pass)
            ->timeout(120)
            ->get("{$this->endpoint}/results/{$jobId}");

        if ($response->failed()) {
            throw new \Exception('Error al consultar el estado del job');
        }

        $statusData = $response->json();
        Log::info('Estado del job consultado:', $statusData);
        return $statusData ;
    }

    private function isFinalizedId($identifier)
    {
        return strlen($identifier) !== 36;
    }
}
