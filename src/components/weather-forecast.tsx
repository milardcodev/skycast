import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { ArrowDown, ArrowUp, Droplets, Wind } from "lucide-react";
import { format } from "date-fns";
import type { ForecastData } from "@/api/types";

interface WeatherForecastProps {
  data: ForecastData;
}

interface DailyForecast {
  date: number;
  temp_min: number;
  temp_max: number;
  humidity: number;
  wind: number;
  weather: {
    id: number;
    main: string;
    description: string;
    icon: string;
  };
}

export function WeatherForecast({ data }: WeatherForecastProps) {
  const dailyForecasts = data.list.reduce((acc, forecast) => {
    const date = format(new Date(forecast.dt * 1000), "yyyy-MM-dd");

    if (!acc[date]) {
      acc[date] = {
        temp_min: forecast.main.temp_min,
        temp_max: forecast.main.temp_max,
        humidity: forecast.main.humidity,
        wind: forecast.wind.speed,
        weather: forecast.weather[0],
        date: forecast.dt,
      };
    } else {
      acc[date].temp_min = Math.min(acc[date].temp_min, forecast.main.temp_min);
      acc[date].temp_max = Math.max(acc[date].temp_max, forecast.main.temp_max);
    }

    return acc;
  }, {} as Record<string, DailyForecast>);

  const nextDays = Object.values(dailyForecasts).slice(1, 6);
  const formatTemp = (temp: number) => `${Math.round(temp)}°`;

  return (
    <Card>
      <CardHeader>
        <CardTitle>5-Day Forecast</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          {nextDays.map((day) => (
            <div
              key={day.date}
              className="grid grid-cols-2 sm:grid-cols-3 items-center gap-2 rounded-lg border p-2"
            >
              <div className="text-center sm:text-left col-span-2 sm:col-span-1">
                <p className="font-medium text-xs sm:text-sm">
                  {format(new Date(day.date * 1000), "EEE, MMM d")}
                </p>
                <p className="text-xs sm:text-sm text-muted-foreground capitalize">
                  {day.weather.description}
                </p>
              </div>

              <div className="flex justify-center gap-2 sm:gap-4">
                <span className="flex items-center text-red-500 text-xs sm:text-sm">
                  <ArrowUp className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />
                  {formatTemp(day.temp_max)}
                </span>
                <span className="flex items-center text-blue-500 text-xs sm:text-sm">
                  <ArrowDown className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />
                  {formatTemp(day.temp_min)}
                </span>
              </div>

              <div className="flex justify-center sm:justify-end gap-2 text-xs sm:text-sm">
                <span className="flex items-center gap-1">
                  <Droplets className="h-3 w-3 sm:h-4 sm:w-4 text-blue-500" />
                  <span>{day.humidity}%</span>
                </span>
                <span className="flex items-center gap-1">
                  <Wind className="h-3 w-3 sm:h-4 sm:w-4 text-blue-500" />
                  <span>{day.wind}m/s</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
