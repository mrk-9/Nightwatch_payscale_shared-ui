import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

const requireAll = (requireContext) => {
    requireContext.keys().map(requireContext);
};

requireAll(require.context('.', true, /.+\.spec\.[jt]sx?$/));
