<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class ApiController extends Controller
{
    public function getWeather(Request $request)
    {
        $city = $request->query('city');
        $lat = $request->query('lat');
        $lon = $request->query('lon');
        $apiKey = config('services.openweather.key'); // Перенесем ключ в конфиг

        try {
            // Определяем параметры запроса в зависимости от типа поиска
            $params = [
                'appid' => $apiKey,
                'units' => 'metric',
                'lang' => 'ru'
            ];

            if ($city) {
                $params['q'] = $city;
            } else {
                $params['lat'] = $lat;
                $params['lon'] = $lon;
            }

            $weatherResponse = Http::get("https://api.openweathermap.org/data/2.5/weather", $params);
            $forecastResponse = Http::get("https://api.openweathermap.org/data/2.5/forecast", $params);

            $weatherData = $weatherResponse->json();
            $forecastData = $this->processForecastData($forecastResponse->json()['list']);

            return response()->json([
                'current' => $weatherData,
                'forecast' => $forecastData
            ]);

        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    private function processForecastData($list)
    {
        $dailyData = [];

        foreach ($list as $item) {
            $date = explode(" ", $item['dt_txt'])[0];
            $temp = $item['main']['temp'];

            if (!isset($dailyData[$date])) {
                $dailyData[$date] = [
                    'min' => $temp,
                    'max' => $temp,
                    'icon' => $item['weather'][0]['icon'],
                    'description' => $item['weather'][0]['description']
                ];
            } else {
                $dailyData[$date]['min'] = min($dailyData[$date]['min'], $temp);
                $dailyData[$date]['max'] = max($dailyData[$date]['max'], $temp);
            }
        }

        return array_map(function($date, $data) {
            return array_merge(['date' => $date], $data);
        }, array_keys($dailyData), $dailyData);
    }
}