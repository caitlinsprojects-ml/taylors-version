// setup file
import {configure} from "enzyme";
import Adapter from "enzyme-adapter-react-16";
// configure enzyme to use correct react adapter
configure({adapter: new Adapter()});

// require all modules ending in ".spec" from the
// current directory and all subdirectories
const testsContext = require.context(".", true, /.spec\.js$/);

testsContext.keys().forEach(testsContext);