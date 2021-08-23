import React from 'react';
import Enzyme, { mount, shallow } from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import Layout from './layout';

Enzyme.configure({ adapter: new Adapter() });

Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(), // Deprecated
        removeListener: jest.fn(), // Deprecated
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
    })),
});

describe('Layout', () => {
    it('should render successfully', () => {
        const element = mount(<Layout _csrf={""} system_version={"2.0.0"} ><p></p></Layout>);
        expect(element.text()).toContain("ARTEMIS v.'2.0.0@HEAD'");

        expect(element.find('li')).toHaveLength(3);
        expect(element.text()).toContain("Create Account");
    });
});
