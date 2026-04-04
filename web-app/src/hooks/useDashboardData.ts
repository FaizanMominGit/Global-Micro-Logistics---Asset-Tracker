"use client";

import { useQuery } from "@tanstack/react-query";

interface DashboardMetrics {
  activeShipments: number;
  transitEfficiency: number;
  alerts: number;
  totalFleet: number;
  offlineFleet: number;
}

const fetchDashboardMetrics = async (): Promise<DashboardMetrics> => {
  // Simulate network request mimicking a global API
  return new Promise((resolve) =>
    setTimeout(
      () =>
        resolve({
          activeShipments: 1234,
          transitEfficiency: 98.5,
          alerts: 12,
          totalFleet: 4562,
          offlineFleet: 124,
        }),
      1000
    )
  );
};

export function useDashboardData() {
  return useQuery({
    queryKey: ["dashboardMetrics"],
    queryFn: fetchDashboardMetrics,
  });
}
