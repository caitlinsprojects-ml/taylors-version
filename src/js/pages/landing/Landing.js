import {Button} from "@material-ui/core";
import {isEmpty} from "lodash";
import queryString from "query-string";
import React, {Fragment, useEffect} from "react";
import {useTranslation} from "react-i18next";
import {useDispatch} from "react-redux";
import {useHistory, useLocation} from "react-router-dom";
import {storeToken} from "../../actions/AuthActions";
import useAuthToken from "../../hooks/useAuthToken";
import useStickyState from "../../hooks/useStickyState";
import SpotifyTokenButton from "./SpotifyTokenButton";

export const hooks = {
    useTranslation,
    useHistory,
    useDispatch,
    useStickyState,
    useAuthToken,
    useLocation,
};

export const Landing = () => {
    const {t} = hooks.useTranslation();
    const history = hooks.useHistory();
    const dispatch = hooks.useDispatch();

    const [state] = hooks.useStickyState("spotifyState");
    const token = hooks.useAuthToken();

    // detect incoming token
    const params = hooks.useLocation();
    const responseSearch = params && params.search && queryString.parse(params.search);
    const responseHash = params && params.hash && queryString.parse(params.hash);
    const incomingToken = responseHash && responseHash.access_token;

    const invalidIncomingToken = incomingToken && state !== responseHash.state;

    const nextStep = () => history.push("/setup");

    // check the response was good
    if (invalidIncomingToken) {
        // returned token didn't match the token we have saved, likely the original authorise request didn't originate from this site
        // TODO replace this with a notification of some sort
        console.error("Spotify state token mismatch");
    } else if (!isEmpty(responseSearch.error)) {
        // there was an error in the OAuth flow, the user probably declined the permissions
        // TODO replace this with a notification of some sort
        console.info("User declined permissions");
    }

    useEffect(() => {
        // save incoming token with expiration time
        if (incomingToken !== token && !isEmpty(incomingToken)) {
            // a new token has just been received
            dispatch(storeToken(incomingToken, Date.now() + (responseHash.expires_in * 1000)));
            //redirect the user to the next page
            nextStep();
        }
    }, [incomingToken]);

    return (
        <Fragment>
            {token
                ? <Button onClick={nextStep}>{t("landing.start")}</Button>
                : <SpotifyTokenButton/>}
        </Fragment>
    );
};

export default Landing;