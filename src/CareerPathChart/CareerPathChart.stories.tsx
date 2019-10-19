import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { CareerPathChart } from '.';
import {withKnobs, select, boolean} from '@storybook/addon-knobs';
import { CareerPathChartData } from './CareerPathChart';
import '../TreeChart/TreeChart/style/index.scss';

storiesOf('CareerPathChart', module)
    .addDecorator(withKnobs)
    .addParameters({
      info: {
        text: 'CareerPathChart widget.'
      }
    })
    .add('summary', () => {
      const data = {
        jobTitle: 'Accountant',
        futureJobs: {
          count: 6039,
          jobs: [
            {
              jobTitle: 'Accounting Manager',
              url: '/research/US/Job=Accounting_Manager/Salary',
              count: 500,
              compensation: 69766.27117235566,
              isHourly: false,
              futureJobs: {
                count: 4507,
                jobs: [
                  {
                    jobTitle: 'Financial Controller',
                    url: '/research/US/Job=Financial_Controller/Salary',
                    count: 642,
                    compensation: 81208.146638891,
                    isHourly: false
                  },
                  {
                    jobTitle: 'Corporate Controller',
                    url: '/research/US/Job=Corporate_Controller/Salary',
                    count: 405,
                    compensation: 95539.36287471383,
                    isHourly: false
                  },
                  {
                    jobTitle: 'Assistant Controller',
                    url: '/research/US/Job=Assistant_Controller/Salary',
                    count: 206,
                    compensation: 73199.82853645743,
                    isHourly: false
                  }
                ]
              }
            },
            {
              jobTitle: 'Bookkeeper',
              url: '/research/US/Job=Bookkeeper/Hourly_Rate',
              count: 118,
              compensation: 41715.71453215485,
              isHourly: false,
              futureJobs: {
                count: 2997,
                jobs: [
                  {
                    jobTitle: 'Staff Accountant',
                    url: '/research/US/Job=Staff_Accountant/Salary',
                    count: 252,
                    compensation: 49459.90751684296,
                    isHourly: false
                  },
                  {
                    jobTitle: 'Accountant',
                    url: '/research/US/Job=Accountant/Salary',
                    count: 233,
                    compensation: 50815.33082630352,
                    isHourly: false
                  },
                  {
                    jobTitle: 'Full Charge Bookkeeper',
                    url: '/research/US/Job=Full_Charge_Bookkeeper/Hourly_Rate',
                    count: 228,
                    compensation: 48376.89876999054,
                    isHourly: false
                  }
                ]
              }
            },
            {
              jobTitle: 'Accounting Supervisor',
              url: '/research/US/Job=Accounting_Supervisor/Salary',
              count: 117,
              compensation: 63703.42063404577,
              isHourly: false,
              futureJobs: {
                count: 1218,
                jobs: [
                  {
                    jobTitle: 'Accounting Manager',
                    url: '/research/US/Job=Accounting_Manager/Salary',
                    count: 278,
                    compensation: 69766.27117235566,
                    isHourly: false
                  },
                  {
                    jobTitle: 'Financial Controller',
                    url: '/research/US/Job=Financial_Controller/Salary',
                    count: 87,
                    compensation: 81208.146638891,
                    isHourly: false
                  },
                  {
                    jobTitle: 'Senior Accountant',
                    url: '/research/US/Job=Senior_Accountant/Salary',
                    count: 63,
                    compensation: 66139.79189999116,
                    isHourly: false
                  }
                ]
              }
            }
          ]
        }
      };
      return <StoryContainer data={data} />;
    });

export interface StoryContainerProps {
  data: CareerPathChartData;
}

const StoryContainer = (props: StoryContainerProps) => {
      const key = JSON.stringify(props);
      return (
        <CareerPathChart
          key={key}
          data={props.data}
          detailToShow={select('detailToShow', [ 'comp', 'link'], 'comp')}
          showTwoLevels={boolean('showTwoLevels', true)}
        />
      );
    };