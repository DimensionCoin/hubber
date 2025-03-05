"use client";

import React, { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Sample data for metrics
const sampleMetrics = {
  monthlyRevenue: 42500,
  previousMonthRevenue: 38000,
  activeProjects: 8,
  previousMonthProjects: 6,
  clientSatisfaction: 92,
  previousMonthSatisfaction: 89,
  employeeUtilization: 87,
  previousMonthUtilization: 85,
};

const CompanyKeyMetrics = () => {
  const [isMetricsVisible, setIsMetricsVisible] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getMetricChange = (current: number, previous: number) => {
    const percentChange = ((current - previous) / previous) * 100;
    return {
      value: Math.abs(percentChange).toFixed(1),
      isPositive: percentChange >= 0,
    };
  };

  return (
    <div>
      <section>
        {/* Toggle Button */}
        <button
          onClick={() => setIsMetricsVisible(!isMetricsVisible)}
          className="
            flex 
            items-center 
            gap-2 
            text-xl 
            font-semibold 
            text-white 
            mb-4 
            bg-zinc-800 
            hover:bg-zinc-700 
            px-4 
            py-2 
            rounded-lg 
            transition-colors 
            duration-200"
        >
          {isMetricsVisible ? "Hide Metrics" : "Show Metrics"}
          {isMetricsVisible ? (
            <ChevronUp className="w-5 h-5 text-teal-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-teal-400" />
          )}
        </button>

        {/* Metrics Dropdown Content */}
        {isMetricsVisible && (
          <div
            className="
              grid 
              grid-cols-1 
              sm:grid-cols-2 
              lg:grid-cols-4 
              gap-4 
              transition-all 
              duration-300 
              ease-in-out 
              transform 
              origin-top 
              scale-y-100"
          >
            {/* Revenue Metric */}
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-zinc-300">
                  Monthly Revenue
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline justify-between">
                  <div className="text-2xl font-bold text-white">
                    {formatCurrency(sampleMetrics.monthlyRevenue)}
                  </div>
                  <div
                    className={`flex items-center text-xs font-medium ${
                      getMetricChange(
                        sampleMetrics.monthlyRevenue,
                        sampleMetrics.previousMonthRevenue
                      ).isPositive
                        ? "text-emerald-500"
                        : "text-red-500"
                    }`}
                  >
                    {getMetricChange(
                      sampleMetrics.monthlyRevenue,
                      sampleMetrics.previousMonthRevenue
                    ).isPositive ? (
                      <ArrowUpRight className="h-3 w-3 mr-1" />
                    ) : (
                      <ArrowDownRight className="h-3 w-3 mr-1" />
                    )}
                    {
                      getMetricChange(
                        sampleMetrics.monthlyRevenue,
                        sampleMetrics.previousMonthRevenue
                      ).value
                    }
                    %
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-0">
                <p className="text-xs text-zinc-400">Compared to last month</p>
              </CardFooter>
            </Card>

            {/* Active Projects Metric */}
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-zinc-300">
                  Active Projects
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline justify-between">
                  <div className="text-2xl font-bold text-white">
                    {sampleMetrics.activeProjects}
                  </div>
                  <div
                    className={`flex items-center text-xs font-medium ${
                      getMetricChange(
                        sampleMetrics.activeProjects,
                        sampleMetrics.previousMonthProjects
                      ).isPositive
                        ? "text-emerald-500"
                        : "text-red-500"
                    }`}
                  >
                    {getMetricChange(
                      sampleMetrics.activeProjects,
                      sampleMetrics.previousMonthProjects
                    ).isPositive ? (
                      <ArrowUpRight className="h-3 w-3 mr-1" />
                    ) : (
                      <ArrowDownRight className="h-3 w-3 mr-1" />
                    )}
                    {
                      getMetricChange(
                        sampleMetrics.activeProjects,
                        sampleMetrics.previousMonthProjects
                      ).value
                    }
                    %
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-0">
                <p className="text-xs text-zinc-400">Compared to last month</p>
              </CardFooter>
            </Card>

            {/* Client Satisfaction Metric */}
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-zinc-300">
                  Client Satisfaction
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline justify-between">
                  <div className="text-2xl font-bold text-white">
                    {sampleMetrics.clientSatisfaction}%
                  </div>
                  <div
                    className={`flex items-center text-xs font-medium ${
                      getMetricChange(
                        sampleMetrics.clientSatisfaction,
                        sampleMetrics.previousMonthSatisfaction
                      ).isPositive
                        ? "text-emerald-500"
                        : "text-red-500"
                    }`}
                  >
                    {getMetricChange(
                      sampleMetrics.clientSatisfaction,
                      sampleMetrics.previousMonthSatisfaction
                    ).isPositive ? (
                      <ArrowUpRight className="h-3 w-3 mr-1" />
                    ) : (
                      <ArrowDownRight className="h-3 w-3 mr-1" />
                    )}
                    {
                      getMetricChange(
                        sampleMetrics.clientSatisfaction,
                        sampleMetrics.previousMonthSatisfaction
                      ).value
                    }
                    %
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-0">
                <p className="text-xs text-zinc-400">Compared to last month</p>
              </CardFooter>
            </Card>

            {/* Employee Utilization Metric */}
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-zinc-300">
                  Employee Utilization
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline justify-between">
                  <div className="text-2xl font-bold text-white">
                    {sampleMetrics.employeeUtilization}%
                  </div>
                  <div
                    className={`flex items-center text-xs font-medium ${
                      getMetricChange(
                        sampleMetrics.employeeUtilization,
                        sampleMetrics.previousMonthUtilization
                      ).isPositive
                        ? "text-emerald-500"
                        : "text-red-500"
                    }`}
                  >
                    {getMetricChange(
                      sampleMetrics.employeeUtilization,
                      sampleMetrics.previousMonthUtilization
                    ).isPositive ? (
                      <ArrowUpRight className="h-3 w-3 mr-1" />
                    ) : (
                      <ArrowDownRight className="h-3 w-3 mr-1" />
                    )}
                    {
                      getMetricChange(
                        sampleMetrics.employeeUtilization,
                        sampleMetrics.previousMonthUtilization
                      ).value
                    }
                    %
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-0">
                <p className="text-xs text-zinc-400">Compared to last month</p>
              </CardFooter>
            </Card>
          </div>
        )}
      </section>
    </div>
  );
};

export default CompanyKeyMetrics;
