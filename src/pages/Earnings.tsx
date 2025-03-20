
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MetricCard } from '@/components/ui-custom/MetricCard';
import { StatsCard } from '@/components/ui-custom/StatsCard';
import { useAuth } from '@/contexts/auth';

const Earnings: React.FC = () => {
  const { user } = useAuth();
  const [earningsData, setEarningsData] = useState({
    totalEarnings: 0,
    weeklyEarnings: 0,
    dailyEarnings: 0,
    sessionsCount: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // In a real app, fetch data from API
    // For now, setting default values since mock data is removed
    setEarningsData({
      totalEarnings: 0,
      weeklyEarnings: 0,
      dailyEarnings: 0,
      sessionsCount: 0
    });
    setIsLoading(false);
  }, [user]);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Teacher Earnings</h1>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="p-4">
                <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="h-8 bg-gray-200 rounded w-2/3"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <MetricCard
            title="Total Earnings"
            value={earningsData.totalEarnings}
            icon="dollar-sign"
            trend={{
              value: 0,
              label: "from last month",
              direction: "up"
            }}
            valuePrefix="$"
          />
          <MetricCard
            title="Weekly Earnings"
            value={earningsData.weeklyEarnings}
            icon="trending-up"
            trend={{
              value: 0,
              label: "from last week",
              direction: "up"
            }}
            valuePrefix="$"
          />
          <MetricCard
            title="Daily Earnings"
            value={earningsData.dailyEarnings}
            icon="calendar"
            trend={{
              value: 0,
              label: "from yesterday",
              direction: "down"
            }}
            valuePrefix="$"
          />
          <MetricCard
            title="Sessions Count"
            value={earningsData.sessionsCount}
            icon="users"
            trend={{
              value: 0,
              label: "from last month",
              direction: "up"
            }}
          />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <StatsCard 
          title="Monthly Earnings"
          subtitle="Total earnings per month"
          type="bar"
          data={[
            { name: 'Jan', value: 0 },
            { name: 'Feb', value: 0 },
            { name: 'Mar', value: 0 },
            { name: 'Apr', value: 0 },
            { name: 'May', value: 0 },
            { name: 'Jun', value: 0 },
          ]}
          dataKey="value"
          categoryKey="name"
          valuePrefix="$"
          isLoading={isLoading}
        />
        <StatsCard 
          title="Sessions Distribution"
          subtitle="By payment status"
          type="pie"
          data={[
            { name: 'Paid', value: 0, color: '#10b981' },
            { name: 'Pending', value: 0, color: '#f59e0b' },
            { name: 'Partially Paid', value: 0, color: '#3b82f6' },
          ]}
          dataKey="value"
          categoryKey="name"
          isLoading={isLoading}
        />
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Upcoming Payments</h2>
        <Card>
          <CardHeader>
            <CardTitle>No upcoming payments</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">When you have sessions with pending payments, they will appear here.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Earnings;
