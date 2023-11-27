"use client";

import {useEffect, useRef} from "react";
import AMapLoader from '@amap/amap-jsapi-loader';
import {message} from "antd";
import {useCurrentLonLatRecoil} from "@/store/states/location";

if (typeof window !== "undefined") {
    window._AMapSecurityConfig = {
        securityJsCode: '06daddad9961f53836f088aba0769b4f',
    }
}
export const useAMap = (ref) => {
    const mapRef = useRef();
    const posRef = useRef({
        marker: null, circle: null
    })

    const {pos, locate} = useCurrentLonLatRecoil();
    useEffect(() => {
        setTimeout(() => {
            mapRef.current?.setFitView?.(posRef.current.marker);
        }, 1000)
    }, [])

    useEffect(() => {
        if (pos?.length > 1) {
            posRef.current.marker?.setPosition?.(pos);
            posRef.current.circle?.setCenter?.(pos);

        }
    }, [pos]);
    const updateLocation = () => {
        locate();
        setTimeout(() => {
            mapRef.current?.setFitView?.(posRef.current.marker);
        }, 500);
    }
    const createMap = async (elem) => {
        try {


            const AMap = await AMapLoader.load({
                "key": "2ff2278a68dec53ee974216552ee934f",              // 申请好的Web端开发者Key，首次调用 load 时必填
                "version": "2.0",   // 指定要加载的 JS API 的版本，缺省时默认为 1.4.15
                "plugins": ['AMap.Geolocation', 'AMap.MouseTool', 'AMap.Scale'],           // 需要使用的的插件列表，如比例尺'AMap.Scale'等
            });
            const map = new AMap.Map(elem, {
                zooms: [2, 30],
            });
            const posIcon = new AMap.Icon({
                // 图标的取图地址
                image: 'https://oss.ydncloud.com/icons/map/point.png',
                // 图标所用图片大小
                imageSize: new AMap.Size(24, 24),
                // 图标取图偏移量
                imageOffset: new AMap.Pixel(0, 0)
            });
            posRef.current.posMarker = new AMap.Marker({
                anchor: 'center',
                icon: posIcon,
                rank: 1,
                zIndex: 100,
                zooms: [2, 40],
                position: [118.69678067196737, 32.16129927492832],
            });
            posRef.current.posCircle = new AMap.CircleMarker({
                radius: 24,//3D视图下，CircleMarker半径不要超过64px
                strokeColor: 'white',
                strokeWeight: 2,
                strokeOpacity: 0.5,
                fillColor: '#3aa8f1',
                fillOpacity: 0.4,
                zIndex: 10,
                bubble: true,
                zooms: [12, 40],
                cursor: 'pointer',
                clickable: true,
                center: [118.69678067196737, 32.16129927492832],
            });
            let geolocation = new AMap.Geolocation({
                enableHighAccuracy: true,//是否使用高精度定位，默认:true
                timeout: 10000,          //超过10秒后停止定位，默认：5s
                // position: 'RB',    //定位按钮的停靠位置
                convert: true,
                showCircle: false,
                showButton: false,
                panToLocation: false,
                zoomToAccuracy: false,
                // offset: [10, 20], //定位按钮与设置的停靠位置的偏移量，默认：[10, 20]

            });
            map.add?.(posRef.current.posMarker);
            map.add?.(posRef.current.posCircle);
            mapRef.current = map;
            console.log("map created:");
            // AMap.plugin(["AMap.Geolocation"], function () {
            //
            //     //map.addControl(geolocation);
            //     //map.locator = geolocation;
            //     map.intervalID = setInterval(() => {
            //         //updatePos();
            //     }, 5000);
            // });
        } catch (e) {
            message.error(`初始化地图失败:${e.message}`);
        }

    }
    useEffect(() => {
        if (ref.current) {
            createMap(ref.current).catch(e => message.error(`创建地图失败:${e.message}`));
        }
    }, [ref.current])

    useEffect(() => {
        const map = mapRef.current;

        if (map) {
            map.on?.('zoomchange', ev => {
            })
            return () => {
                console.log("destroy map");
                if (map.intervalID) {
                    console.log("clear interval:", map.intervalID);
                    clearInterval(map.intervalID);
                }
                map.destroy?.();
            }
        }
        //console.log("got map:", map);
    }, [mapRef.current]);


    return {map: mapRef.current, updateLocation, pos};
}