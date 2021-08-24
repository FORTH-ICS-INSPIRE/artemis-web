import React from 'react';
import Enzyme, { mount } from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import StatusTable from './status-table';

Enzyme.configure({ adapter: new Adapter() });

describe('StatsTable', () => {
  it('should render successfully', () => {
    const element = mount(
      <StatusTable
        data={{
          view_processes: [
            { name: 'test', running: true, timestamp: Date.now() },
          ],
        }}
      />
    );
    expect(element.text()).toContain('Monitor (tap) Microservices');
  });
});
