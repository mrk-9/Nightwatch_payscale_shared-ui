import * as React from 'react';
import { TreeChart, TreeChartData } from '../../TreeChart';

export interface CareerPathChartData {
  count?: number; // The total count of profiles at this level
  jobs?: CareerPathJob[]; // The array of future jobs for this job title
  jobTitle?: string; // The name of the job
}

export interface CareerPathJob {
  compensation?: number; // The compensation for this job
  count?: number; // The total count of profiles at this level
  futureJobs?: CareerPathChartData; // The DTO that contains the future jobs for this job.
  isHourly?: boolean; // Whether this job title is hourly
  jobTitle?: string; // The name of the job
  url?: string; // The url for this job page
}

export interface CareerPathChartProps {
  data: CareerPathJob;
  detailToShow?: 'link' | 'comp'; // which detail to show below each leaf
  showTwoLevels?: boolean; // if 'true' show two levels deep, else show one level
}

const formatDataForTreeChart = (data: CareerPathJob, totalCount?: number): TreeChartData => {
  const { futureJobs } = data;
  if (!data) {
    return null;
  }
  return {
    name: data.jobTitle,
    value: data.compensation,
    url: data.url,
    leaves: futureJobs && futureJobs.count > 0
      ? futureJobs.jobs.map(x => formatDataForTreeChart(x, futureJobs.count))
      : null,
    percentage: totalCount && data.count > 0 ? data.count / totalCount : undefined
  };
};

const CareerPathChart = (props: CareerPathChartProps): JSX.Element => {
  const treeChartData = formatDataForTreeChart(props.data);
  return (
    <TreeChart
      key={JSON.stringify(props)}
      treeChartData={treeChartData}
      detailToShow={props.detailToShow}
      showTwoLevels={props.showTwoLevels}
    />
  );
};

export { CareerPathChart };
export default CareerPathChart;