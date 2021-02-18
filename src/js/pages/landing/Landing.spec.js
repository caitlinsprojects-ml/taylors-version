import {Button} from "@material-ui/core";
import {shallow} from "enzyme";
import React from "react";
import {useTranslationStub} from "../../../testUtils/hookStubs";
import useAuthToken from "../../hooks/useAuthToken";
import useStickyState from "../../hooks/useStickyState";
import {hooks, Landing} from "./Landing";

describe("App", () => {
    let historySpy;
    let dispatchSpy;
    let useStickyStateSpy;
    let useAuthTokenSpy;
    let useLocationSpy;

    beforeEach(() => {
        spyOn(hooks, "useTranslation").and.callFake(useTranslationStub);
        historySpy = createSpyObj("history", ["push"]);
        spyOn(hooks, "useHistory").and.returnValue(historySpy);
        dispatchSpy = createSpy("dispatch");
        spyOn(hooks, "useDispatch").and.returnValue(dispatchSpy);
        useStickyStateSpy = spyOn(hooks, "useStickyState").and.returnValue(["testUuidValue"]);
        useAuthTokenSpy = spyOn(hooks, "useAuthToken").and.returnValue(false);
        useLocationSpy = spyOn(hooks, "useLocation").and.returnValue({});
    });

    describe("should render the correct button", () => {
        it("when there already a valid token", () => {
            useAuthTokenSpy.and.returnValue("testTokenValue");
            const wrapper = shallow(<Landing/>);
            const button = wrapper.find(Button);

            expect(button.length).toEqual(1);
            expect(button.prop("onClick")).toEqual(jasmine.any(Function));
            expect(button.text()).toEqual("landing.start");
        });

        it("when there is no token saved", () => {

        });
    });
});