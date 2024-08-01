<?php
namespace App\Http\Controllers;
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;
use App\Models\Consult;
use App\Models\User;
use Carbon\Carbon;

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
           'documento' => 'required|regex:/^[a-zA-Z0-9]{6,10}$/',
            'tipodoc' => 'required',
            'value' => 'required'
        ], [
            'documento.required' => 'El número de cédula es obligatorio.',
            'documento.digits_between' => 'El número de cédula debe tener entre 6 y 10 dígitos.',
            'tipodoc.required' => 'El tipo de documento es obligatorio.',
            'value.required' => 'El campo de tipo es obligatorio.'
        ]);

        $fechaExp = $request->date ? date('d/m/Y', strtotime($request->date)) : null;
        $fechaR = Carbon::now()->format('d/m/Y');

        try {
            $consult = Consult::where('doc', $request->documento)->first();

            if ($consult) {
                $consult->fechaE = $fechaExp;
                $consult->save();


                $json = $consult->report;
            } else {

                $identifier = $this->launchRequest($request->documento, $request->tipodoc, $fechaExp);
                if ($this->isFinalizedId($identifier)) {

                    $json = $this->fetchFinalReport($identifier);

                } else {
                    /* $verificationResponse = $this->launchVerify($request->documento, $fechaExp);

                    if (!empty($verificationResponse['findings'])) {
                        $errors = implode(', ', $verificationResponse['findings']);

                        return redirect()->back()->withErrors([$errors]);
                    } */
                    $json = $this->fetchReportAsync($identifier);

                }

                $nombre = $json['nombre'] ?? null;


                $consult = Consult::create([
                    'doc' => $request->documento,
                    'typedoc' => $request->tipodoc,
                    'fechaE' => $fechaExp,
                    'typeofentry' => $request->value,
                    'name' => $nombre,
                    'fechaR' => $fechaR,
                    'report' => $json,
                ]);
            }

            return redirect()->route('report.show', ['doc' => $request->documento]);
        } catch (\Exception $exception) {
            return redirect()->back()->with('errorMessage', $exception->getMessage());
        }
    }

    private function launchVerify($documento, $fechaExp)
{
    $data = [
        'cedula' => $documento,
        'fechaE' => $fechaExp,
    ];

    $response = Http::withBasicAuth($this->correo, $this->pass)
        ->post("{$this->endpoint}/launch/verify", $data);
    $responseData = $response->json();


    if ($response->failed()) {
        throw new \Exception('Error al verificar la cédula');
    }

    Log::info('Resultado de la verificación:', $responseData);

    return $responseData;
}

    private function launchRequest($documento, $tipodoc, $fechaExp, $name = null)
    {
        $data = [
            'doc' => $documento,
            'typedoc' => $tipodoc,
            'fechaE' => $fechaExp,
            'name' => $name,

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
            ->timeout(210)
            ->get("{$this->endpoint}/report_json/{$id}");


        if ($response->successful()) {
            return $response->json();
        } else {
            throw new \Exception('Error al obtener el reporte');
        }
    }
    private function getPlans()
    {

        $users = User::whereDoesntHave('roles', function ($query) {
            $query->where('name', 'admin');
        })->count();

        $cacheKey = 'plans_and_queries';
        $cacheDuration = 60;


        $cachedData = cache($cacheKey);

        if ($cachedData) {

            \Log::info('Datos obtenidos de la caché');
            return $cachedData;
        }


        $response = Http::withBasicAuth($this->correo, $this->pass)
            ->get("{$this->endpoint}/plans");

        if ($response->successful()) {
            $plans = $response->json();
        } else {
            throw new \Exception('Error al obtener los planes');
        }


        $responseQuerys = Http::withBasicAuth($this->correo, $this->pass)
            ->get("{$this->endpoint}/querys");

        if ($responseQuerys->successful()) {
            $queries = $responseQuerys->json();
        } else {
            throw new \Exception('Error al obtener las consultas');
        }


        $data = [
            'plans' => $plans,
            'queries' => $queries,
            'users' => $users
        ];


        cache([$cacheKey => $data], $cacheDuration);
        \Log::info('Datos guardados en la caché');

        return $data;
    }    public function showPlans()
    {
        try {
            $data = $this->getPlans();
            return Inertia::render('Admin/DashboardAdmin', $data);
        } catch (\Exception $exception) {
            return redirect()->back()->with('errorMessage', $exception->getMessage());
        }
    }

    private function fetchReportAsync($jobId)
    {
        set_time_limit(210);

        $maxAttempts = 15;
        $attempt = 0;
        $delay = 15;

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
            ->timeout(210)
            ->get("{$this->endpoint}/results/{$jobId}");

        if ($response->failed()) {
            throw new \Exception('Error al consultar el estado del job');
        }

        $statusData = $response->json();
        Log::info('Estado del job consultado:', $statusData);
        return $statusData;
    }

    private function isFinalizedId($identifier)
    {
        return strlen($identifier) !== 36;
    }
}
