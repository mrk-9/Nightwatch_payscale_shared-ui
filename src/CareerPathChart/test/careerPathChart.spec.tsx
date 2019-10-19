import * as React from 'react';
import { mount} from 'enzyme';
import CareerPathChart from '../CareerPathChart/index';
import { TreeChart } from '../../TreeChart';

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

describe('CareerPathChart', () => {
    it('should convert the data correctly for TreeChart', () => {
        const result = mount(<CareerPathChart data={data} /> );
        const props = result.find(TreeChart).props();
        expect(props.treeChartData.name).toEqual('Accountant');
        expect(props.treeChartData.leaves.length).toEqual(3);
        expect(props.treeChartData.leaves[0].name).toEqual('Accounting Manager');
        expect(props.treeChartData.leaves[0].percentage.toFixed(2)).toEqual('0.08');
        expect(props.treeChartData.leaves[0].url).toEqual('/research/US/Job=Accounting_Manager/Salary');
        expect(props.treeChartData.leaves[0].value).toEqual(69766.27117235566);
        expect(props.treeChartData.leaves[0].leaves[0].name).toEqual('Financial Controller');
        expect(props.treeChartData.leaves[0].leaves[0].percentage.toFixed(2)).toEqual('0.14');
        expect(props.treeChartData.leaves[0].leaves[0].url).toEqual('/research/US/Job=Financial_Controller/Salary');
    });

    it('renders without name if missing job title', () => {
        const result = mount(
            <CareerPathChart
                data={{
                  futureJobs: {
                    count: 90,
                    jobs: [{
                      count: 20,
                      jobTitle: 'Baker',
                      url: '/baker',
                      compensation: 10000,
                      futureJobs: {
                        count: 18,
                        jobs: [
                          {
                              count: 5,
                              jobTitle: 'Pastry Chef',
                              url: '/pastry'
                          },
                          {
                              count: 4,
                              jobTitle: 'Meat Chef',
                              url: '/meat'
                          },
                          {
                              count: 2,
                              jobTitle: 'Cookie Chef',
                              url: '/cookie'
                          }
                      ]
                    }
                  }]
                }
              }}
            />
        );
        expect(result.find('.tree-chart__root__name').text()).toEqual('');
    });

    it('doesnt render if no data', () => {
        const result = mount(<CareerPathChart data={{}} /> );
        expect(result.find('svg').length).toBe(0);
    });

    it('doesnt render leaves if missing total count', () => {
        const missingCountData = JSON.parse(JSON.stringify(data));
        missingCountData.futureJobs.count = null;
        const result = mount(
        <CareerPathChart data={missingCountData} />);
        expect(result.find('svg').length).toBe(0);
    });
});
