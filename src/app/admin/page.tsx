'use client';

import React, { useEffect, useState } from 'react';
import CountUp from 'react-countup'; // Import CountUp component
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Overview } from './components/overview';
import { DataTableDemo } from './components/recent-cleaning';
import PieChartBox from './components/Piechart';
import Earnings from './components/Earnings';


interface Data{
  Current_Month_Users:number
}
export default function Home() {
  const [currentMonthRevenue, setCurrentMonthRevenue] = useState('0.00');
  const [revenuePercentageDifference, setRevenuePercentageDifference] = useState('0.00%');
  const [usersRegistered, setUsersRegistered] = useState(0);
  const [usersPercentageDifference, setUsersPercentageDifference] = useState('0.00%');
  const [driversRegistered, setDriversRegistered] = useState(0);
  const [driversPercentageDifference, setDriversPercentageDifference] = useState('0.00%');
  const [pickupCount, setPickupCount] = useState(0);
  const [pickupPercentageDifference, setPickupPercentageDifference] = useState('0.00%');
  // const [activeNow, setActiveNow] = useState(0);
  // const [activeNowPercentageDifference, setActiveNowPercentageDifference] = useState('0.00%');

  useEffect(() => {
    async function fetchData() {
      try {
        const [usersResponse, driversResponse] = await Promise.all([
          fetch('/api/GET/Count/getUserCount'),
          fetch('/api/GET/Count/getDriverCount'),
        ]);

        const usersData = await usersResponse.json();
        const driversData = await driversResponse.json();

        setUsersRegistered(usersData.count);
        setDriversRegistered(driversData.count);

        // Fetch other data if needed, for example, pickups
        // const pickupsResponse = await fetch('/api/GET/Dashboard/getPickups');
        // const pickupsData = await pickupsResponse.json();
        // setPickupCount(pickupsData.count);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }

    fetchData();
  }, []);
  // const {data:session , status}= useSession()

  return (
    <>
      <h2 className="text-3xl font-bold tracking-tight my-4">Dashboard</h2>

      {/* <h1>{session?.user.name}</h1> */}
      <div className="flex-1 space-y-4 overflow-x-auto">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {/* <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-semibold">
                Total Revenue
              </CardTitle>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="h-4 w-4 text-muted-foreground"
              >
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            </CardHeader>
            <CardContent>
              <CountUp start={0} end={parseFloat(currentMonthRevenue)} duration={2.5} separator="," decimal="." decimals={2} prefix="$" className="text-2xl font-bold text-[#48a0ff]" />
              <p className="text-xs text-muted-foreground">
                {revenuePercentageDifference} from last month
              </p>
            </CardContent>
          </Card> */}

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-semibold">
                Users Registered
              </CardTitle>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="h-4 w-4 text-muted-foreground"
              >
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </CardHeader>
            <CardContent>
              <CountUp start={0} end={usersRegistered} duration={2.5} separator="," prefix="+" className="text-2xl font-bold text-[#48a0ff]" />
              <p className="text-xs text-muted-foreground">
                {usersPercentageDifference} from last month
              </p>
            </CardContent>
          </Card>

         <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-semibold">
                Drivers Registered
              </CardTitle>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="h-4 w-4 text-muted-foreground"
              >
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </CardHeader>
            <CardContent>
              <CountUp start={0} end={driversRegistered} duration={2.5} separator="," prefix="+" className="text-2xl font-bold text-[#48a0ff]" />
              <p className="text-xs text-muted-foreground">
                {driversPercentageDifference} from last month
              </p>
            </CardContent>
          </Card>
{/*
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-semibold">Pickup</CardTitle>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="h-4 w-4 text-muted-foreground"
              >
                <rect width="20" height="14" x="2" y="5" rx="2" />
                <path d="M2 10h20" />
              </svg>
            </CardHeader>
            <CardContent>
              <CountUp start={0} end={pickupCount} duration={2.5} separator="," prefix="+" className="text-2xl font-bold text-[#48a0ff]" />
              <p className="text-xs text-muted-foreground">
                {pickupPercentageDifference} from last month
              </p>
            </CardContent>
          </Card> */}
{/* 
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-semibold">Pickup</CardTitle>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="h-4 w-4 text-muted-foreground"
              >
                <rect width="20" height="14" x="2" y="5" rx="2" />
                <path d="M2 10h20" />
              </svg>
            </CardHeader>
            <CardContent>
              <CountUp start={0} end={pickupCount} duration={2.5} separator="," prefix="+" className="text-2xl font-bold text-[#48a0ff]" />
              <p className="text-xs text-muted-foreground">
                {pickupPercentageDifference} from last month
              </p>
            </CardContent>
          </Card> */}
   {/*
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-semibold">
                Active Now
              </CardTitle>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="h-4 w-4 text-muted-foreground text-green-600"
              >
                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
              </svg>
            </CardHeader>
            <CardContent>
              <CountUp start={0} end={activeNow} duration={2.5} separator="," prefix="+" className="text-2xl font-bold text-[#48a0ff]" />
              <p className="text-xs text-muted-foreground">
                {activeNowPercentageDifference} since last hour
              </p>
            </CardContent>
          </Card> */}
        </div>
        
          <Card className="lg:col-span-4">
            <CardHeader>
              <CardTitle>User Overview</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
              <Overview />
            </CardContent>
          </Card>
                 <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-7">
 <Card className="lg:col-span-4">
            <CardHeader>
              <CardTitle>Recent Pickup</CardTitle>
              <CardDescription>
                You made {pickupCount} pickups this month.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DataTableDemo />
            </CardContent>
          </Card>
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle>Todays Pickup</CardTitle>
              <CardDescription>
                Check progress on completing, pending or cancelled requests
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PieChartBox />
            </CardContent>
          </Card>
          <Card className="lg:col-span-7">
            <CardHeader>
              <CardTitle>Earnings</CardTitle>
              <CardDescription>
                Check earnings made
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Earnings />
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
