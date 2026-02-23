"use client"

import { useTheme } from 'next-themes';
import { cloneElement, useEffect, useState } from 'react';
import { ActivityCalendar } from 'react-activity-calendar';
import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';

async function fetchCalendarData(username: string, year: number | 'last') {
// ... existing fetch function ...
  const response = await fetch(`https://github-contributions-api.jogruber.de/v4/${username}?y=${year}`);
  const data = await response.json();
  if (!response.ok) {
    throw Error(`Fetching GitHub contribution data for "${username}" failed: ${data.error}`);
  }
  return data;
}

export default function ContributionChart() {
  const { theme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [selectedYear, setSelectedYear] = useState<number | 'last'>('last');
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  
  // Generate last 5 years
  const currentYear = new Date().getFullYear();
  const years = [currentYear, currentYear - 1, currentYear - 2, currentYear - 3, currentYear - 4];

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const yearToFetch = selectedYear === 'last' ? currentYear : selectedYear;
        const result = await fetchCalendarData('freewindias', yearToFetch);
        setData(result);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [selectedYear, currentYear]);

  if (!mounted) {
    return null;
  }

  const currentTheme = theme === 'system' ? systemTheme : theme;
  
  // Calculate total contributions
  const totalContributions = data?.contributions?.reduce((acc: number, day: any) => acc + day.count, 0) || 0;
  
  // Custom Theme Colors matching GitHub
  const gitHubTheme = {
    light: ['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39'],
    dark: ['#161b22', '#0e4429', '#006d32', '#26a641', '#39d353'],
  };

  const themeColors = currentTheme === 'dark' ? gitHubTheme.dark : gitHubTheme.light;

  return (
    <div className="flex flex-col md:flex-row gap-8 w-full max-w-5xl">
      <div className="flex-1 flex flex-col gap-3">
        <div className="flex justify-between items-center">
            <h2 className="text-base font-normal">
              <span className="font-medium text-foreground">{totalContributions} contributions</span> in {selectedYear === 'last' ? 'the last year' : selectedYear}
            </h2>
        </div>
        
        <div className="w-full flex justify-center p-4 border rounded-xl bg-card text-card-foreground shadow-sm min-h-[180px] items-center">
           {loading ? (
             <div className="animate-pulse flex space-x-4">
                <div className="h-24 w-full bg-muted rounded"></div>
             </div>
           ) : data ? (
            <div className="w-full overflow-x-auto">
              <ActivityCalendar 
                data={data.contributions}
                theme={{
                  light: themeColors,
                  dark: themeColors,
                }}
                colorScheme={currentTheme === 'dark' ? 'dark' : 'light'}
                blockSize={12}
                blockMargin={4}
                fontSize={12}
                renderBlock={(block, activity) =>
                    cloneElement(block, {
                      'data-tooltip-id': 'github-tooltip',
                      'data-tooltip-content': `${activity.count} contributions on ${activity.date}`,
                    })
                 }
              />

              <Tooltip id="github-tooltip" variant={currentTheme === 'dark' ? 'dark' : 'light'} />
            </div>
           ) : (
             <div>No data available</div>
           )}
        </div>
        <div className="flex justify-between text-xs text-muted-foreground px-2">
            <a href="https://docs.github.com/en/account-and-profile/setting-up-and-managing-your-github-profile/managing-contribution-graphs-on-your-profile/why-are-my-contributions-not-showing-up-on-my-profile" target="_blank" className="hover:text-blue-500 hover:underline">
                Learn how we count contributions
            </a>
        </div>
      </div>

      <div className="flex flex-col gap-2 min-w-[100px]">
        {years.map((year) => (
          <button
            key={year}
            onClick={() => setSelectedYear(year === currentYear ? 'last' : year)}
            className={`px-4 py-2 rounded-md text-sm transition-colors text-left ${
              (selectedYear === year || (selectedYear === 'last' && year === currentYear))
                ? 'bg-blue-600 text-white'
                : 'bg-transparent hover:bg-muted text-muted-foreground'
            }`}
          >
            {year}
          </button>
        ))}
      </div>
      <Tooltip id="github-tooltip" variant={currentTheme === 'dark' ? 'dark' : 'light'} style={{ zIndex: 9999 }} />
    </div>
  );
}
