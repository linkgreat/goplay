"use client";

import "@amap/amap-jsapi-types";
import {useEffect, useRef, useState} from "react";
import {useAMap} from "@/app/components/amap";
import "./map_view.css";

export function MapView() {
    const ref = useRef(null);
    const [markers, setMarkers] = useState<any[]>([]);
    const {map, updateLocation, pos} = useAMap(ref);
    const [ready, setReady] = useState(false);

    useEffect(() => {
        if (ready && map && markers?.length > 0) {
            console.log("add", markers.length, "markers");
            // @ts-ignore
            map.add(markers);


            return () => {
                if (markers?.length > 0) {
                    markers?.forEach(o => {
                        o.remove();
                    })
                    console.log("removed", markers.length, "markers");
                }
            }
        }


    }, [ready, map, markers]);

    return (
        <>

            <div ref={ref} style={{width: "100%", height: "calc(100vh - 16px)"}}/>

        </>
    )
}