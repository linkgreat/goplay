"use client";

import React from "react";
import {RecoilRoot} from "recoil";

export const StateProvider = ({children}: { children: React.ReactNode }) => {
    // useCurrentLonLat();
    // useAtom(maxDistanceAtom);
    // useAtom(latestSecsAtom);
    // useAtom(useNextImageAtom);
    return (
        <RecoilRoot>
            {children}
        </RecoilRoot>
    )
}