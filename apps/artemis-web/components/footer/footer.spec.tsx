import React from 'react';
import Enzyme, { mount } from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import Footer from './footer';

Enzyme.configure({ adapter: new Adapter() });

describe('Footer', () => {
  it('should render successfully', () => {
    const element = mount(<Footer system_version={'2.0.0'} />);
    expect(element.text()).toContain("ARTEMIS v.'2.0.0@HEAD'");
  });
});
