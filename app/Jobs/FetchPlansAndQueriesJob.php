<?php
namespace App\Jobs;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use App\Models\User;
use App\Models\PlansAndQueries;

class FetchPlansAndQueriesJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $correo;
    protected $pass;
    protected $endpoint;

    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct($correo, $pass, $endpoint)
    {
        $this->correo = env('CORREO_TUSDATOS');
        $this->pass = env('PASS_TUSDATOS');
        $this->endpoint = env('ENDPOINT_TUSDATOS');

    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        Log::info('FetchPlansAndQueriesJob started');

        try {
            $users = User::whereDoesntHave('roles', function ($query) {
                $query->where('name', 'admin');
            })->count();
            Log::info('Users count retrieved: ' . $users);

            $response = Http::withBasicAuth($this->correo, $this->pass)
                ->get("{$this->endpoint}/plans");

            if ($response->successful()) {
                $plans = $response->json();
                Log::info('Plans retrieved successfully');
            } else {
                throw new \Exception('Error al obtener los planes: ' . $response->body());
            }

            $responseQuerys = Http::withBasicAuth($this->correo, $this->pass)
                ->get("{$this->endpoint}/querys");

            if ($responseQuerys->successful()) {
                $queries = $responseQuerys->json();
                Log::info('Queries retrieved successfully');
            } else {
                throw new \Exception('Error al obtener las consultas: ' . $responseQuerys->body());
            }

            $cacheKey = 'plans_and_queries';
            Cache::put($cacheKey, [
                'plans' => $plans,
                'queries' => $queries,
                'users' => $users,

            ], now()->addMinutes(60));


        } catch (\Exception $e) {
            Log::error('FetchPlansAndQueriesJob failed: ' . $e->getMessage());
            throw $e;
        }
        Log::info('FetchPlansAndQueriesJob finish');
    }
}
