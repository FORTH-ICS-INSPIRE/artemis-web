import React from 'react';

import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Link from "next/link";
import Header from "./Header";

configure({adapter: new Adapter()});

describe('<Header />', () => {
    it('should render the overview, bgp updates, hijack pages if logged in', () => {
        let wrapper;

        beforeEach(() => {
            wrapper = shallow(<Header />);
        });
        expect(wrapper.find(Link)).toHaveLength(4);
    });
}); 
