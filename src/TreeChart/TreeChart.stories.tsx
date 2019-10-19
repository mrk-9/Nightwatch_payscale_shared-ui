import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { TreeChart } from '.';
import {withKnobs, object, select, boolean} from '@storybook/addon-knobs';
import '../TreeChart/TreeChart/style/index.scss';

storiesOf('TreeChart', module)
    .addDecorator(withKnobs)
    .addParameters({
      info: {
        text: 'TreeChart widget.'
      }
    })
    .add('summary', () => {
      const defaultValue = {
          name: 'Software Engineer',
          leaves: [
            {
              name: 'Senior Software Engineer',
              value: 103000,
              url: '/research/US/Job=Senior_Software_Engineer/Salary',
              percentage: .2,
              leaves: [
                {
                  name: 'Architect',
                  value: 130000,
                  url: '/research/US/Job=Architect/Salary',
                  percentage: .3
                },
                {
                  name: 'Principal Software Engineer',
                  value: 130000,
                  url: '/research/US/Job=Principal_Software_Engineer/Salary',
                  percentage: .15
                },
                {
                  name: 'Senior Software Architect',
                  value: 130000,
                  url: '/research/US/Job=Principal_Software_Engineer/Salary',
                  percentage: .23
                }
              ]
            },
            {
              name: 'Lead Software Engineer',
              value: 105000,
              url: '/research/US/Job=Lead_Software_Engineer/Salary',
              percentage: .3,
              leaves: [
                {
                  name: 'Software Development Manager',
                  value: 130000,
                  url: '/research/US/Job=Architect/Salary',
                  percentage: .4
                },
                {
                  name: 'Solutions Architect',
                  value: 130000,
                  url: '/research/US/Job=Principal_Software_Engineer/Salary',
                  percentage: .1
                },
                {
                  name: 'Lead Software Engineer',
                  value: 130000,
                  url: '/research/US/Job=Principal_Software_Engineer/Salary',
                  percentage: .2
                }
              ]
            },
            {
              name: 'Software Architect',
              value: 102000,
              url: '/research/US/Job=Software_Architect/Salary',
              percentage: .1,
              leaves: [
                {
                  name: 'Software Engineering Manager',
                  value: 130000,
                  url: '/research/US/Job=Architect/Salary',
                  percentage: .2
                },
                {
                  name: 'Software Development Director',
                  value: 130000,
                  url: '/research/US/Job=Principal_Software_Engineer/Salary',
                  percentage: .4
                },
                {
                  name: 'Software Architect, Applications',
                  value: 130000,
                  url: '/research/US/Job=Principal_Software_Engineer/Salary',
                  percentage: .1
                }
              ]
            }
          ]
        };
      const treeChartData = object('treeChartData', defaultValue);
      return <StoryContainer treeChartData={treeChartData} />;
    })
    .add('single', () => (
      <TreeChart
        treeChartData={{
          name: 'Software Engineer'
        }}
      />
    ))
    .add('complex', () => (
      <TreeChart
        treeChartData={{
          name: 'Junior Software Engineer',
          leaves: [
            {
              name: 'Software Engineer',
              value: 84065,
              url: '/research/US/Job=Software_Engineer/Salary',
              percentage: .3,
              leaves: [
                {
                  name: 'Senior Software Engineer',
                  value: 103000,
                  url: '/research/US/Job=Senior_Software_Engineer/Salary',
                  percentage: .2,
                  leaves: [
                    {
                      name: 'Software Architect',
                      value: 121502,
                      url: '/research/US/Job=Software_Architect/Salary',
                      percentage: .1,
                      leaves: [
                        {
                          name: 'Solutions Architect',
                          value: 115789,
                          url: '/research/US/Job=Solutions_Architect/Salary',
                          percentage: .5
                        },
                        {
                          name: 'Senior Software Architect',
                          value: 129823,
                          url: '/research/US/Job=Senior_Software_Architect/Salary',
                          percentage: .3
                        }
                      ]
                    },
                    {
                      name: 'Principal Software Engineer',
                      value: 130000,
                      url: '/research/US/Job=Principal_Software_Engineer/Salary',
                      percentage: .1
                    },
                    {
                      name: 'Senior Software Architect',
                      value: 130000,
                      url: '/research/US/Job=Principal_Software_Engineer/Salary',
                      percentage: .23
                    }
                  ]
                }
              ]
            },
            {
              name: 'Software Engineer / Developer / Programmer',
              value: 75997,
              url: '/research/US/Job=Software_Engineer_%2f_Developer_%2f_Programmer/Salary',
              percentage: .2,
              leaves: [
                {
                  name: 'Senior Software Engineer',
                  value: 103000,
                  url: '/research/US/Job=Senior_Software_Engineer/Salary',
                  percentage: .1
                },
                {
                  name: 'Principal Software Engineer',
                  value: 130000,
                  url: '/research/US/Job=Principal_Software_Engineer/Salary',
                  percentage: .24
                }
              ]
            },
            {
              name: 'Software Developer',
              value: 69908,
              url: '/research/US/Job=Software_Developer/Salary',
              percentage: .6
            }
          ]
        }}
      />
    )
  );

export interface StoryContainerProps {
  treeChartData: object;
}

const StoryContainer = (props: StoryContainerProps) => {
  const key = JSON.stringify(props.treeChartData);
  return (
    <TreeChart
      key={key}
      treeChartData={props.treeChartData}
      detailToShow={select('detailToShow', [ 'comp', 'link'], 'comp')}
      showTwoLevels={boolean('showTwoLevels', true)}
    />
  );
};